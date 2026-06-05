---
sidebar_position: 5
title: DigitalOcean Kubernetes (DOKS) Deployment
description: Deploy a LaraKube app to DigitalOcean Kubernetes with automatic TLS and self-hosted services.
---

# 🚀 Deploy to DigitalOcean Kubernetes (DOKS)

LaraKube supports **DigitalOcean Kubernetes (DOKS)** as a managed multi-node cluster platform. This guide walks you through deployment with automatic HTTPS via Traefik and self-hosted services (Postgres, Redis) in Kubernetes.

## Prerequisites

- ✅ A LaraKube project (created with `larakube new`)
- ✅ A DigitalOcean account with billing enabled
- ✅ `doctl` CLI installed and authenticated (`doctl auth login`)
- ✅ `kubectl` installed locally
- ✅ `helm` installed locally
- ✅ A domain name (for DNS)

## Step 1: Create the DOKS Cluster

Create a 2-node DOKS cluster:

```bash
doctl kubernetes cluster create my-larakube-cluster \
  --region nyc3 \
  --version latest \
  --node-pool "name=pool-1;size=s-2vcpu-4gb;count=2" \
  --enable-monitoring
```

Save the kubeconfig:

```bash
doctl kubernetes cluster kubeconfig save my-larakube-cluster
kubectl cluster-info  # Verify connection
```

## Step 2: Provision Traefik & Get LoadBalancer IP

Run the LaraKube automation command:

```bash
larakube cloud:provision doks
```

This will:
1. ✅ Install Traefik ingress controller
2. ✅ Wait for LoadBalancer IP assignment
3. ✅ Prompt for Let's Encrypt email
4. ✅ Output LoadBalancer IP and next steps

**Output example:**
```
LoadBalancer IP assigned: 123.45.67.89

Next steps:
1. Point your domain to 123.45.67.89 (A record)
2. Update .larakube.json with your configuration
3. Deploy: larakube cloud:deploy production
```

## Step 3: Configure DNS

Create an A record pointing to the LoadBalancer IP:

- **Name**: `app` (or your desired subdomain)
- **Type**: A
- **Value**: `123.45.67.89` (from Step 2)
- **TTL**: 3600

Wait 5-10 minutes for DNS propagation.

## Step 4: Update Your LaraKube Blueprint

Edit `.larakube.json` to target DOKS with self-hosted services:

```json
{
  "name": "my-app",
  "serverVariation": "fpm-nginx",
  "phpVersion": "8.4",
  "database": "postgres",
  "strategy": "multi-node-ha",
  "features": ["horizon", "queues", "scheduler"],
  "environments": {
    "local": {},
    "production": {
      "ingress": "traefik",
      "strategy": "multi-node-ha",
      "hosts": {
        "web": "app.example.com"
      },
      "storageClass": "do-block-storage",
      "registry": {
        "provider": "ghcr"
      }
    }
  }
}
```

**Key configuration:**
- `ingress: "traefik"` — Matches DOKS's Traefik installation
- `strategy: "multi-node-ha"` — High availability across cluster nodes
- `storageClass: "do-block-storage"` — DigitalOcean block storage for PVCs
- `registry` — Container registry for deployments (GHCR or Docker Hub)
- **Note:** No `"managed"` field → Postgres/Redis deployed as K8s pods (like VPS)

## Step 5: Configure Registry

Set up your container registry for CI/CD deployments:

```bash
larakube cloud:configure registry
```

When prompted:
- **Environment**: `production`
- **Provider**: `ghcr` (GitHub Container Registry) or `dockerhub`
- **Image** (optional): Your registry path (e.g., `owner/my-app`)

This enables both `cloud:deploy` (manual) and GitHub Actions (CI/CD) to push images.

## Step 6: Update .env.production

Create or update `.env.production` with your app configuration:

```bash
APP_URL=https://app.example.com
DB_HOST=postgres.production.svc.cluster.local
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=postgres
DB_PASSWORD=<generate-strong-password>
REDIS_HOST=redis.production.svc.cluster.local
REDIS_PORT=6379
```

K8s pods auto-discover each other via service DNS names. Store sensitive values securely (use `larakube cloud:deploy` or GitHub Secrets).

## Step 7: Deploy

### Option A: Manual Deploy (Quick Testing)

Deploy directly from your machine:

```bash
larakube cloud:deploy production
```

This will:
1. Build your Docker image
2. Push to your configured registry (GHCR or Docker Hub)
3. Apply Kubernetes manifests
4. Wait for rollout to complete

### Option B: GitHub Actions (Recommended for Production)

Set up automated CI/CD:

```bash
larakube cloud:configure gha
```

When prompted:
- **Environment**: `production`
- **Cluster context**: Your DOKS cluster context (e.g., `do-nyc3-my-larakube-cluster`)

This generates `.github/workflows/larakube-deploy-production.yml` which:
1. Builds & tests your app
2. Builds Docker image
3. Pushes to your registry
4. Deploys to DOKS

Trigger deployment:

```bash
git push origin main
```

## Step 8: Verify Deployment

Check pod status:

```bash
kubectl get pods -n my-app-production
```

View logs:

```bash
kubectl logs -n my-app-production deployment/web -f
```

Visit your domain:

```
https://app.example.com
```

Browser should show your Laravel app with valid Let's Encrypt certificate.

---

## Troubleshooting

### ❌ LoadBalancer IP stuck on `<pending>`

Traefik may still be starting:

```bash
kubectl get svc -n traefik
# Wait 1-2 minutes and retry
```

### ❌ DNS not resolving

Verify DNS propagation:

```bash
nslookup app.example.com
# Should return: 123.45.67.89
```

If still showing old IP, wait another 5 minutes and clear your browser cache.

### ❌ App pod won't start

Check logs:

```bash
kubectl logs -n my-app-production deployment/web
```

Common issues:
- `.env.production` missing or incomplete
- Image pull failed (check registry credentials)
- Database service not reachable (`DB_HOST` wrong)

### ❌ Database connection refused

Verify Postgres pod is running:

```bash
kubectl get pods -n my-app-production -l app=postgres
kubectl logs -n my-app-production deployment/postgres
```

Run migrations:

```bash
kubectl exec -n my-app-production deployment/web -- php artisan migrate:fresh --seed
```

### ❌ HTTPS certificate not working

Verify Traefik is routing correctly:

```bash
kubectl get ingress -n my-app-production
kubectl describe ingress -n my-app-production
```

Traefik automatically provisions Let's Encrypt certificates. Check Traefik logs:

```bash
kubectl logs -n traefik deployment/traefik -f | grep acme
```

---

## Architecture Diagram

```
Internet (DNS: app.example.com → 123.45.67.89)
    ↓
Traefik LoadBalancer Service (Port 80, 443)
    ↓
Traefik Ingress Controller (routes HTTP→HTTPS, cert renewal)
    ↓
Laravel Web Pod (Deployment/web)
    ↓
Postgres Pod (Deployment/postgres)
Redis Pod (Deployment/redis)
    ↓
Block Storage PVCs (do-block-storage class)
```

All services (web, postgres, redis, horizon, queues) are Kubernetes deployments with automatic scaling, rolling updates, and self-healing.

---

## Next Steps

- **Monitor**: Set up DOKS monitoring dashboard
- **Scale**: Adjust `replicas` in manifests or use Horizontal Pod Autoscaler
- **Backup**: Enable automated snapshots for block storage
- **Multi-env**: Create `staging` environment alongside `production`
- **Multi-tenancy**: Use `plex` for sharing Commons services across projects

## Further Reading

- [DigitalOcean Kubernetes Docs](https://docs.digitalocean.com/products/kubernetes/)
- [Traefik Documentation](https://doc.traefik.io/)
- [LaraKube Architecture](../architecture/blueprint-anatomy)
- [Multi-environment Deployments](../deployment/scaling-journey)

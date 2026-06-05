---
sidebar_position: 5
title: DigitalOcean Kubernetes (DOKS) Deployment
description: Deploy a LaraKube app to DigitalOcean Kubernetes with automatic TLS and managed databases.
---

# 🚀 Deploy to DigitalOcean Kubernetes (DOKS)

LaraKube supports **DigitalOcean Kubernetes (DOKS)** as a managed multi-node cluster platform. This guide walks you through a minimal end-to-end deployment with automatic HTTPS via cert-manager.

## Prerequisites

- ✅ A LaraKube project (created with `larakube new`)
- ✅ A DigitalOcean account with billing enabled
- ✅ `doctl` CLI installed and authenticated (`doctl auth login`)
- ✅ `kubectl` installed locally
- ✅ A GitHub repository with your project

## Step 1: Create the DOKS Cluster

Create a 2-node DOKS cluster:

```bash
doctl kubernetes cluster create my-larakube-cluster \
  --region nyc3 \
  --version latest \
  --node-pool "name=pool-1;size=s-2vcpu-4gb;count=2" \
  --enable-monitoring
```

Save the kubeconfig and set it as active:

```bash
doctl kubernetes cluster kubeconfig save my-larakube-cluster
kubectl cluster-info  # Verify connection
```

## Step 2: Install nginx Ingress & cert-manager

Install nginx ingress controller:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

Wait for the LoadBalancer IP:

```bash
kubectl get svc -n ingress-nginx  # Note the EXTERNAL-IP
```

Install cert-manager:

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

Create a Let's Encrypt ClusterIssuer:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

## Step 3: Configure DNS

Point your domain's DNS to the LoadBalancer IP:

```bash
# Get the LoadBalancer IP
kubectl get svc -n ingress-nginx nginx-ingress-ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Create an A record:
- **Name**: `app` (or your desired subdomain)
- **Type**: A
- **Value**: `<LoadBalancer IP>`
- **TTL**: 3600

Wait 5-10 minutes for DNS to propagate.

## Step 4: Update Your LaraKube Blueprint

Edit `.larakube.json` to target DOKS:

```json
{
  "name": "my-app",
  "serverVariation": "fpm-nginx",
  "phpVersion": "8.4",
  "database": "postgres",
  "strategy": "single-node",
  "features": ["horizon", "queues", "scheduler"],
  "environments": {
    "local": {},
    "production": {
      "ingress": "nginx",
      "strategy": "multi-node-ha",
      "managed": ["postgres", "redis"],
      "hosts": {
        "web": "app.example.com"
      },
      "storageClass": "do-block-storage",
      "certManagerIssuer": "letsencrypt-prod",
      "registry": {
        "provider": "ghcr"
      }
    }
  }
}
```

**Key points:**
- `ingress: "nginx"` — matches DOKS's nginx controller
- `strategy: "multi-node-ha"` — high availability across DOKS nodes
- `managed: ["postgres", "redis"]` — use DO Managed Postgres/Redis (recommended for production)
- `storageClass: "do-block-storage"` — DigitalOcean's block storage
- `certManagerIssuer: "letsencrypt-prod"` — automatic TLS via cert-manager
- `registry: { "provider": "ghcr" }` — use GitHub Container Registry (or `"dockerhub"` for Docker Hub)

## Step 5: Set Up CI/CD (GitHub Actions)

Configure the production environment for GitHub Actions deployment:

```bash
larakube cloud:configure gha
```

When prompted:
- **Environment**: `production`
- **Cluster context**: Use the DOKS kubeconfig context (usually `do-nyc3-my-larakube-cluster`)

This generates `.github/workflows/larakube-deploy-production.yml` which:
1. Builds your Docker image
2. Pushes to your configured registry (GHCR or Docker Hub)
3. Creates/updates ConfigMaps and Secrets from `.env`
4. Applies Kustomize overlays to your DOKS cluster

**Registry choice:** The workflow automatically detects your registry from the blueprint. If you specified `"provider": "ghcr"`, it will use GHCR (via `GITHUB_TOKEN`). For Docker Hub, use `"provider": "dockerhub"` and ensure `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are added to your GitHub repository.

## Step 6: Create Managed Databases

Create DO Managed Postgres and Redis:

**PostgreSQL:**
```bash
doctl databases create my-app-db \
  --engine pg \
  --region nyc3 \
  --num-nodes 1 \
  --version 15
```

Create a database and user:
```bash
doctl databases db create my-app-db my-app
doctl databases user create my-app-db larakube
```

**Redis:**
```bash
doctl databases create my-app-redis \
  --engine redis \
  --region nyc3 \
  --num-nodes 1 \
  --version 7
```

Get the connection strings from the DigitalOcean dashboard and set them in `.env.production`:

```bash
DB_HOST=my-app-db-xxx.db.ondigitalocean.com
DB_PORT=25060
DB_DATABASE=my-app
DB_USERNAME=larakube
DB_PASSWORD=<password>
REDIS_HOST=my-app-redis-xxx.db.ondigitalocean.com
REDIS_PORT=25061
REDIS_PASSWORD=<password>
```

## Step 7: Deploy

Push your code to GitHub:

```bash
git add .
git commit -m "Deploy to DOKS with managed databases"
git push origin main
```

GitHub Actions will:
1. Build & test your app
2. Build Docker image
3. Push to GHCR
4. Deploy to DOKS

Watch the workflow:
```bash
# In GitHub, go to Actions → larakube → Latest run
```

Verify the deployment:

```bash
kubectl get pods -n my-app-production
kubectl logs -n my-app-production deployment/web -f
```

## Step 8: Verify HTTPS

Visit `https://app.example.com` and verify the Let's Encrypt certificate:

```bash
# Check cert status
kubectl get certificate -n my-app-production

# Describe for more details
kubectl describe certificate -n my-app-production <cert-name>
```

---

## Troubleshooting

### ❌ Ingress shows `<pending>` for IP

The LoadBalancer service may not have an external IP yet:

```bash
kubectl get svc -n ingress-nginx
# Wait a few minutes and retry
```

### ❌ Certificate not issuing (cert-manager stuck)

Check cert-manager logs:

```bash
kubectl logs -n cert-manager deployment/cert-manager -f
```

Common issues:
- DNS not propagated yet (wait 10 minutes)
- ClusterIssuer email not valid
- Ingress class name doesn't match (`ingressClassName: nginx`)

### ❌ App pod won't start

Check pod logs:

```bash
kubectl logs -n my-app-production deployment/web
```

Common issues:
- `.env.production` missing or incomplete
- Database not accessible (check security groups)
- Docker image build failed (check GitHub Actions logs)

### ❌ Database connection refused

Verify the connection string and firewall rules:

```bash
# From a pod in the cluster
kubectl run -it --rm debug \
  --image=postgres:15 \
  --restart=Never \
  -- psql -h <DB_HOST> -U <DB_USER> -d <DB_NAME>
```

---

## Next Steps

- **Scale horizontally**: Change `strategy: "multi-node-ha"` and use managed databases
- **Add more environments**: Duplicate the `production` block in `.larakube.json` for staging
- **Custom domain**: Update DNS records to point multiple domains to the same LoadBalancer IP
- **Backups**: Enable automated backups on DO Managed Databases dashboard

## Further Reading

- [DigitalOcean Kubernetes Docs](https://docs.digitalocean.com/products/kubernetes/)
- [cert-manager Documentation](https://cert-manager.io/)
- [LaraKube Architecture](../architecture/blueprint-anatomy)
- [Managing Multiple Environments](../deployment/scaling-journey)

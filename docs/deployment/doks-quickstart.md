---
sidebar_position: 5
title: DigitalOcean Kubernetes (DOKS) Deployment
description: Deploy a LaraKube CLI app to DigitalOcean Kubernetes with automatic TLS, no hand-edited config, and either self-hosted or shared (Plex) services.
---

# 🚀 Deploy to DigitalOcean Kubernetes (DOKS)

LaraKube CLI treats **DigitalOcean Kubernetes (DOKS)** as a managed cluster: it installs Traefik (with Let's Encrypt) for you, builds your image and pushes it to a registry, and applies your manifests against the cluster's kube-context — no SSH, no hand-edited JSON, no Helm.

## Prerequisites

- ✅ A LaraKube CLI project (created with `larakube new`)
- ✅ A DigitalOcean account with billing enabled
- ✅ `doctl` CLI installed and authenticated (to create the cluster)
- ✅ `kubectl` installed locally
- ✅ A domain name you control (for DNS)

> No `helm` required — LaraKube CLI installs Traefik with plain `kubectl apply`.

### Install DigitalOcean CLI (doctl)

If you don't have `doctl` installed:

**macOS (Homebrew):**
```bash
brew install doctl
```

**Linux/Manual:**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.99.0/doctl-1.99.0-linux-x64.tar.gz
tar xf ~/doctl-1.99.0-linux-x64.tar.gz
sudo mv ~/doctl /usr/local/bin
```

**Windows (Chocolatey):**
```bash
choco install doctl
```

Then authenticate:

```bash
doctl auth init
# Follow the prompts to add your DigitalOcean API token
```

## Step 1: Create the DOKS cluster

**Recommended — let LaraKube CLI provision it:**

```bash
larakube cloud:create --provider=do --managed
```

This runs `tofu apply` to create the cluster, merges its kubeconfig locally, **and runs Step 2 (Traefik + Let's Encrypt) for you automatically** — see [Provisioning Infrastructure](./cloud-create) for the full walkthrough and [Provisioning with OpenTofu & Terraform](../architecture/provisioning) for how it works under the hood. If you use this path, skip ahead to [Step 3](#step-3-point-dns-at-the-loadbalancer-cname-pattern).

**Bring your own cluster instead:** if you'd rather create the cluster yourself (DigitalOcean UI, `doctl`, or an already-existing cluster), that still works:

```bash
doctl kubernetes cluster create my-larakube-cluster \
  --region sgp1 \
  --version latest \
  --node-pool "name=pool-1;size=s-2vcpu-4gb;count=1" \
  --enable-monitoring
```

:::tip Node count drives the strategy
A **1-node** pool is the simplest first run (`single-node` strategy → a shared `do-block-storage` volume). A **multi-node** pool runs app pods **stateless** (`multi-node-ha` → per-pod `emptyDir`), which needs externalized state — see [Going multi-node](#going-multi-node). Either way, LaraKube CLI derives the strategy from the cluster's node count when you record the target, so you don't set it by hand.
:::

Import the cluster's kubeconfig so `kubectl`/`larakube` can reach it:

```bash
doctl kubernetes cluster kubeconfig save my-larakube-cluster
# or, if you downloaded the kubeconfig from the UI:
larakube context:import "/path/to/Kubeconfig.yaml"

kubectl cluster-info   # verify connection
```

## Step 2: Provision Traefik + Let's Encrypt

*(Already done if you used `cloud:create --managed` in Step 1 — skip to [Step 3](#step-3-point-dns-at-the-loadbalancer-cname-pattern).)*

```bash
larakube cloud:init:doks --context do-sgp1-my-larakube-cluster
```

This:
1. ✅ Installs Traefik (via `kubectl apply`) with a Let's Encrypt ACME resolver and a persistent volume for the cert store.
2. ✅ Waits for the cloud LoadBalancer and prints its **external IP**.
3. ✅ Prefills the Let's Encrypt email from your blueprint (`email`) or global config — just press Enter.
4. ✅ If you run it **inside a project**, offers to wire an environment to this cluster right there (records the target + asks the web domain).

Re-running is safe: if Traefik is already installed it skips the install and just re-prints the IP.

## Step 3: Point DNS at the LoadBalancer (CNAME pattern)

Every host on the cluster — your app, plus any shared S3/Commons host — resolves to the **same** LoadBalancer IP. So set **one A "anchor"** record, then **CNAME** each host to it. Adding another app later is just a new CNAME, and if the IP ever changes you fix one record:

```
ingress.example.com        A      <LoadBalancer IP>     ← set once per cluster
app.example.com            CNAME  ingress.example.com
cdn.example.com            CNAME  ingress.example.com   ← e.g. a Plex S3 host
```

`cloud:init:doks`, `plex:init`, and `cloud:deploy` all print this with your real IP filled in.

## Step 4: Record the cluster as your env's target

No hand-editing — point an environment at the cluster with:

```bash
larakube cloud:configure production
```

Pick the DOKS context (e.g. `do-sgp1-my-larakube-cluster`) and provider `doks`. This writes the managed target and a sensible default `storageClass`:

```json
"production": {
    "cloud": { "context": "do-sgp1-my-larakube-cluster", "provider": "doks" },
    "storageClass": "do-block-storage",
    "hosts": { "web": "app.example.com" }
}
```

`ingress` defaults to Traefik, so there's nothing to set there. (If you used the offer at the end of Step 2, this is already done.)

## Step 5: Configure a container registry

A managed cluster can't be SSH-sideloaded, so the image is pushed to a registry the cluster pulls from:

```bash
larakube cloud:configure production --only=registry
```

- **Provider**: `ghcr` (GitHub Container Registry) or `dockerhub`
- **Image** (optional): `owner/my-app`

GHCR images are **private** in LaraKube CLI — there's no public-package step. The cluster's pull secret (`ghcr-login`) is created automatically during `cloud:deploy` from your `larakube gha:login` token, so pulls just work. (Docker Hub is the only registry where a public image is a LaraKube CLI option.)

## Step 6: Choose your data services

**Option A — self-hosted (default).** Don't list the services under `managed`/`plex`, and LaraKube CLI deploys Postgres/Redis/MinIO as pods in your env's namespace (each with its own `do-block-storage` PVC). Simplest for a single app; LaraKube CLI generates the connection env vars for you.

**Option B — shared Commons via Plex (recommended when 2+ apps share the cluster).** One set of services that each app gets an isolated database/bucket on:

```bash
larakube plex:init                # on the cluster context — pick services to share
larakube plex:join production     # from the app repo — provisions its DB/bucket, writes .env.production
```

`plex:join` records the connection details and marks those services `managed`+`plex` in your blueprint, so the deploy skips deploying duplicate pods. See [Two Apps, One Server → Plex](./multiple-projects#going-further-plex).

## Step 7: Deploy

### Option A: Manual deploy (quick testing)

```bash
larakube heal                  # regenerate manifests from the blueprint, review them
larakube cloud:deploy production
```

This builds the image (for the cluster's CPU architecture, auto-detected), pushes it to your registry, applies the manifests via a namespace-scoped credential, and waits for the rollout. It also prints the DNS records to confirm. Your app comes up on **HTTP** first.

### Option B: GitHub Actions (recommended for production)

```bash
larakube cloud:configure production --only=ci
```

Generates `.github/workflows/larakube-deploy-production.yml`, which builds, pushes, and deploys on `git push`.

## Step 8: Add HTTPS

Once the app is green over HTTP and DNS resolves to the LoadBalancer IP, enable TLS by adding Traefik annotations to the env (then redeploy):

```json
"production": {
    "ingressAnnotations": {
        "traefik.ingress.kubernetes.io/router.entrypoints": "websecure",
        "traefik.ingress.kubernetes.io/router.tls.certresolver": "letsencrypt"
    }
}
```

Traefik requests and renews the Let's Encrypt certificate automatically.

## Step 9: Verify

```bash
kubectl get pods -n my-app-production
kubectl logs -n my-app-production deployment/web -f
```

Before DNS propagates you can hit the app directly through the LoadBalancer with a Host header:

```bash
curl -H "Host: app.example.com" http://<LoadBalancer IP>/up
```

---

## Going multi-node {#going-multi-node}

`do-block-storage` is `ReadWriteOnce`, so a shared `storage/` volume can't span nodes. On **`multi-node-ha`** LaraKube CLI therefore runs the app pods **stateless** — each gets a per-pod `emptyDir` (no shared PVC), so they spread across nodes freely. State must then be externalized: uploads on S3 (MinIO/Commons), sessions/cache on Redis or the database. Run **`larakube cloud:externalize production`** to do this in one guided step — it flips the drivers and wires the backends (Plex Commons, self-hosted, or managed); `cloud:deploy` also offers it when it finds local state. SQLite stays single-node (its DB is a file). See [`cloud:externalize`](../commands/cloud#cloud-externalize) and [The Scaling Journey](./scaling-journey).

### Need a shared cross-node folder?

Some apps genuinely rely on a shared filesystem — e.g. a worker writes `public/storage/sitemap.xml` and the web pod serves it. For those, opt in to **shared (ReadWriteMany) storage**:

```bash
larakube cloud:init:nfs          # installs an in-cluster NFS provisioner → larakube-nfs StorageClass
# then set "sharedStorage": true on the env, and redeploy
```

LaraKube CLI stands up a single NFS server (a block volume re-exported over NFS) and points the shared PVC at its RWX class, so the folder works across nodes unchanged. The NFS server is one pod — a **soft SPOF for storage** (your app pods stay HA); a truly-HA shared filesystem (CephFS / managed filer) is a heavier, later option. Prefer externalizing to S3 where you can; reach for this only when an app needs a real shared folder.

---

## Storage & pricing

### Node ephemeral storage (included)

Each worker node includes ephemeral storage (part of the cluster cost) for images, temp files, and logs. **It's lost when pods restart or nodes are replaced** — don't keep data there.

### Block storage (pay-as-you-go)

Persistent data (databases, uploads) uses DigitalOcean Block Storage, charged per GB (~$0.10/GB/month), via `storageClass: "do-block-storage"`. It survives pod restarts and node replacement.

**Example cost:** DOKS (2× s-2vcpu-4gb) ~$24/mo + 10GB block storage ~$1/mo + GHCR free ≈ **~$25/month**.

---

## Troubleshooting

### ❌ LoadBalancer IP stuck on `<pending>`

DigitalOcean is still provisioning the LB:

```bash
kubectl get svc -n traefik traefik
# wait 1–2 minutes, then re-run: larakube cloud:init:doks --context <ctx>
```

### ❌ DNS not resolving

```bash
nslookup app.example.com   # should return the LoadBalancer IP (or your anchor)
```

If it shows an old IP, wait a few minutes and clear your browser/DNS cache.

### ❌ App pod won't start

```bash
kubectl logs -n my-app-production deployment/web
```

Common causes: missing/incomplete `.env.production`, image pull failed (run `larakube gha:login` so the `ghcr-login` pull secret can be created — GHCR images are private), or a wrong service host.

### ❌ Database connection refused

Self-hosted:

```bash
kubectl get pods -n my-app-production -l app=postgres
```

Plex Commons: confirm `plex:join` ran and check `.env.production` points at the Commons hosts (e.g. `*.larakube-shared.svc.cluster.local`).

### ❌ HTTPS certificate not working

TLS needs the annotations from Step 8, DNS resolving to the IP, and port 80 reachable (HTTP-01). Check Traefik:

```bash
kubectl get ingress -n my-app-production
kubectl logs -n traefik deployment/traefik -f | grep -i acme
```

---

## Architecture

```
Internet (DNS: app.example.com → LoadBalancer IP)
    ↓
DigitalOcean LoadBalancer (Traefik Service, ports 80/443)
    ↓
Traefik Ingress Controller (Let's Encrypt cert issue/renew)
    ↓
Laravel Web Pod (Deployment/web)
    ↓
Postgres / Redis / MinIO  — self-hosted pods, OR a shared Plex Commons
    ↓
Block Storage PVCs (do-block-storage)
```

---

## Next steps

- **HTTPS**: add the Traefik annotations (Step 8)
- **CI/CD**: `larakube cloud:configure production --only=ci`
- **Multi-tenancy**: share a Commons across apps with [Plex](./multiple-projects#going-further-plex)
- **Scale**: see [Going multi-node](#going-multi-node)

## Further reading

- [DigitalOcean Kubernetes Docs](https://docs.digitalocean.com/products/kubernetes/)
- [Traefik Documentation](https://doc.traefik.io/)
- [Blueprint Anatomy](../architecture/blueprint-anatomy)
- [Multi-environment Deployments](./scaling-journey)

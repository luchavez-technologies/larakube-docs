---
sidebar_position: 11
title: Air-Gapped Bundles (Enterprise On-Prem)
description: Package your entire application — app image, Kubernetes, Traefik, database, Redis, TLS certificates — into a single folder for fully offline, on-premise delivery.
---

# Air-Gapped Bundles

One of the biggest milestones for a SaaS application is landing an Enterprise contract that mandates **on-premise, air-gapped hosting**. The hospital, bank, or government agency wants to buy your software, but they demand it runs entirely on their offline, internal servers.

Historically that meant shipping raw source code or a massive, fragile Bash script. LaraKube CLI solves this with **Air-Gapped Bundles**: compile your entire stack — app image, Kubernetes, Traefik, database, Redis, MinIO, TLS certificates — into a single folder you can drag onto a USB stick. One command installs it on the client's server with zero internet access required.

---

## Quick reference

```bash
# 1. Developer: add an offline environment to the project
larakube env airgap --offline

# 2. Developer: compile the bundle
larakube bundle:build airgap --arch=amd64 --tar

# 3. Client: install on their server (1 GB RAM → add --swap)
sudo ./larakube bundle:install --swap
```

That's the full lifecycle. The sections below cover every flag, edge case, and recovery option.

---

## Prerequisites

On your **build machine** (your laptop or CI runner):

- **LaraKube CLI** installed and authenticated with `gh auth login`
- **Docker** with `buildx` support (Docker Desktop on macOS/Windows; `docker-ce` + the buildx plugin on Linux)
- **Disk space**: expect ~2–4 GB per bundle depending on included images
- The project must have a cloud environment configured (`larakube env airgap --offline` creates one)

On the **client's server** (entirely offline):

- **Ubuntu 22.04 LTS** or later (x86-64 / `amd64`)
- Minimum **1 GB RAM** (use `--swap` to prevent OOM), **2 GB recommended**
- Minimum **20 GB disk** (K3s + your app + images)
- Root or `sudo` access

---

## Step 1 — Create an offline environment

Your production environment likely relies on managed databases (AWS RDS, DigitalOcean Managed MySQL) or a Plex Commons. An air-gapped delivery must be 100% self-sufficient. Create a dedicated environment for the bundle:

```bash
larakube env airgap --offline
```

During the wizard:
- **Strategy**: `single-node` (the client's box is one server)
- **Database**: choose a self-hosted driver (MariaDB, MySQL, or Postgres) — _not_ a managed/external host
- **Cache**: Redis
- **Object storage**: MinIO (SeaweedFS also works)
- **Hosts**: set the client's intended internal domains now (e.g. `app.hospital.internal`, `s3.hospital.internal`) to bake them into the bundle and skip hostname prompts during install

The `--offline` flag marks the environment so `bundle:install` skips hostname prompts when the hosts are already set.

:::tip One environment, many clients
You can use the same `airgap` environment for every client — `bundle:build` stamps a timestamp into the folder name so bundles don't overwrite each other. If different clients need different hostnames or features, create separate environments (`airgap-clienta`, `airgap-clientb`).
:::

---

## Step 2 — Build the bundle

```bash
larakube bundle:build airgap --arch=amd64 --tar
```

| Flag | Description |
|---|---|
| `airgap` | The environment name to bundle |
| `--arch=amd64` | Target CPU architecture. Use `amd64` for standard Intel/AMD servers, `arm64` for ARM (AWS Graviton, Raspberry Pi). |
| `--tar` | Compress the output to a `.tar.gz` and write an `INSTRUCTIONS.txt` alongside it |

**What happens under the hood:**

1. **App build** — compiles your Laravel app into a production Docker image tagged `app:airgap-latest` (isolated from your local `:latest` — see [Image Tag Isolation](#image-tag-isolation))
2. **Dependency scrape** — reads your `.larakube.json` and pulls the official images for your database, Redis, and Traefik
3. **Image export** — saves every image as a flat `.tar` file into `images/`
4. **Manifest extraction** — copies your Kustomize YAML templates to `manifests/`
5. **kustomize binary** — downloads the standalone `kustomize` binary for the target architecture (bypasses the older parser built into K3s)
6. **K3s offline artifacts** — downloads `k3s`, `k3s-install.sh`, and `k3s-airgap-images.tar` from GitHub
7. **CLI copy** — bundles the `larakube` binary itself as the installer
8. **Compression** (with `--tar`) — packs everything into a timestamped `.tar.gz` with a copy-paste ready `INSTRUCTIONS.txt`

**Output:**

```
dist/
  myapp-airgap-amd64-bundle-20260613-140000.tar.gz
  myapp-airgap-amd64-bundle-20260613-140000-INSTRUCTIONS.txt
```

**Your source code is never in the bundle** — it's compiled into the Docker image layer. The client receives a binary only.

---

## Step 3 — Transfer and install

### Transfer to the client's server

Use the `INSTRUCTIONS.txt` for exact commands. The typical flow:

```bash
# From your machine — copy via SCP (or put on a USB stick)
scp dist/myapp-airgap-amd64-bundle-*.tar.gz root@192.168.1.100:/opt/

# On the client's server — extract
cd /opt && tar -xzf myapp-airgap-amd64-bundle-*.tar.gz
cd myapp-airgap-amd64-bundle-*
```

### Install

```bash
sudo ./larakube bundle:install
```

The installer runs these steps in order:

1. **Pre-flight checks** — verifies `openssl`, `curl`, `tar` are present
2. **Swap allocation** (if `--swap`) — allocates and persists a swap file before the heavy work begins
3. **K3s bootstrap** — copies the bundled K3s binary to system paths and installs using `INSTALL_K3S_SKIP_DOWNLOAD=true`
4. **Image hydration** — imports every `.tar` from `images/` into containerd via `k3s ctr images import` (the slowest step — ~1–5 minutes depending on image count and disk speed)
5. **Credentials generation** — generates cryptographically strong unique passwords for this installation (`DB_PASSWORD`, `MINIO_SECRET_KEY`, etc.)
6. **Environment merge** — merges generated credentials with any keys you supply via `--env` (client-supplied keys take priority)
7. **Hostname resolution** — uses pre-configured hosts from the blueprint, or prompts interactively if not set
8. **TLS generation** — mints a local Certificate Authority and issues a server certificate with SANs for every domain
9. **Deploy** — injects secrets/configmaps and runs `kubectl apply -k manifests/overlays/airgap`
10. **Rollout wait** — waits for all pods to reach Ready status
11. **Summary** — prints the CA path and first-login instructions

### Supplying client-specific environment variables

If the client needs to bring their own credentials (e.g. `STRIPE_SECRET`, `MAIL_PASSWORD`), they place a `.env` file in the bundle folder before running install:

```bash
# Client creates this file:
cat > .env <<'EOF'
STRIPE_SECRET=sk_live_...
MAIL_HOST=smtp.hospital.internal
MAIL_USERNAME=app@hospital.internal
MAIL_PASSWORD=...
EOF

sudo ./larakube bundle:install --env=.env
```

LaraKube CLI merges this with the auto-generated credentials — the client's keys always win on conflict.

---

## Flags reference

### `--swap` — Prevent OOM on small servers

1 GB VPS instances frequently OOM-kill K3s during startup when image import and Kubernetes initialisation run concurrently. `--swap` allocates a swap file _before_ the heavy work begins, using `fallocate` + `mkswap` + `swapon` and permanently registering it in `/etc/fstab`.

```bash
sudo ./larakube bundle:install --swap       # 1 GB (safe default)
sudo ./larakube bundle:install --swap=2G    # explicit size
sudo ./larakube bundle:install --swap=2     # bare number = gigabytes
```

Idempotent: if `/swapfile` already exists, the step is skipped. Re-running is safe.

:::tip Always use `--swap` on 1 GB servers
On 2 GB+ servers it is optional but reduces the risk of transient OOM spikes during initial rollout.
:::

### `--skip-images` — Fast re-configuration

Image import is the slowest part of install. If you need to regenerate secrets or fix a hostname without waiting for images again:

```bash
sudo ./larakube bundle:install --skip-images
```

Skips directly to credentials generation and certificate regeneration. Combined with pre-configured hosts in the blueprint, a re-install runs in under 30 seconds.

Common use cases:
- Wrong hostname was entered during the first install
- The client changed their internal DNS
- Regenerating TLS certificates after a CA expiry
- Correcting a `--env` value without re-importing images

### `--env` — Supply client credentials

```bash
sudo ./larakube bundle:install --env=/path/to/client-secrets.env
```

Merges the file into the generated environment. Client-supplied keys take priority over auto-generated ones. Useful for SMTP, payment gateways, LDAP, and other credentials the client manages.

---

## Shipping updates

Once the client's server is running, you don't need to re-ship K3s and all dependency images on every release — only what changed.

### App-only update (most releases)

```bash
# On your machine — build a lightweight update bundle (app image only)
larakube bundle:build airgap --arch=amd64 --update --tar

# Transfer and apply on the client's server
sudo ./larakube bundle:update
```

`bundle:build --update` skips K3s, kustomize, and dependency images. The resulting archive is typically 80–95% smaller than a full bundle.

### Full re-install (dependency upgrades)

When you upgrade MariaDB, Redis, or add a new service, build a full bundle:

```bash
larakube bundle:build airgap --arch=amd64 --tar
sudo ./larakube bundle:install --skip-images=false
```

Use `--skip-images=false` to force a full image re-import (the default is to re-import; `--skip-images` is the flag that skips it).

---

## TLS and the local CA

Because Let's Encrypt requires internet access, `bundle:install` mints its own **Certificate Authority** on the client's server and issues a server certificate covering all configured domains.

**The CA file path** is printed at the end of install — it looks like:
```
/opt/myapp-airgap-amd64-bundle-20260613-140000/myapp-airgap-20260613-ca.crt
```

**Distributing trust:**

The client's IT team installs the CA into their internal trust store (Active Directory GPO, macOS Profiles, Linux `/usr/local/share/ca-certificates/`). Users on the network will then see valid HTTPS without a browser warning.

**Verifying from your dev machine:**

Pull the CA back and trust it locally:

```bash
rsync -P root@CLIENT_SERVER_IP:/opt/bundle-folder/myapp-airgap-20260613-ca.crt ~/Downloads/
larakube trust ~/Downloads/myapp-airgap-20260613-ca.crt
```

Open the configured hostname in your browser — it loads over HTTPS without a warning.

:::tip CA naming
The CA filename includes the app name, environment, and date (`myapp-airgap-20260613-ca.crt`), so multiple client installs don't overwrite each other in `~/Downloads/`.
:::

---

## Managing multiple clients

For agencies or ISVs with several enterprise clients, keep bundles organised by client:

```
dist/
  acme-bank/
    myapp-airgap-amd64-bundle-20260601-*.tar.gz      # initial install
    myapp-airgap-amd64-bundle-20260613-update.tar.gz # v2 update
  riverside-hospital/
    myapp-airgap-amd64-bundle-20260510-*.tar.gz
    myapp-airgap-amd64-bundle-20260613-update.tar.gz
```

Use one environment per client when their configuration differs:

```bash
larakube env airgap-bank    # hosts: app.acme-bank.internal
larakube env airgap-hosp    # hosts: ehr.riverside.internal, s3.riverside.internal

larakube bundle:build airgap-bank --arch=amd64 --tar
larakube bundle:build airgap-hosp --arch=amd64 --tar
```

Use a single `airgap` environment when all clients get the same configuration (hostname differences handled interactively at install time).

---

## Bundle management utilities

### `bundle:zip` — Compress a built bundle folder

If you ran `bundle:build` without `--tar` and want to compress later:

```bash
larakube bundle:zip                                      # auto-discovers under dist/
larakube bundle:zip dist/myapp-airgap-amd64-bundle-...  # specific folder
larakube bundle:zip --output=client-a                   # custom name → client-a.tar.gz
larakube bundle:zip --delete                            # remove folder after zipping
```

### `bundle:unzip` — Extract a bundle archive

```bash
larakube bundle:unzip                                     # auto-discovers .tar.gz under dist/
larakube bundle:unzip dist/myapp-airgap-amd64-bundle-*.tar.gz
larakube bundle:unzip --delete                           # remove archive after extracting
```

---

## Image tag isolation {#image-tag-isolation}

Before v0.18.27, both local dev images and bundle images were tagged `:latest`. Building a bundle overwrote the tag on your dev daemon, instantly crashing running local pods.

LaraKube CLI now uses **isolated tags** via Kustomize `images:` rewrite blocks:

| Context | Tag at apply time |
|---|---|
| Local k3d / k3s (`larakube up`) | `app:local` |
| Air-gapped bundle | `app:airgap-latest` (or `app:{env}-latest`) |
| Production via registry | pulled by digest |

`larakube up` builds and sideloads `app:local`. `bundle:build` builds `app:airgap-latest`. The two co-exist on the same Docker daemon without interfering.

---

## Troubleshooting

### K3s fails to start / OOM during install

**Symptom:** `k3s` crashes or the node never becomes Ready.

**Fix:** Use `--swap` — it allocates a swap file before the heavy phase begins:

```bash
sudo ./larakube bundle:install --swap
```

Even on 2 GB servers, the initial image import can cause transient spikes. `--swap` is always safe to pass.

### Image import takes a very long time

**Normal range:** 1–5 minutes for a typical stack (app + MariaDB + Redis + MinIO). Large images (heavy ML dependencies, many npm packages) can push past 10 minutes on slow disks.

**What to watch:**

```bash
# On the server — in a second terminal
watch -n5 'sudo k3s ctr images list | grep -c "import"'
```

If it seems stuck for >15 minutes, check disk I/O and available space (`df -h`).

### Wrong hostname after install

Re-run with `--skip-images` to regenerate certificates and config without re-importing images:

```bash
sudo ./larakube bundle:install --skip-images
```

The installer will prompt for the hostname again (or use the pre-configured one from the blueprint).

### Browser shows "Not Secure" / certificate error

The client hasn't installed the CA yet. Give them the `.crt` file and installation instructions for their OS/browser:

- **Windows (Active Directory):** distribute via GPO → Trusted Root Certification Authorities
- **macOS:** `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ca.crt`
- **Ubuntu/Debian:** `cp ca.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates`
- **Chrome (standalone):** Settings → Privacy → Manage certificates → Authorities → Import

### Pods stuck in `ImagePullBackOff` after `bundle:update`

The update bundle only contains the app image. If you recently added a new service (e.g. Meilisearch), its image isn't in containerd yet — build a full bundle and run a full install:

```bash
larakube bundle:build airgap --arch=amd64 --tar   # full bundle
sudo ./larakube bundle:install                     # re-imports all images
```

### Re-running bundle:install on an already-running cluster

`bundle:install` is designed to be **idempotent**:
- K3s installation is skipped if a cluster is already running
- Image import re-imports all tarballs (use `--skip-images` to skip)
- Credentials generation regenerates secrets and ConfigMaps (live pods pick up changes on their next restart)
- `kubectl apply -k` is incremental — unchanged resources are untouched

Safe to re-run; it won't destroy running data volumes.

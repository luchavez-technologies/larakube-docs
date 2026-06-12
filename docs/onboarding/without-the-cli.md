---
sidebar_position: 7
title: Running Without the CLI
description: Hand a teammate a LaraKube project they can run locally with plain kubectl — no binary install required — using the generated larakube.sh wrapper.
---
# 🧰 Running Without the CLI

Not everyone who contributes to a LaraKube project wants to install the LaraKube binary — and that's fine. A teammate who's wary of running an unfamiliar standalone tool can still spin the project up locally with nothing but `kubectl`, `docker`, and `jq`.

LaraKube generates a small, auditable bash wrapper — **`larakube.sh`** — plus a usage guide, so the no-install path is first-class.

## Generate the portable tooling

From a project that already has its manifests generated (i.e. you've run `larakube up`/`heal` at least once), run:

```bash
larakube portable
```

This drops two files into the project root:

| File | What it is |
|---|---|
| `larakube.sh` | A ~150-line `kubectl`/`docker` wrapper covering the local dev loop |
| `LOCAL_DEV.md` | A how-to guide your teammate can follow |

Commit both. Now anyone who clones the repo can run the project locally **without installing LaraKube** — they just need a local Kubernetes cluster, `kubectl`, `docker`, and `jq`.

> `larakube portable` won't clobber customizations — if `larakube.sh` or `LOCAL_DEV.md` already exist it asks before overwriting (use `--force` to skip the prompt).
>
> Already document the local workflow in your README? Pass **`--script-only`** to generate just `larakube.sh` and skip `LOCAL_DEV.md`, so you don't end up with overlapping guides.

## What the wrapper does

`larakube.sh` reads `.larakube.json` and operates entirely on the project's **local** namespace (`<project>-local`) using the committed manifests in `.infrastructure/k8s/overlays/local`. It mirrors the everyday LaraKube commands:

```
./larakube.sh list           # show all commands

# Lifecycle
up                           # build image + apply manifests + restart pods
start | stop                 # scale up / down (stop keeps data)
down                         # delete the namespace (confirms)
build                        # build the image only

# Dev loop
watch                        # reload Octane/Horizon/queues on file change
reload                       # reload once, now
artisan <args>               # php artisan ... in the web pod
composer <args>              # composer ... in the web pod
npm <args>                   # npm ... in the node pod

# Local URLs (app + Vite HMR + Reverb over https://*.kube)
hosts                        # map ingress hosts → 127.0.0.1 in /etc/hosts (sudo)
tls                          # cluster Traefik serves the local cert
trust                        # trust the local CA so HTTPS + Reverb WSS work (sudo)

# Introspection
status                       # pods / services / ingress
logs [deploy]                # tail logs (default: web)
shell [deploy]               # shell into a pod (default: web)
forward [port]               # quick web-only check (does NOT cover Vite/Reverb)
```

It auto-imports the freshly-built image for k3d, kind, and minikube; Docker Desktop and OrbStack share the daemon's images, so nothing extra is needed there.

### Reaching the app over its real URLs

`up` gets the pods running, but the app, Vite (HMR), and Reverb (WebSockets) are each served on their own ingress hostname. To use them, after `up`:

```bash
./larakube.sh tls      # the cluster's Traefik serves the LaraKube local cert
./larakube.sh trust    # trust that cert locally (sudo)
./larakube.sh hosts    # *.kube → 127.0.0.1 in /etc/hosts (sudo)
# then open https://<project>.kube
```

- `tls` needs an ingress controller already running — **k3s ships Traefik** (works out of the box); on Docker Desktop/OrbStack install one first, or use the full CLI.
- `trust` is required for **Reverb**: browsers silently reject self-signed certs on WebSocket connections.
- `forward` is only a quick "is the web app up?" check (`http://localhost:8080`); it does **not** route Vite or Reverb.

## What it deliberately does *not* do

The wrapper is for **consuming** a blueprint, not authoring one:

- **No manifest regeneration.** Editing `.larakube.json` and running `heal` is a CLI-only operation. The wrapper applies the committed manifests; if the blueprint changes, the maintainer regenerates and commits, and contributors pull.
- **No cluster provisioning, TLS trust, or `/etc/hosts` management.** Those conveniences are what the full CLI adds. The wrapper assumes a cluster already exists and offers `forward` to reach the app at `http://localhost:8080` without DNS/TLS setup.

## When to use which

| | Full CLI | `larakube.sh` |
|---|---|---|
| Install footprint | LaraKube binary | none (kubectl/docker/jq) |
| Local cluster setup | automatic (k3d) | bring your own |
| TLS + hosts | managed for you | manual / use `forward` |
| Change the blueprint (`add`, `heal`, `env`) | ✅ | ❌ |
| Daily dev loop (up/watch/artisan/logs/…) | ✅ | ✅ |

Maintainers and anyone shaping the infrastructure want the CLI. Contributors who just need to run the app and write feature code can stay on `larakube.sh`.

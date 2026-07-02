---
sidebar_position: 2
title: Changelog
description: Track the latest updates across the LaraKube CLI ecosystem (CLI, Console, and Documentation).
---
# 📜 Changelog

LaraKube CLI is evolving rapidly. We maintain a high-level changelog here for major architectural shifts, while specific technical commits can be tracked on GitHub.

## 🚀 Unified Ecosystem Updates

### July 2026: Opt-In Environments & Unified `cloud:configure` (Unreleased)
A command-surface cleanup: `production` is no longer assumed, and cloud setup collapses into one command.

- **Environments are opt-in**: `larakube new`/`init` now scaffold a `local`-only blueprint — no more automatic `production` environment or `.env.production`. Create a cloud environment explicitly with `larakube env production` (or let `larakube cloud:configure production` create it on demand, running the same ingress/managed-services wizard either way).
- **`cloud:configure` absorbs `:base` / `:gha` / `:gitlab` / `:registry`**: those four sub-commands are removed (clean break, no aliases). Everything lives in `larakube cloud:configure {environment?} {--only=registry|ci|hosts} {--rotate}` — no `--only` runs the full guided flow; `--only=registry`/`--only=ci`/`--only=hosts` re-run a single step. `--only=ci` auto-detects GitHub vs. GitLab from your git remote. `cloud:configure:tunnel` is unaffected.
- **`cloud:configure` no longer silently resets your deploy target**: re-running it on an environment that already has a saved server/context now asks before overwriting it.
- **`cloud:deploy`'s host guard** now also catches a leftover local (`*.kube`/`*.dev.test`) web host, closing a gap where only a missing/placeholder host was caught.
- **Multiple domains per app** (`additionalWebHosts`): route extra hostnames to the same web pod as your primary `hosts.web` — built for Laravel apps using [subdomain route groups](https://laravel.com/docs/routing#route-group-subdomain-routing), or just a second brand domain. Each host gets its own Ingress rule and its own independently-obtained TLS cert. Prompted for in `larakube env`, `cloud:configure`, and `cloud:configure <env> --only=hosts`. See [Multiple domains, one app](../architecture/blueprint-anatomy#multiple-domains-one-app).

### June 2026: Two-Stage CI, Resource Defaults & Multi-Env Plex (CLI v0.20.0)
A stability and developer-experience release — faster CI retries, Node.js 24 compatibility, and validated multi-environment Plex on a single node.

- **Two-stage GitHub Actions pipeline**: the generated `larakube-deploy-*.yml` workflow is now split into a `build` job and a separate `deploy` job (`needs: build`). A failed deploy (wrong manifest, missing secret) no longer re-runs the full Docker build — just re-run the `deploy` job. The build job adds explicit Composer and Docker layer caching (`actions/cache@v5`, `type=gha`) for faster subsequent builds.
- **Node.js 24 action upgrades**: all bundled GitHub Actions bumped to Node.js 24-compatible versions — `actions/checkout@v6`, `actions/cache@v5`, `actions/setup-node@v6`, `docker/login-action@v4`, `docker/build-push-action@v7`, `docker/setup-buildx-action@v4`, `azure/k8s-set-context@v4`. Avoids the Node.js 20 deprecation warning enforced by GitHub from June 16, 2026 onwards.
- **Reduced default CPU request** (`100m` → `50m` per app pod): the scheduling floor for web, horizon, reverb, and queue pods is now 50m. On a 2 GB / 1 CPU node this allows staging **and** production (6 app pods total) plus a Plex Commons to co-exist within the node's CPU budget. The limit stays at `1` full core, so a pod can still burst to maximum CPU when available. Adjust per-env with `larakube resources`.
- **`plex:resources` command**: interactively tune memory limits and storage sizes for Plex Commons services (MariaDB, Redis, SeaweedFS, Meilisearch, MinIO) without re-running `plex:init`. Shows a summary table, prompts for new values with k8s-quantity validation, re-applies the Commons manifest, and waits for the rollout. See [Commons Resource Tuning](../deployment/plex-resources).
- **Multi-environment Plex validated**: `staging` and `production` of the same app now deploy as separate tenants on one Plex node. Tenant identifiers are environment-aware (`my_app` for production, `my_app_staging` for staging) — each gets its own database, Redis logical DB (DB 0 / DB 1), and S3 bucket. Validated end-to-end via GitHub Actions on a $12 DigitalOcean VPS. See [Two Environments, One Server](../deployment/two-envs-one-server).
- **`cloud:configure:gha` host sweep**: the GHA configuration wizard now prompts for Reverb and SeaweedFS hosts (same as `larakube env`) to ensure `VITE_REVERB_HOST` is baked into the Docker image at build time. Previously, this prompt was absent from `cloud:configure:gha`, causing WebSocket connections to break in production builds.
- **GHCR pull-secret fix**: `cloud:configure:gha` now creates the `ghcr-login` Kubernetes pull secret for projects using the default GHCR path (no explicit registry configured), not just those with an explicit registry entry. Previously, the default-GHCR path skipped pull-secret creation, causing `ImagePullBackOff` on the first deploy.

### June 2026: Local HTTPS Overhaul & .kube TLD (CLI v0.19.0)
A comprehensive overhaul of the local HTTPS trust chain and local domain naming.

- **`.kube` TLD migration**: All local development domains now use `.kube` instead of `.dev.test`. Every project, service, and companion app gets a `*.kube` address (`your-app.kube`, `traefik.kube`, `console.kube`, `s3.project.kube`, `mailpit.kube`, `phpmyadmin.kube`, `redisinsight.kube`, `vite.your-app.kube`, etc.). The old `.dev.test` addresses are retired.
- **`larakube trust:check`**: New command that diagnoses the full local HTTPS trust chain end-to-end — CA files present in `~/.larakube/certificates/`, CA trusted in the system keychain, DNS resolving live for `.kube` domains, system cert validity, and per-app cert validity. Returns exit code `1` if any issues are found; safe to use in scripts and CI.
- **`larakube trust:reset`**: New command that destroys and regenerates the local CA. Asks you to type `reset` to confirm (or `--force` to skip). Per-app certs regenerate automatically on the next `larakube up`.
- **`larakube trust:remove`**: Replaces the old `larakube untrust` command. Removes the LaraKube Local CA from the system trust store using SHA-1 fingerprints (macOS) or file paths (Linux/Windows).
- **Certificate path**: The CA and all per-app certs now live under `~/.larakube/certificates/` (previously `~/.larakube/`).
- **dnsmasq hardening (macOS)**: dnsmasq now runs as a root daemon (`sudo brew services`) so it can bind port 53. Adds `listen-address=127.0.0.1` and `bind-interfaces` to avoid conflicts with OrbStack/Docker network bridges. `trust:check` probes DNS live rather than just checking file existence.
- **laravel-secrets local fix**: Local secrets handling corrected for edge cases in the split `.env` architecture.
- **Traefik server-side apply fix**: Resolved a conflict when applying Traefik manifests with `kubectl apply --server-side`.

### June 2026: Air-Gapped Bundle Hardening (CLI v0.18.x)
A production-hardening series for the offline enterprise delivery path. All changes are backwards-compatible — existing bundles and `.larakube.json` files are unaffected.

- **Image tag isolation** (v0.18.27): Local dev images and bundle images no longer share the `:latest` tag. `larakube up` now builds `app:local`; `bundle:build` produces `app:{env}-latest` (e.g. `app:airgap-latest`). Kustomize `images:` rewrite blocks in each overlay enforce the split. Building a bundle on your laptop no longer crashes your running local pods.
- **`--skip-images` flag** (v0.18.28): `bundle:install --skip-images` re-runs the entire configuration wizard (hostname prompts, secret generation, TLS cert regeneration) without re-importing the Docker image tarballs. Turns a typo-correction from a minutes-long wait into a matter of seconds.
- **`--swap=<size>` flag** (v0.18.29): `bundle:install --swap=1G` allocates swap space **before** k3s starts, preventing OOM crashes on 1 GB VPS instances. Uses `fallocate` + `mkswap` + `swapon` and persists the entry to `/etc/fstab`. Idempotent: skipped automatically if `/swapfile` already exists.

See the full [Air-Gapped Bundles guide](../deployment/airgapped-bundles) for usage examples.

### June 2026: Resource Limits & Hand-edit Safety (CLI v0.17.2)
A stability and safety release. This introduces:
- **Secret masking**: Aggressive redaction of high-confidence token shapes in CLI logs.
- **Sudo escapeshellarg**: Enhanced security when wrapping commands in `sudo`.
- **Manifest hand-edit advisory**: `larakube heal` now detects manual edits to `.infrastructure/k8s` manifests, warns you, and preserves them instead of overwriting them.
- **Per-component resource limits**: The interactive `larakube resources` command lets you define CPU and memory bounds for your app pods (with fallback inheritance and redundancy pruning) to ensure stability.

### June 2026: Digest-Pinned Deploys (CLI v0.17.1)
A security hardening for remote deploys. The manual registry path now deploys the **immutable image digest** the registry assigned (`repo@sha256:…`) instead of a mutable `:tag` — a tag can be re-pushed to point at different bytes, a digest can't. GitHub Actions already pinned the digest; this brings `larakube cloud:deploy` to parity. (It falls back to the tag, with a warning, only if `docker buildx` can't resolve the digest.)

### June 2026: Environment-First Cluster Ops & Multi-Node Storage (CLI v0.17.0)
Two themes: the `cluster:*` commands stop making you memorize namespaces and contexts, and multi-node storage gets an honest, guided story — stateless by default, with a one-command path to externalize and an opt-in shared filesystem for the apps that truly need one.

- **Environment-first `cluster:*`:** `cluster:grant`, `cluster:revoke`, and `cluster:users` now take an **environment** inside a project — `larakube cluster:grant production --name lloyd` — and target that env's namespace *and* its own cluster context automatically (a literal namespace still works standalone). Standalone, they prompt for a context instead of silently using whatever `kubectl` points at. `cluster:users <env>` now **lists who has access**; auditing a deploy SA's live RBAC rules moved behind `--scope`. `cluster:grant` also auto-creates a missing namespace and gitignores the minted `*.kubeconfig`, and `context:import` binds the imported context to the matching environment so teammates get the same env-first DX. See [Team Access](../teams/overview) and [Rotating & Revoking Credentials](../security/rotating-credentials).
- **Multi-node storage, made honest:** on `multi-node-ha`, app pods run **stateless** (per-pod ephemeral storage) so they spread freely across nodes — state is externalized to object storage (S3/Spaces) and Redis/database. New **`larakube cloud:externalize <env>`** turns that into one guided step: it flips the env's `FILESYSTEM_DISK` / `SESSION_DRIVER` / `CACHE_STORE` / `QUEUE_CONNECTION`, offers to join a Plex Commons for the S3 + Redis backends, and never clobbers Commons-owned credentials — and `cloud:deploy` now *offers* to run it instead of only warning.
- **Opt-in shared storage (experimental):** apps that genuinely need a shared cross-node folder can set `sharedStorage: true` and run **`larakube cloud:init:nfs`** to install an in-cluster NFS provisioner (the `larakube-nfs` ReadWriteMany StorageClass). It's a soft single-point-of-failure (one NFS pod, while your app pods stay HA) and **does not work on DOKS** (the mount hangs) — prefer externalizing where you can. See [Shared Storage](../architecture/shared-storage#-storage-across-the-scaling-journey).
- **Cloud connection split out of `.larakube.json`:** a project's infra coordinates (cluster context, server) now live in a **gitignored `.larakube.local.json`**, so the committed blueprint carries no cluster details. Plus a scheduler **cloud-wait** so CronJobs don't fire before managed/Commons services are reachable.

### June 2026: Teammate RBAC & Credential Lifecycle (CLI v0.15.0)
Cluster access for your team **without giving anyone SSH to your server** — plus the tools to audit, rotate, and revoke every credential, and a safety net for your kubeconfig.

- **Teammate RBAC (cluster-native, no SSH):** `larakube cluster:grant <namespace> --name lloyd` gives a teammate their own **namespace-scoped kubeconfig** — built on Kubernetes' built-in `view` / `edit` / `admin` roles (`--read` / `--edit` *(default)* / `--admin`). One person is **one identity**: granting them a second app just adds a binding, their kubeconfig never changes, and re-running `grant` with a different flag **upgrades/downgrades** their role instantly. Before you grant an app, they can't even *see* it exists. They onboard with one command — `larakube context:import lloyd.kubeconfig` — and you remove them with `cluster:revoke --name lloyd` (one app, or off-board entirely). No SSH, no server login, no `sudo` — just scoped Kubernetes access.
- **Credential lifecycle:** `cluster:users` lists every deploy SA *and* teammate (and audits a namespace's *live* RBAC scope, so drift shows); `cluster:revoke` is the kill-switch; and `cloud:configure:gha <env> --rotate` kills a leaked CI token and re-issues a fresh one — CI keeps working, the leaked copy dies. See [Rotating & Revoking Credentials](../security/rotating-credentials).
- **Kubeconfig safety:** `context:backup` snapshots your `~/.kube/config` (dated), and `context:restore` lets you pick one from a list — handy before anything that rewrites it (an `orb reset`, a cloud CLI, etc.). It also snapshots your current config before restoring, so a restore is itself reversible.

### June 2026: Least-Privilege Deploys & Managed Clusters (CLI v0.14.0)
The headline is security: **deploys no longer ship your cluster-admin cert.** Both the manual path and CI now deploy as a credential that can touch exactly one namespace — plus first-class managed-cluster (DOKS) support and real server hardening.

- **Namespace-scoped deploy credentials**: `larakube cloud:deploy` and the GitHub Actions workflow now deploy as a per-app, per-environment `deployer` **ServiceAccount** locked to its own `{app}-{env}` namespace. Your admin kubeconfig **never leaves your machine**; CI gets a namespace-scoped, Secret-bound token. If a repo leaks, the blast radius is one namespace — not your whole cluster. See [Surgical Credentials](../deployment/surgical-credentials). *Validated end-to-end on a single-node VPS via both manual deploy and GitHub Actions.*
- **Managed Kubernetes (DOKS)**: `larakube cloud:init:doks` installs Traefik and returns the LoadBalancer IP. Clusters are now identified by their **kube-context** (`cloud.context`) — so DOKS/EKS/GKE/AKS all work, picked from your kubeconfig instead of typing an IP — alongside a per-environment `storageClass`. *Tooling is wired; multi-node end-to-end validation is still in progress.*
- **Server hardening**: `cloud:init` now hardens the box — UFW default-deny firewall (allowing SSH/80/443/6443 + the k3s pod/service CIDRs), fail2ban, automatic security updates, key-only SSH, and a **guarded** disable-remote-root-login (only after the `larakube` user is proven to work, so you can't lock yourself out). New `larakube cloud:harden` re-applies all of it to an already-provisioned server.
- **Discoverable `cloud:configure:*`**: `cloud:configure:base`, `:gha`, `:registry`, and `:users` now show up in `larakube list` (the bare `cloud:configure` still runs the full guided flow). The dead repo-clone-on-VPS `server` step was removed — both deploy paths ship a self-contained image.
- **`plex:join` service picker**: choose *which* Commons services to join (e.g. share Redis but keep MySQL self-hosted) instead of all-or-nothing.
- **`context:remove`**: cleanly drop a stale kube-context (and its cluster/user entries) after deleting a droplet; `cloud:nuke` offers it on teardown.
- **Per-environment registry**: configure **GHCR** or **Docker Hub** per environment — it drives both `cloud:deploy`'s registry push (for multi-node) and the generated GitHub Actions workflow.
- **Fixes**: the scoped apply strips the cluster-scoped `Namespace` object (the scoped SA owns only namespaced resources); corrected GitHub-expression rendering in the generated workflow; and `cloud:init` / `cloud:configure` no longer accidentally clobber sibling commands.

### June 2026: Local Dev Hardening (CLI v0.11.6 – v0.11.8)
Stability fixes for the local development experience, addressing Vite HMR and test suite reliability.

- **Fixed Vite HMR full-reload loops**: MinIO temporary files were triggering constant full-reload messages. Added `watch.ignored` configuration to exclude `.infrastructure/volume_data` from Vite's file watcher.
- **Fixed hanging test suite**: The `PortableCommandTest` was hanging when prompts ran in subprocesses. Tests now complete cleanly without user input (277 passing).
- **Cleaned volume_data from gitignore**: Runtime data (MinIO temps, service databases) now excluded from git by default, preventing untracked file clutter.

### June 2026: Split .env Architecture (CLI v0.11.3 – v0.11.5)
Local development configuration now uses `.env` as the single source of truth, allowing config changes to take effect immediately without `larakube up` restarts.

- **Split .env architecture**: Service connection variables (DB_HOST, REDIS_PORT, etc.) now come via Kubernetes ConfigMap/Secret (environment-driven), while app config lives in `.env` for instant edits without cluster restarts.
- **Wayfinder keep-alive**: The CLI no longer strips Wayfinder from `vite.config` during scaffolding; Wayfinder is now conditional on `wayfinder()` plugin presence instead.
- **WSL2 & local setup fixes**: Improved k3s setup, host trust, and `/etc/hosts` management for WSL2 and Linux environments without flaky elevation prompts.

### June 2026: Cloud Deploy Hardening (CLI v0.11.1 – v0.11.2)
Shaking out the first real multi-app deploy onto a shared Commons. The Plex tier is now **validated end-to-end on a single-node VPS via GitHub Actions** — a React/Inertia app sharing MySQL + Redis + MinIO, on valid Let's Encrypt TLS with production-safe config. Multi-node (DOKS) remains the next validation.

- **One guided `cloud:configure`**: the whole setup now runs in order from a single command — server + web host, an optional Commons join, then CI + secrets — asking the environment once. No more remembering `base → server → plex:join → gha`; the single-step sub-actions remain for surgical re-runs.
- **`plex:join` auto-heals**: after marking the Commons services managed, it regenerates manifests itself, so a deploy never ships duplicate self-hosted pods next to the Commons.
- **Production-safe by default**: cloud environments deploy with `APP_ENV=production` and `APP_DEBUG=false` instead of inheriting the scaffold's local values — no more debug mode live on a public URL. A locked `.env.<env>` is still honoured.
- **`cluster:setup` prefers native k3s** (the lightest option) and defaults to it on Linux; k3d (k3s-in-Docker) is the macOS/Windows fallback, and Docker is only required for that path.
- **Fixes**: the Wayfinder CI step now fires for any app that actually uses Wayfinder (it was gated on an unrelated feature, breaking React/Vue/Svelte builds); `gha:configure` no longer crashes while uploading the kubeconfig; and the web-host prompt can't be skipped or left on a local `.kube` host.

### June 2026: The "Plex Commons" Release (CLI v0.11.0)
Multiple apps can now **share** one set of backing services — the **Commons** — on a single node, each tenant fully isolated. This is the shoestring-hobbyist and agency tier of the [Scaling Journey](../deployment/scaling-journey): reclaim the RAM wasted by duplicate data stacks without giving up per-app isolation.

- **Shared Commons, isolated tenants**: one set of services, where each app gets its own database + login, Redis logical DB, and S3 bucket — the same isolation model as several apps sharing one managed database.
- **Pick your backends**: the Commons runs any mix of a **Postgres / MySQL / MariaDB** database, **Redis**, **Meilisearch**, and S3 object storage (**SeaweedFS** or **MinIO**). MySQL/MariaDB and MinIO landed in this release alongside the original Postgres/Redis/SeaweedFS; the driver enums own each backend's image, port, and tenant-provisioning, so the Commons never drifts from the project defaults.
- **Demand-driven & additive**: each app's blueprint declares its drivers; `plex:join` provisions only what that app needs and never disables a service another tenant still uses.
- **Commands**: `plex:init`, `plex:join`, `plex:status`, `plex:leave`, `plex:remove`, `plex:destroy`, `plex:export`. `plex:status` works inside or outside a project (it'll prompt for a cluster context, like `plex:init`).
- **Honest scope**: verified on a **single-node VPS via manual `larakube cloud:deploy`**. GitHub-Actions-driven Plex deploys and multi-node clusters (DOKS) are on the [roadmap](./roadmap) but not yet validated.

### May 2026: The "Any-Cluster Deployments" Release (CLI v0.9.0)
Two themes: the per-environment blueprint matures, and generated overlays now drop into a **managed Kubernetes cluster** (EKS, GKE, AKS, DigitalOcean) without hand-editing — while the cheap single-VPS path stays exactly as it was.

- **Per-environment deployment strategy**: each environment sets its own `strategy` (`single-node` or `multi-node-ha`); `local` is always single-node. App storage volumes (PVCs) moved into each environment's overlay so their access mode follows that env's strategy (ReadWriteOnce for single-node, ReadWriteMany for HA).
- **Cloud config moved into the environment**: SSH connection details and teammate access now live under `environments[env].cloud` instead of a detached top-level map, so they can't drift from the environment they describe. Older blueprints migrate automatically on load.
- **Managed-Kubernetes overlay knobs** (all optional; each defaults to today's output): a per-env `namespace` override (in-cluster service addresses follow it), an opt-in `serviceAccount` + annotations for IRSA / Workload Identity, image-pull-secret control (`omitImagePullSecret` for clusters that pull via the node role, e.g. ECR), and a raw `ingressAnnotations` passthrough for ALB certificate ARNs, security groups, and conditions.
- **Fixes**: `larakube cloud:configure base` and `users` no longer crash (they called methods that didn't exist); removed the dead `productionImage` field; corrected stale `.larakube.yml` references (the config has long been `.larakube.json`).

Single-node and existing-blueprint output is unchanged (snapshot-verified) — this release is additive, with legacy cloud config migrating transparently.

### May 2026: The "Portable Local Environment" Release (CLI v0.7 – v0.8)
A CLI-free path for collaborators. `larakube portable` generates a self-contained `larakube.sh` wrapper so a teammate can run the project locally with just `docker`, `kubectl`, and `jq` — no LaraKube CLI binary install required.

- **The wrapper covers the full lifecycle** plus host / TLS / trust setup, so Vite HMR and Reverb WebSockets work over real `*.kube` URLs on a teammate's machine.
- **Leaner committed blueprint**: transient, machine-specific fields (`isScaffolding`, `path`) are now stripped from `.larakube.json` on save.

### May 2026: The "Environment-Aware Generation" Release (CLI v0.6.0)
Building on the per-environment schema, manifest generation now honors **every** environment in `.larakube.json` — not just the conventional `local` + `production`. Environment names became a soft contract: rename `production` to `main`, add a `qa`, and the only follow-up is `larakube heal`.

- **Per-environment overlays**: the engine renders a complete overlay for each cloud environment (its own namespace, ingress, hosts, and per-env feature set). `larakube env <name>` now generates the new env's overlay from its own config instead of copying production, and `larakube heal` regenerates every environment.
- **Managed services fully removed where managed**: marking a service `managed` in an env now strips its Deployment/Service via a kustomize `$patch: delete` (local keeps running it), and its volume manifest is no longer written into that env at all — no more stray, unreferenced files.
- **Name-agnostic feature scoping**: feature applicability is computed per env (`appliesToEnvironment`) rather than a fixed env list. Common features (Horizon, Queues, Reverb, Scheduler) now correctly reach custom envs like `staging`/`qa`; SSR applies to every cloud env; local-only tooling (Boost/AI/MCP/Mailpit) stays local.
- **`larakube heal --prune`**: removes generated manifests the blueprint no longer produces — stale volumes, overlays for dropped environments — while always preserving locked files. Opt-in; never automatic.
- **Smarter `larakube env` prompts**: the "managed externally" prompt now offers the project's full externalizable stack (database, cache, search, object storage), and per-service custom-host prompts are limited to genuinely client-facing endpoints (Reverb WebSocket, S3) so you're not pestered for admin consoles.
- **Per-service host correctness**: each environment's ingress now routes to its own configured host, fixing cloud overlays that previously inherited the production domain.

Production and local manifest output are unchanged (snapshot-verified) — this release is additive for custom environments and managed services.

### May 2026: The "Environment-Aware Commands" Release (CLI v0.5.0)
Makes day-to-day commands understand environments as data, and gives every service its own optional hostname.

- **Config-driven environment discovery**: environment lists come solely from `.larakube.json`. Rename or add environments freely — commands no longer reference hardcoded env names.
- **Per-service hosts**: each environment can give a service its own subdomain (e.g. Reverb on `ws.example.com`, S3 on `cdn.example.com`) independent of the web host, via a declarative `HasHosts` contract. New `getHost()` / `setHost()` accessors.
- **`larakube env` rewired** to the per-environment schema (fixing a crash after v0.4.0); it now gathers ingress, managed services, web host, and per-service host overrides for new environments.
- **Sensible command defaults**: observation commands (`k9s`, `kustomize`, `console`) default to `local` with no prompt; cloud/GitHub commands drop hardcoded `production` and prompt from the configured cloud environments instead.
- **Security fix**: database/cache admin consoles no longer leak into non-local (cloud) ingress hosts — they remain local-only.
- **Reliability**: `larakube cloud:init` is now idempotent, so re-running it while adding a second project to a node is safe.

### May 2026: The "Per-Environment Schema" Release (CLI v0.4.0)
This release reshapes `.larakube.json` so every environment owns its own configuration — ingress, managed services, hosts. It's the foundation for multi-environment deployments where local, staging, QA, and production may legitimately need different settings (e.g., projects deployed across isolated VPCs/networks where each env runs an entirely different ingress controller).

- **Per-environment overrides**: `environments` is now a map keyed by env name. Each env carries its own `ingress`, `managed`, `hosts`, plus optional `addFeatures` / `excludeFeatures` for the rare cases where a feature's natural environment scope needs to be overridden.
- **Enum-driven feature scoping**: `LaravelFeature::defaultEnvironments()` declares where each feature naturally applies — `BOOST`, `AI`, `MCP`, `MAILPIT` default to local-only; `SSR` to production-only; everything else runs everywhere. The blueprint's top-level `features` list stays lean and you don't repeat yourself per env.
- **Cleaner production manifests**: dev-only feature env vars (`BOOST_*`, etc.) no longer leak into production deployments — feature filtering is now env-aware end-to-end.
- **Folder-name guard**: `larakube up` and `larakube heal` now fail fast with explicit rename instructions when the project folder name doesn't match the `name` field in `.larakube.json` (the common case: cloning a GitHub repo whose default folder name differs in capitalization).
- **MCP command hygiene**: `make:mcp-app-resource` is now hidden from `larakube list` (it's a LaraKube CLI-internal scaffolding command, not a project-facing one).
- **Breaking blueprint changes** (clean break, no compat layer — migrate manually):
  - `ingressController` (top-level) → `environments.<env>.ingress`
  - `managedServices` (top-level, production-only) → `environments.<env>.managed`
  - `productionHost` → `environments.production.hosts.web`
  - `environments: ["local", "production"]` → `environments: {"local": {…}, "production": {…}}`
- **Migration**: edit `.larakube.json` to the new shape (see the [environments-config-schema plan](https://github.com/luchavez-technologies/larakube-cli/blob/main/plans/completed/environments-config-schema.md) for the full target shape), then run `larakube heal` to regenerate manifests against the new schema. Existing K8s deployments stay running — no cluster-level migration needed.

### May 2026: The "First-Class Testing" Release (CLI v0.3.0)
This milestone made local Laravel testing inside Kubernetes feel **native and safe**, while shipping the foundation for production-grade SSR.

- **Testing**: New `larakube test` command — defaults to in-memory SQLite regardless of project DB driver so `RefreshDatabase` can never wipe dev data. `--db` provisions `<app>_testing` on MySQL/MariaDB/PostgreSQL (auto-persists `provisionTestDb` to `.larakube.json` on first use).
- **Safety Net**: `larakube art test`, `larakube php artisan test`, `larakube php vendor/bin/pest`, `larakube exec vendor/bin/phpunit`, etc. — all routes auto-delegate to the safe `test` flow. No more accidentally-wiped dev databases.
- **Hot Reload**: New `larakube reload` recycles Octane workers and gracefully drains Horizon/queues via a `HasReloadCommand` contract. New `larakube watch` pairs with it — a pure-PHP polling watcher with no host dependencies. Paths configurable via new `watchPaths` field in `.larakube.json`.
- **SSR**: New `ssr` feature flag generates a production-only `node-ssr` Deployment + Service for Inertia Server-Side Rendering. Local dev intentionally skipped (Inertia v3 has native Vite SSR; v2 local SSR adds latency for no benefit).
- **Self-Update**: New `larakube update` command pulls the latest CLI release from GitHub.
- **Faster Pod Boots**: Conditional install during `larakube up` (vendor, node_modules, SSR bundle) means subsequent pod restarts boot in ~5s instead of ~2 min.
- **Cleaner Local Dev**: `AUTORUN_LARAVEL_OPTIMIZE` and cache flags disabled in local pods. `.env` edits show up without restarting the pod; test-time env overrides actually take effect.
- **Vite 8 Fix**: Node pod readiness probe under Vite 8 fixed via explicit `--host 0.0.0.0` (Vite 8's bare `--host` bound to IPv6 wildcard only).
- **Help Passthrough**: `larakube art migrate --help` (and 9 other proxies) now shows the inner command's help instead of LaraKube CLI's.
- **Breaking**: The old `larakube test` (HTTP smoke check) was renamed to `larakube smoke`. The `--with-db` flag was renamed to `--db` (old name kept as backward-compat alias).

### May 2026: The "Cloud Pilot" Release
This milestone transformed LaraKube CLI into a professional deployment suite, establishing the **$6/mo Baseline** and the **Scaling Roadmap**.

- **Ecosystem**: Established the **$6/mo (1GB RAM) VPS** as the official baseline for stable production Kubernetes.
- **GitOps**: Launched **Cloud Pilot**, an automated GHA-to-GHCR pipeline that offloads heavy builds to GitHub to prevent OOM on small servers.
- **AI-Native**: Refactored the core into a **Dual-MCP** architecture (Local Mechanic + Master Architect).
- **Console**: Migrated to **Filament v5** for a professional "Control Plane" aesthetic and Saloon-powered API integration.
- **UX**: Added interactive **Anchor Links** and **Share Buttons** to the documentation for better developer collaboration.

---

## 🔗 Technical Release Notes
For a line-by-line breakdown of every fix and feature, please follow our individual repository releases:

- **[LaraKube CLI Releases](https://github.com/luchavez-technologies/larakube-cli/releases)**: Tracking the core PHP orchestration engine.
- **[LaraKube Console Releases](https://github.com/luchavez-technologies/larakube-console/releases)**: Updates to the visual Kubernetes Control Plane.
- **[LaraKube CLI Documentation](https://github.com/luchavez-technologies/larakube-docs/commits/main)**: Ongoing improvements to guides and visual schematics.

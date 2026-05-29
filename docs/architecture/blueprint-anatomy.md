---
sidebar_position: 3
title: Blueprint Anatomy
description: A real-world .larakube.json walkthrough — every field explained on a project that uses most of LaraKube's features across local, staging, and production environments.
---
# Blueprint Anatomy

`.larakube.json` is the source of truth for every LaraKube project. The CLI reads it during `larakube up`, `heal`, `add`, `env`, and every cloud command — there is no separate database, no IaC sidecar, no inferred state. If you can edit this file, you can change how the cluster is shaped.

This page walks through a **mature blueprint** — one that exercises most of LaraKube's surface area: multiple databases, scout, object storage, full Laravel feature stack, Inertia SSR, three environments (local / staging / production), per-env managed services, and per-service hostnames (Reverb on its own subdomain, S3 on its own subdomain).

Use it as a reference when designing your own setup. You almost certainly don't need every section — most production apps use 60-70% of it.

## 📄 The full example

```json title=".larakube.json"
{
    "id": "9f3b7c1e-2d4a-4f9e-8c1d-1b2a3c4d5e6f",
    "name": "acme-app",
    "blueprints": ["filament"],
    "serverVariation": "frankenphp",
    "frontend": "react",
    "phpVersion": "8.5",
    "os": "alpine",
    "email": "team@acme.example",
    "additionalExtensions": ["gd", "exif"],
    "features": [
        "octane",
        "scheduler",
        "horizon",
        "scout",
        "reverb",
        "ssr",
        "ai",
        "boost",
        "mcp"
    ],
    "scoutDriver": "meilisearch",
    "packageManager": "npm",
    "objectStorage": "minio",
    "cacheDriver": "redis",
    "database": "postgres",
    "strategy": "single-node",
    "environments": {
        "local": {
            "managed": [],
            "hosts": {}
        },
        "staging": {
            "ingress": "traefik",
            "managed": [],
            "hosts": {
                "web": "staging.acme.example",
                "reverb": "ws-stg.acme.example",
                "s3": "cdn-stg.acme.example"
            }
        },
        "production": {
            "ingress": "aws-alb",
            "managed": ["postgres", "redis", "meilisearch"],
            "hosts": {
                "web": "acme.example",
                "reverb": "ws.acme.example",
                "s3": "cdn.acme.example"
            }
        }
    },
    "githubActions": true,
    "withCompanions": true,
    "provisionTestDb": true,
    "lockedFiles": [
        "Dockerfile.php",
        ".env.production",
        ".env.staging"
    ],
    "watchPaths": [
        "app",
        "bootstrap",
        "config",
        "database",
        "public",
        "resources",
        "routes",
        "composer.lock",
        ".env"
    ],
    "cloud": {
        "production": {
            "ip": "203.0.113.10",
            "user": "deploy",
            "port": 22,
            "key": "~/.ssh/id_rsa"
        }
    }
}
```

## 🧬 Project identity

```json
"id": "9f3b7c1e-2d4a-4f9e-8c1d-1b2a3c4d5e6f",
"name": "acme-app",
"email": "team@acme.example"
```

- **`id`** — A UUID generated on first `larakube init`. Persistent across folder renames and machine moves. The Console uses it as the primary key for activity history. Don't edit by hand.
- **`name`** — The Kubernetes-friendly slug for this project. Namespaces are derived as `{name}-{environment}` (e.g. `acme-app-local`, `acme-app-production`). The project folder name must match exactly (case-sensitive) — see [Architectural DNA](./architectural-dna).
- **`email`** — Used by Let's Encrypt certbot when LaraKube manages TLS for you in production.

## 🏗️ Stack choices

```json
"blueprints": ["filament"],
"serverVariation": "frankenphp",
"frontend": "react",
"phpVersion": "8.5",
"os": "alpine",
"packageManager": "npm",
"additionalExtensions": ["gd", "exif"]
```

- **`blueprints`** — High-level project archetypes (Filament admin, Statamic CMS, etc.). See [Multi-Blueprint](./multi-blueprint) — they pull in conventional defaults and auto-mount the right components.
- **`serverVariation`** — The PHP runtime. Options: `frankenphp` (recommended, Octane-friendly), `fpm-nginx`, `fpm-apache`. Drives the Docker image LaraKube builds.
- **`frontend`** — `react`, `vue`, `svelte`, or `livewire`. Determines whether a Node pod is needed and which Echo/Inertia packages get pulled in.
- **`phpVersion`** — Pinned to a specific PHP minor (8.3, 8.4, 8.5). Drives the SSU PHP image tag.
- **`os`** — `alpine` (small, fast cold-start) or `bookworm` (Debian, broader compat for native extensions).
- **`packageManager`** — `npm`, `pnpm`, `yarn`, or `bun`. Used for the Node pod's build commands.
- **`additionalExtensions`** — PHP extensions LaraKube installs beyond what the stack requires. Most projects only need 1-2 here; LaraKube derives the rest from your features and drivers.

## 💾 Data layer

```json
"database": "postgres",
"cacheDriver": "redis",
"scoutDriver": "meilisearch",
"objectStorage": "minio"
```

The four "single primary" data choices. Each maps to a deployed pod in local (Postgres pod, Redis pod, Meilisearch pod, MinIO pod), and the env-var aggregator wires `DB_*`, `CACHE_*`, `SCOUT_*`, `AWS_*` automatically.

If you need a secondary database (e.g. MongoDB alongside Postgres for analytics), use the `"databases"` array — same pattern for `"cacheDrivers"`, `"scoutDrivers"`, `"objectStorages"`.

## 🧩 Features

```json
"features": [
    "octane", "scheduler", "horizon",
    "scout", "reverb", "ssr",
    "ai", "boost", "mcp"
]
```

The Laravel ecosystem switches. Crucially, this is **a single project-wide list** — you don't repeat features per environment.

LaraKube knows where each feature naturally applies via `LaravelFeature::appliesToEnvironment($env)` — and it's environment-name-agnostic, so the rules hold for any env you create (`staging`, `qa`, …), not just `local`/`production`:

| Feature | Applies to |
|---|---|
| `horizon`, `queues`, `scheduler`, `reverb`, `scout`, `octane` | All envs |
| `ssr` | Every cloud (non-local) env — Vite handles local SSR natively in dev |
| `boost`, `ai`, `mcp`, `mailpit` | Local only (dev tooling) |

You **almost never** need to override this. If you do (e.g. you want Boost in a sandbox env), use the per-env `addFeatures` / `excludeFeatures` arrays inside `environments[env]`.

## 🌍 Environments

```json
"environments": {
    "local": { … },
    "staging": { … },
    "production": { … }
}
```

The heart of the blueprint. Each environment is its own `EnvironmentData` with five optional fields:

- **`ingress`** — Override the default Traefik ingress for this env. Common reasons: production on AWS ALB, staging on Nginx, QA on a different controller because it lives in a separate VPC.
- **`managed`** — Services that are **externally managed** in this env (e.g. RDS Postgres in production). LaraKube skips their Deployment manifests for this env but still wires the env vars to point at the external endpoint your `.env.{env}` provides.
- **`hosts`** — Per-service externally-visible hostnames. See the next section for the Reverb/S3 patterns.
- **`addFeatures`** — Opt a feature INTO this env that's normally excluded (e.g. enable Boost in a "sandbox" env).
- **`excludeFeatures`** — Opt a feature OUT of this env that's normally included (e.g. disable Horizon in QA).

### Local

```json
"local": {
    "managed": [],
    "hosts": {}
}
```

The simplest case: LaraKube deploys everything (Postgres, Redis, Meilisearch, MinIO pods all run in k3d), no custom hostnames needed (everything answers on `*.dev.test` via the bundled Traefik certs).

### Staging

```json
"staging": {
    "ingress": "traefik",
    "managed": [],
    "hosts": {
        "web": "staging.acme.example",
        "reverb": "ws-stg.acme.example",
        "s3": "cdn-stg.acme.example"
    }
}
```

A real cluster, but still self-contained: LaraKube runs Postgres/Redis/Meilisearch/MinIO inside the cluster (cheap, isolated, easy to nuke and recreate). Traefik handles ingress.

### Production

```json
"production": {
    "ingress": "aws-alb",
    "managed": ["postgres", "redis", "meilisearch"],
    "hosts": {
        "web": "acme.example",
        "reverb": "ws.acme.example",
        "s3": "cdn.acme.example"
    }
}
```

The grown-up environment: AWS ALB instead of Traefik (managed TLS termination + WAF integration), and the three heavy data services are **externally managed** (RDS Postgres, ElastiCache Redis, a hosted Meilisearch). LaraKube skips those Deployments and trusts your `.env.production` to point at the real endpoints.

MinIO is **not** in `managed` — we're still running our own S3-compatible storage in this env. The `s3` host override exposes it through `cdn.acme.example`.

## 🌐 Per-service hostnames

The `hosts` map under each environment is where modern Laravel-on-K8s patterns get expressed cleanly. Three resolution rules, first match wins:

1. **Explicit per-service override.** `"reverb": "ws.acme.example"` puts the Reverb WebSocket server on its own subdomain. This is the right pattern for WebSockets, S3-compatible storage, and admin UIs that need WAF rules separate from the main app.
2. **Derived from `web`.** If a service has no explicit host but `web` is set, LaraKube produces `{service}-{webHost}` — e.g. Meilisearch defaults to `meilisearch-acme.example`.
3. **Local dev fallback.** Outside cloud envs, everything resolves to `{service}-{name}.dev.test` (handled by the bundled Traefik certs).

Components self-describe their overrideable services via `HasHosts::getHostServices()` — so when you run `larakube env qa`, the wizard automatically prompts for every service that could take its own subdomain (Reverb, S3, the Storage console, Meilisearch, etc.) without LaraKube being modified.

Common patterns worth knowing:

- **Horizon and Queues are NOT in `hosts`.** Horizon mounts under `/horizon` on the main web host; queues have no UI. They don't need their own subdomain.
- **Database/cache consoles are local-only.** LaraKube refuses to publish `mysql-{name}.dev.test` style consoles through cloud ingress — they only render on local. Use a bastion + port-forward for production database access.

## ⚙️ Strategy & deployment

```json
"strategy": "single-node",
"githubActions": true,
"withCompanions": true,
"provisionTestDb": true
```

- **`strategy`** — `single-node` (one VPS, k3d-on-prod for the $6 baseline) or `cluster` (multi-node, real production at scale). Drives whether LaraKube generates Let's Encrypt cert resolvers or expects external TLS.
- **`githubActions`** — Whether the GHA Cloud Pilot workflow is enabled. When `true`, `larakube gha:configure` is wired to push secrets and the deploy workflow exists at `.github/workflows/larakube-deploy-{env}.yml`.
- **`withCompanions`** — Include developer-facing companion apps (Mailpit, PhpMyAdmin, RedisInsight, Grafana) on local. Set `false` if you want a leaner local cluster.
- **`provisionTestDb`** — When `true`, `larakube test --db` provisions `{name}_testing` on your project's real DB engine. Auto-set on first `larakube test --db` invocation. Useful for projects with engine-specific tests (Postgres JSONB, MySQL JSON ops) that can't run on in-memory SQLite.

## ☁️ Cloud connection

```json
"cloud": {
    "production": {
        "ip": "203.0.113.10",
        "user": "deploy",
        "port": 22,
        "key": "~/.ssh/id_rsa"
    }
}
```

SSH connection info for each cloud env, populated by `larakube cloud:configure`. Used by `larakube cloud:deploy`, `cloud:provision`, and the GHA Cloud Pilot to reach the VPS. One block per cloud environment — staging would have its own entry if you're deploying to a separate VPS.

The `key` field can be an absolute path or `~`-relative. Permissions on the local file are validated before LaraKube attempts to use it.

## 🔒 Maintenance fields

```json
"lockedFiles": [
    "Dockerfile.php",
    ".env.production",
    ".env.staging"
],
"watchPaths": [
    "app", "bootstrap", "config", "database",
    "public", "resources", "routes",
    "composer.lock", ".env"
]
```

- **`lockedFiles`** — Files `larakube heal` will NOT regenerate. Use this when you've hand-edited a generated file (e.g. customized `Dockerfile.php` for a specific extension) and don't want heal to clobber your changes. Add via `larakube lock <path>`, remove via `larakube unlock <path>`.
- **`watchPaths`** — Paths `larakube watch` polls for changes to trigger Octane / Horizon / queue reloads. Defaults to the conventional Laravel layout; override if your project uses a DDD or modules structure.

## 🤖 System fields

Three fields you'll usually leave alone but should recognize when reading other projects' blueprints:

- **`isSystem`** — LaraKube's own infrastructure projects set this to `true` (e.g. the Console itself). Skips a few user-app conventions. Always `false` for your apps.
- **`isScaffolding`** — Transiently `true` during `larakube new` while the project is being scaffolded. Should be `false` in a healthy committed blueprint.
- **`productionImage`** — The OCI image reference (e.g. `ghcr.io/team/acme-app`) that cloud deployments pull. Auto-populated by `larakube cloud:configure`. Leave `null` if you're not deploying to cloud yet.

## 🚦 Editing safely

If you're going to hand-edit `.larakube.json`:

1. **Validate after editing.** Run `larakube heal --force` — it'll fail loudly if the schema is malformed.
2. **Re-render manifests.** `larakube heal` regenerates everything under `.infrastructure/k8s/` to match. Existing cluster resources stay running; the next `larakube up` reconciles.
3. **Commit the blueprint before the manifests.** The blueprint is the truth; manifests are the derivation. A reviewer should be able to read the blueprint diff and understand what the manifest diff is going to say.

For most changes (adding a feature, changing the ingress controller, adding an environment), prefer the dedicated commands — `larakube add`, `larakube env`, `larakube cloud:configure` — over hand-editing. They run the validation pass for you.

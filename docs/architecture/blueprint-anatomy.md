---
sidebar_position: 3
title: Blueprint Anatomy
description: A real-world .larakube.json walkthrough — every field explained on a project that uses most of LaraKube's features across local, staging, and production environments.
---
# Blueprint Anatomy

`.larakube.json` is the source of truth for every LaraKube project. The CLI reads it during `larakube up`, `heal`, `add`, `env`, and every cloud command — there is no separate database, no IaC sidecar, no inferred state. If you can edit this file, you can change how the cluster is shaped.

This page walks through a **mature blueprint** — one that exercises most of LaraKube's surface area: multiple databases, scout, object storage, full Laravel feature stack, Inertia SSR, three environments (local / staging / production), a per-env deployment strategy (single-node staging, multi-node-HA production), per-env managed services, per-service hostnames (Reverb on its own subdomain, S3 on its own subdomain), and the managed-Kubernetes overlay knobs that let production land on EKS (IRSA, existing namespace, ALB annotations).

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
            "strategy": "multi-node-ha",
            "namespace": "acme-app",
            "managed": ["postgres", "redis", "meilisearch"],
            "hosts": {
                "web": "acme.example",
                "reverb": "ws.acme.example",
                "s3": "cdn.acme.example"
            },
            "serviceAccount": "acme-app-sa",
            "serviceAccountAnnotations": {
                "eks.amazonaws.com/role-arn": "arn:aws:iam::123456789012:role/acme-app"
            },
            "omitImagePullSecret": true,
            "ingressAnnotations": {
                "alb.ingress.kubernetes.io/certificate-arn": "arn:aws:acm:us-east-1:123456789012:certificate/abcd-1234",
                "alb.ingress.kubernetes.io/security-groups": "sg-0123456789abcdef0"
            },
            "cloud": {
                "ip": "203.0.113.10",
                "user": "deploy",
                "port": 22,
                "key": "~/.ssh/id_rsa",
                "teammates": []
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
    ]
}
```

## 🧬 Project identity

```json
"id": "9f3b7c1e-2d4a-4f9e-8c1d-1b2a3c4d5e6f",
"name": "acme-app",
"email": "team@acme.example"
```

- **`id`** — A UUID generated on first `larakube init`. Persistent across folder renames and machine moves. The Console uses it as the primary key for activity history. Don't edit by hand.
- **`name`** — The Kubernetes-friendly slug for this project. Namespaces are derived as `{name}-{environment}` (e.g. `acme-app-local`, `acme-app-production`) unless an environment overrides it with `namespace` (see [Managed-Kubernetes overlay knobs](#managed-kubernetes-overlay-knobs)). The project folder name must match exactly (case-sensitive) — see [Architectural DNA](./architectural-dna).
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

The heart of the blueprint. Each environment is its own `EnvironmentData`. Every field is optional and defaults to the project-level / Single-Node-Hero behavior, so a minimal env (`{}`) is perfectly valid. The core fields:

- **`ingress`** — Override the default Traefik ingress for this env. Common reasons: production on AWS ALB, staging on Nginx, QA on a different controller because it lives in a separate VPC.
- **`strategy`** — Per-env deployment strategy: `single-node` or `multi-node-ha`. Overrides the project-level `strategy` for this env only — so staging can run `single-node` while production runs `multi-node-ha` from one blueprint. **`local` is always `single-node`** regardless (it's one machine), so its volumes stay `ReadWriteOnce`.
- **`managed`** — Services that are **externally managed** in this env (e.g. RDS Postgres in production). LaraKube skips their Deployment manifests for this env but still wires the env vars to point at the external endpoint your `.env.{env}` provides.
- **`hosts`** — Per-service externally-visible hostnames. See the next section for the Reverb/S3 patterns.
- **`cloud`** — SSH connection (`ip`, `user`, `port`, `key`) and `teammates` (SSH-key access) for deploying this env to a remote host. Populated by `larakube cloud:configure`. See the **Cloud connection** section below.
- **`addFeatures`** — Opt a feature INTO this env that's normally excluded (e.g. enable Boost in a "sandbox" env).
- **`excludeFeatures`** — Opt a feature OUT of this env that's normally included (e.g. disable Horizon in QA).

Plus the optional [Managed-Kubernetes overlay knobs](#managed-kubernetes-overlay-knobs) (`namespace`, `serviceAccount`, `serviceAccountAnnotations`, `imagePullSecret` / `omitImagePullSecret`, `ingressAnnotations`) for dropping an overlay into EKS/GKE/AKS — shown on `production` above and detailed in their own section.

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
    "strategy": "multi-node-ha",
    "namespace": "acme-app",
    "managed": ["postgres", "redis", "meilisearch"],
    "hosts": { "web": "acme.example", "reverb": "ws.acme.example", "s3": "cdn.acme.example" },
    "serviceAccount": "acme-app-sa",
    "serviceAccountAnnotations": { "eks.amazonaws.com/role-arn": "arn:aws:iam::123456789012:role/acme-app" },
    "omitImagePullSecret": true,
    "ingressAnnotations": {
        "alb.ingress.kubernetes.io/certificate-arn": "arn:aws:acm:us-east-1:123456789012:certificate/abcd-1234",
        "alb.ingress.kubernetes.io/security-groups": "sg-0123456789abcdef0"
    },
    "cloud": { "ip": "203.0.113.10", "user": "deploy", "port": 22, "key": "~/.ssh/id_rsa", "teammates": [] }
}
```

The grown-up environment, here shown as a managed EKS cluster. AWS ALB instead of Traefik (managed TLS termination + WAF integration), `multi-node-ha` so the workload runs replicated, and the three heavy data services are **externally managed** (RDS Postgres, ElastiCache Redis, a hosted Meilisearch). LaraKube skips those Deployments and trusts your `.env.production` to point at the real endpoints.

It also uses the [Managed-Kubernetes overlay knobs](#managed-kubernetes-overlay-knobs): the overlay lands in the existing `acme-app` namespace, the pods run under an IRSA-annotated ServiceAccount, the image pull secret is dropped (ECR is reached via the node/IRSA role), and the ALB cert ARN + security groups ride through as ingress annotations. None of those are needed for the Single-Node-Hero path — they only appear when you set them.

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

## ☸️ Managed-Kubernetes overlay knobs {#managed-kubernetes-overlay-knobs}

These optional per-env fields let a generated overlay drop into a managed cluster (EKS / GKE / AKS) without hand-editing. **Every one defaults to today's Single-Node-Hero behavior when unset** — they only change the output when you set them, so an ordinary blueprint never carries them. They're shown on the `production` env in the example above.

- **`namespace`** — Land the overlay in an existing namespace instead of the derived `{name}-{environment}`. In-cluster service FQDNs (`DB_HOST`, `REDIS_HOST`, …) follow the override too.
- **`serviceAccount`** — Run the app pods under a named ServiceAccount. By default user pods have no SA; set this for IRSA (EKS) or Workload Identity (GKE). LaraKube emits the ServiceAccount resource and sets `serviceAccountName` on the workloads.
- **`serviceAccountAnnotations`** — Annotations on that ServiceAccount, e.g. `{"eks.amazonaws.com/role-arn": "arn:aws:iam::…:role/…"}` for IRSA. Only emitted when `serviceAccount` is set.
- **`imagePullSecret`** — Name of the image pull secret. Defaults to `ghcr-login` (the Single-Node-Hero GHCR secret).
- **`omitImagePullSecret`** — Drop the `imagePullSecrets` block entirely, for clusters that pull via the node/IRSA role (e.g. ECR on EKS) and need no secret.
- **`ingressAnnotations`** — A raw passthrough map merged over the controller's default ingress annotations. This is where ALB specifics live — ACM `certificate-arn`, `security-groups`, `conditions.*` / `actions.*`. Values are emitted JSON-safe, so free-form JSON-string conditions stay valid YAML. It's a dumb merge: your entries extend (and can override) the defaults.

## ⚙️ Strategy & deployment

```json
"strategy": "single-node",
"githubActions": true,
"withCompanions": true,
"provisionTestDb": true
```

- **`strategy`** — The project-level default: `single-node` (one VPS / k3s, the $6 baseline — `ReadWriteOnce` volumes, Let's Encrypt cert resolver) or `multi-node-ha` (multiple replicas, `ReadWriteMany` volumes, external/managed TLS). Any environment can override it with its own `strategy` (see the **Environments** section) — e.g. `single-node` staging + `multi-node-ha` production from one blueprint. `local` is always `single-node`.
- **`githubActions`** — Whether the GHA Cloud Pilot workflow is enabled. When `true`, `larakube gha:configure` is wired to push secrets and the deploy workflow exists at `.github/workflows/larakube-deploy-{env}.yml`.
- **`withCompanions`** — Include developer-facing companion apps (Mailpit, PhpMyAdmin, RedisInsight, Grafana) on local. Set `false` if you want a leaner local cluster.
- **`provisionTestDb`** — When `true`, `larakube test --db` provisions `{name}_testing` on your project's real DB engine. Auto-set on first `larakube test --db` invocation. Useful for projects with engine-specific tests (Postgres JSONB, MySQL JSON ops) that can't run on in-memory SQLite.

## ☁️ Cloud connection

Cloud connection lives **inside the environment it describes**, as `environments[env].cloud` — so it can't drift from the env it belongs to:

```json
"environments": {
    "production": {
        "cloud": {
            "ip": "203.0.113.10",
            "user": "deploy",
            "port": 22,
            "key": "~/.ssh/id_rsa",
            "teammates": []
        }
    }
}
```

SSH connection info for a cloud env, populated by `larakube cloud:configure`. Used by `larakube cloud:deploy`, `cloud:provision`, and the GHA Cloud Pilot to reach the host. Each cloud env carries its own block — staging deploying to a separate VPS gets its own `environments.staging.cloud`.

- **`ip` / `user` / `port`** — how to SSH in.
- **`key`** — the private key path; absolute or `~`-relative. Permissions on the local file are validated before LaraKube uses it.
- **`teammates`** — SSH-key access entries synced to this host by `larakube cloud:configure users`. Per-env, so different hosts can grant different people access.

:::note Legacy blueprints
Older projects stored a single top-level `"cloud": { "<env>": { … }, "users": [ … ] }` map. LaraKube migrates that into `environments[env].cloud` automatically on load and rewrites it in the new shape on the next save — no manual edit required.
:::

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

Fields you'll usually leave alone but should recognize when reading blueprints:

- **`isSystem`** — LaraKube's own infrastructure projects set this to `true` (e.g. the Console itself). Skips a few user-app conventions. Always `false` for your apps.
- **`productionImage`** — An optional OCI image reference (e.g. `ghcr.io/team/acme-app`), set via the `--production-image` flag on `larakube init`. Advisory metadata — current manifest generation uses a `{name}:latest` placeholder that CI substitutes with the freshly built image — so leaving it `null` is the norm.

You may also see these **transient** fields in the in-memory object, but **never in a committed `.larakube.json`** — they're stripped on save:

- **`isScaffolding`** — `true` only mid-`larakube new` while the project is being scaffolded.
- **`path`** — the absolute filesystem path of the project, set at runtime (machine-specific, so it's never written to disk).

## 🚦 Editing safely

If you're going to hand-edit `.larakube.json`:

1. **Validate after editing.** Run `larakube heal --force` — it'll fail loudly if the schema is malformed.
2. **Re-render manifests.** `larakube heal` regenerates everything under `.infrastructure/k8s/` to match. Existing cluster resources stay running; the next `larakube up` reconciles.
3. **Commit the blueprint before the manifests.** The blueprint is the truth; manifests are the derivation. A reviewer should be able to read the blueprint diff and understand what the manifest diff is going to say.

For most changes (adding a feature, changing the ingress controller, adding an environment), prefer the dedicated commands — `larakube add`, `larakube env`, `larakube cloud:configure` — over hand-editing. They run the validation pass for you.

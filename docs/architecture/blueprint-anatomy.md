---
sidebar_position: 3
title: Blueprint Anatomy
description: A friendly walkthrough of .larakube.json — the one file that describes your whole project, from a 5-line starter to a full local/staging/production setup.
---
# Blueprint Anatomy

`.larakube.json` is the one file that describes your whole project. LaraKube reads it during `larakube up`, `heal`, `add`, `env`, and the cloud commands — there's no hidden database and no separate config to keep in sync. Change this file, and you change how your app is deployed.

Don't let a big example scare you: **you only fill in what you use.** Most of the fields below are optional, and a brand-new project starts with just a handful.

## 🌱 The smallest blueprint

This is a complete, valid blueprint:

```json title=".larakube.json"
{
    "name": "my-app",
    "serverVariation": "frankenphp",
    "phpVersion": "8.5",
    "database": "sqlite",
    "environments": {
        "local": {},
        "production": {}
    }
}
```

That's enough to run locally and deploy. Everything else on this page is something you *add* as your needs grow.

## 📄 A fuller example

Here's a more grown-up project — Filament admin, React frontend, a real database, search, caching, file storage, queues, websockets, and three environments (local, staging, production). Use it as a menu, not a checklist:

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
        "local": {},
        "staging": {
            "ingress": "nginx",
            "hosts": {
                "web": "staging.acme.example",
                "reverb": "ws-stg.acme.example",
                "s3": "cdn-stg.acme.example"
            },
            "cloud": {
                "ip": "203.0.113.20",
                "user": "deploy",
                "port": 22,
                "key": "~/.ssh/id_rsa"
            }
        },
        "production": {
            "managed": ["postgres", "redis"],
            "hosts": {
                "web": "acme.example",
                "reverb": "ws.acme.example",
                "s3": "cdn.acme.example"
            },
            "cloud": {
                "ip": "203.0.113.10",
                "user": "deploy",
                "port": 22,
                "key": "~/.ssh/id_rsa"
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

Let's walk through it section by section.

## 🧬 Project identity

```json
"id": "9f3b7c1e-2d4a-4f9e-8c1d-1b2a3c4d5e6f",
"name": "acme-app",
"email": "team@acme.example"
```

- **`id`** — A unique ID created the first time you run `larakube init`. It sticks with the project even if you rename the folder or move machines. You never edit this by hand.
- **`name`** — Your project's short name. LaraKube uses it to label everything it creates in the cluster (each environment gets its own isolated space named `acme-app-local`, `acme-app-production`, and so on). The project folder name must match exactly — see [Architectural DNA](./architectural-dna).
- **`email`** — Used when LaraKube requests free HTTPS certificates from Let's Encrypt for your production site.

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

- **`blueprints`** — Ready-made project types (a Filament admin, a Statamic CMS, etc.) that pull in sensible defaults for you. See [Multi-Blueprint](./multi-blueprint).
- **`serverVariation`** — How PHP runs: `frankenphp` (recommended, great with Octane), `fpm-nginx`, or `fpm-apache`. This decides the Docker image LaraKube builds.
- **`frontend`** — `react`, `vue`, `svelte`, or `livewire`. Tells LaraKube whether your app needs a separate Node build step and which Inertia/Echo packages to include.
- **`phpVersion`** — The PHP version to pin (8.3, 8.4, 8.5).
- **`os`** — `alpine` (small and fast to start) or `bookworm` (Debian — broader compatibility if you need certain native extensions).
- **`packageManager`** — `npm`, `pnpm`, `yarn`, or `bun`, for building your frontend assets.
- **`additionalExtensions`** — Extra PHP extensions to install. You usually only need one or two here — LaraKube figures out the rest from your features and database choices.

## 💾 Data layer

```json
"database": "postgres",
"cacheDriver": "redis",
"scoutDriver": "meilisearch",
"objectStorage": "minio"
```

Your four main data choices: the database, cache, search engine, and file/object storage. Locally, LaraKube runs each one for you (a Postgres, Redis, Meilisearch, and MinIO service), and it fills in the matching `DB_*`, `CACHE_*`, `SCOUT_*`, and `AWS_*` environment variables automatically — you don't wire those up by hand.

Need a second database (say, MongoDB for analytics alongside Postgres)? Use the plural `"databases"` array. The same plural form exists for `"cacheDrivers"`, `"scoutDrivers"`, and `"objectStorages"`.

## 🧩 Features

```json
"features": [
    "octane", "scheduler", "horizon",
    "scout", "reverb", "ssr",
    "ai", "boost", "mcp"
]
```

The Laravel extras you want turned on. This is **one list for the whole project** — you don't repeat it per environment.

LaraKube already knows where each feature belongs, and these rules work for any environment name you create (`staging`, `qa`, …), not just `local` and `production`:

| Feature | Turned on in |
|---|---|
| `horizon`, `queues`, `scheduler`, `reverb`, `scout`, `octane` | Every environment |
| `ssr` | Every deployed (non-local) environment — locally, Vite already handles SSR for you |
| `boost`, `ai`, `mcp`, `mailpit` | Local only (these are dev tools) |

You almost never need to change this. But if you want to (say, turn on Boost in a throwaway sandbox environment), each environment accepts an `addFeatures` list (turn something on) and an `excludeFeatures` list (turn something off).

## 🌍 Environments

```json
"environments": {
    "local": {},
    "staging": { … },
    "production": { … }
}
```

This is the heart of the blueprint. Every project has a `local` environment; you add `staging`, `production`, or any name you like. **Each environment's settings are optional** — an empty `{}` (like `local` above) just means "use the sensible defaults." The settings you can set per environment:

- **`ingress`** — Which traffic router sends visitors to your app. Defaults to **Traefik** (what LaraKube installs for you). You can switch an environment to **Nginx** with `"ingress": "nginx"` — handy when an environment lives somewhere that already uses the Nginx ingress controller. (There's an AWS option too — see [Advanced: managed Kubernetes](#advanced-managed-kubernetes).)
- **`strategy`** — `single-node` or `multi-node-ha` for this environment. See [Strategy](#strategy) below.
- **`managed`** — Services you run *outside* the cluster in this environment. For example, `["postgres", "redis"]` in production means "I'm using a managed database and Redis from my hosting provider." LaraKube won't deploy its own Postgres/Redis there — it just points your app at the addresses in your `.env.production`.
- **`hosts`** — The real domain names for this environment. See [Per-service domains](#per-service-domains) below.
- **`cloud`** — How LaraKube connects to the server for this environment (SSH details). See [Cloud connection](#cloud-connection) below.
- **`addFeatures` / `excludeFeatures`** — Turn a feature on or off just for this environment (rarely needed).

### Local

```json
"local": {}
```

The simplest case. LaraKube runs everything for you (Postgres, Redis, Meilisearch, MinIO), and every service answers on a friendly `*.dev.test` address with HTTPS already trusted — no setup required.

### Staging

```json
"staging": {
    "ingress": "nginx",
    "hosts": {
        "web": "staging.acme.example",
        "reverb": "ws-stg.acme.example",
        "s3": "cdn-stg.acme.example"
    },
    "cloud": { "ip": "203.0.113.20", "user": "deploy", "port": 22, "key": "~/.ssh/id_rsa" }
}
```

A real server, but still self-contained: LaraKube runs Postgres, Redis, Meilisearch, and MinIO right inside this environment (cheap, isolated, easy to wipe and recreate). Here it uses the **Nginx** ingress instead of the default Traefik, and it has its own server connection details.

### Production

```json
"production": {
    "managed": ["postgres", "redis"],
    "hosts": {
        "web": "acme.example",
        "reverb": "ws.acme.example",
        "s3": "cdn.acme.example"
    },
    "cloud": { "ip": "203.0.113.10", "user": "deploy", "port": 22, "key": "~/.ssh/id_rsa" }
}
```

The grown-up environment. It uses the default Traefik ingress (no `ingress` line needed), and its database and Redis are **managed** — running on the hosting provider's managed services rather than inside the cluster. LaraKube skips deploying its own Postgres/Redis here and trusts the addresses in your `.env.production`.

Notice MinIO is **not** in `managed` — we're still running our own file storage in production, and the `s3` host exposes it at `cdn.acme.example`.

## 🌐 Per-service domains {#per-service-domains}

The `hosts` map is how you give each part of your app its own domain. LaraKube picks a domain using three rules, in order:

1. **You set it explicitly.** `"reverb": "ws.acme.example"` puts the Reverb websocket server on its own subdomain. This is the recommended pattern for websockets, file storage, and admin UIs.
2. **It's built from `web`.** If a service has no domain of its own but you've set `web`, LaraKube derives one — e.g. Meilisearch becomes `meilisearch-acme.example`.
3. **Local fallback.** Locally, everything just answers on `{service}-{name}.dev.test`.

When you run `larakube env qa`, the wizard automatically asks about every service that can take its own subdomain (Reverb, file storage, Meilisearch, …), so you don't have to remember them.

A couple of things worth knowing:

- **Horizon and queues don't get their own domain.** Horizon shows up at `/horizon` on your main site; queues have no UI.
- **Database/cache dashboards are local-only.** LaraKube won't expose a database console to the internet — those only show up locally. For production database access, use an SSH tunnel.

## ⚙️ Strategy & deployment {#strategy}

```json
"strategy": "single-node",
"githubActions": true,
"withCompanions": true,
"provisionTestDb": true
```

- **`strategy`** — How your app is spread across servers:
  - `single-node` — one server (the classic, low-cost setup). This is the default.
  - `multi-node-ha` — several servers for high availability, with shared storage.

  This is the project-wide default, and any environment can override it (e.g. a `single-node` staging and a `multi-node-ha` production from the same blueprint). **`local` is always `single-node`** — it's just your one machine.
- **`githubActions`** — Whether the GitHub Actions deploy workflow is set up. When `true`, `larakube gha:configure` wires up the secrets and creates the deploy workflow for you.
- **`withCompanions`** — Whether to include the handy local-only dev apps (Mailpit, phpMyAdmin, RedisInsight, Grafana). Set to `false` for a leaner local setup.
- **`provisionTestDb`** — When `true`, `larakube test --db` runs your tests against a real copy of your database engine instead of in-memory SQLite. Useful when your tests rely on database-specific features. LaraKube sets this for you the first time you run `larakube test --db`.

## ☁️ Cloud connection {#cloud-connection}

Each environment that deploys to a server keeps its connection details right inside it, under `cloud`:

```json
"environments": {
    "production": {
        "cloud": {
            "ip": "203.0.113.10",
            "user": "deploy",
            "port": 22,
            "key": "~/.ssh/id_rsa",
            "teammates": [
                {
                    "username": "alice",
                    "name": "Alice Rivera",
                    "state": "present",
                    "groups": ["sudo"],
                    "shell": "/bin/bash",
                    "authorized_keys": [
                        { "public_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... alice@laptop" }
                    ]
                }
            ]
        }
    }
}
```

You fill this in by running `larakube cloud:configure`. It's used to reach your server for deploys.

- **`ip` / `user` / `port`** — how to SSH into the server.
- **`key`** — path to your SSH private key (absolute, or `~`-relative).
- **`teammates`** — other people who should be able to SSH into *this* server. You add them with `larakube cloud:configure users` (you won't hand-write these), and LaraKube creates the matching Linux user on the box and installs their public key. Each environment keeps its own list, so you can give a teammate access to staging but not production. Each entry has:
  - **`username`** / **`name`** — the login name to create and a human label.
  - **`groups`** / **`shell`** — the Linux groups (e.g. `sudo`) and login shell for that user.
  - **`state`** — `present` to ensure the user exists, or `absent` to remove them on the next sync.
  - **`authorized_keys`** — the public SSH keys allowed to log in as that user.

A fresh `cloud` block has no `teammates` until you add some — it's an optional list, so leaving it out (as the examples above do) is perfectly normal.

:::note Older projects
LaraKube used to store all of this in one top-level `cloud` block. If you have an older `.larakube.json`, LaraKube quietly moves it into each environment the next time it saves — you don't have to change anything.
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

- **`lockedFiles`** — Files that `larakube heal` will leave alone. Use this when you've hand-edited a generated file (like a custom `Dockerfile.php`) and don't want it overwritten. Add one with `larakube lock <path>`, remove with `larakube unlock <path>`.
- **`watchPaths`** — Folders `larakube watch` watches for changes to auto-reload your app during development. The defaults match a standard Laravel project; change them only if your project has an unusual layout.

## 🤖 System fields

A couple of fields you'll mostly leave alone but might spot when reading other projects' blueprints:

- **`isSystem`** — `true` only for LaraKube's own internal projects (like the Console). Always `false` for your apps.
- **`isScaffolding`** — A temporary flag that's only `true` while `larakube new` is setting a project up. It's stripped out when the file is saved, so you'll never see it in a committed `.larakube.json`.

## 🚦 Editing safely

If you hand-edit `.larakube.json`:

1. **Check it.** Run `larakube heal --force` — it complains loudly if something's malformed.
2. **Re-generate.** `larakube heal` rewrites everything under `.infrastructure/k8s/` to match. Your running app keeps running; the next `larakube up` catches it up.
3. **Commit the blueprint first.** The blueprint is the source of truth; the generated files just follow from it.

For most changes — adding a feature, switching the ingress, adding an environment — prefer the dedicated commands (`larakube add`, `larakube env`, `larakube cloud:configure`) over hand-editing. They validate things for you.

## 🧩 Advanced: managed Kubernetes {#advanced-managed-kubernetes}

> Skip this unless you're deploying to a **managed Kubernetes service** (AWS EKS, Google GKE, Azure AKS) instead of your own VPS. If you're on a regular server with Traefik or Nginx, you'll never need any of it.

Managed clusters sometimes need a few extra details that a plain VPS doesn't. Each environment optionally accepts:

- **`namespace`** — deploy into an existing cluster space instead of LaraKube's default `{name}-{environment}`.
- **`serviceAccount`** (and **`serviceAccountAnnotations`**) — run your app under a specific cluster identity, e.g. to give it cloud permissions.
- **`imagePullSecret`** / **`omitImagePullSecret`** — change or drop the credential used to pull your container image (some clusters pull images using the server's own cloud role, so no secret is needed).
- **`ingressAnnotations`** — extra settings passed straight through to your cloud's load balancer (for example, a TLS certificate ID or firewall group).

Every one of these is optional and defaults to the normal VPS behavior — they only do something when you set them. If any of the terms above are unfamiliar, that's a sign you don't need this section yet.

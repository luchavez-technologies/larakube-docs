---
sidebar_position: 1
---
# Core Lifecycle Commands

LaraKube provides a set of high-level commands to manage your application's lifecycle from initial creation to production deployment.

## `new {name}`
The starting point for every new masterpiece. LaraKube downloads a specialized installer image and scaffolds your entire Kubernetes environment in one go.

- **Fast Track:** Use `--fast` to skip the LaraKube wizard and use "ideal" high-performance defaults (MySQL, Redis, Reverb, etc.).
- **Passthrough:** Any extra native Laravel flags (e.g. `--react`, `--pest`) are automatically forwarded to the installer.
- **Architecture-by-Flag:** Providing any architectural flags will intelligently skip the wizard and use your selections.

### 🏗 Architectural Flags

| Category | Flags | Description |
| :--- | :--- | :--- |
| **Servers** | `--frankenphp`, `--nginx`, `--apache` | Choose your server foundation (FrankenPHP is recommended). |
| **Blueprints** | `--filament`, `--statamic` | Select a specialized foundation (Defaults to standard Laravel). |
| **Databases** | `--mysql`, `--postgres`, `--mariadb`, `--sqlite`, `--redis` | Define your persistence and caching layers. |
| **Storage** | `--minio`, `--seaweedfs`, `--garage` | Enable S3-compatible object storage. |
| **Features** | `--horizon`, `--reverb`, `--meilisearch`, `--typesense`, `--queue`, `--schedule`, `--mailpit` | Add specialized Laravel "Lego bricks" to your cluster. |

- **Example:** `larakube new my-app --frankenphp --mysql --redis --reverb --horizon`

---

## `init`
Already have a project? `init` gracefully prepares your existing Laravel application for its Kubernetes debut by generating all necessary manifests and Dockerfiles.

## `up {environment}`
The "Launch" button. 
- **Automated Workflow:** By default, LaraKube will automatically run migrations and perform a connectivity smoke test.
- **Automation Flags:** Use `--migrate`, `--no-test`, or `--no-dashboard` to skip interactive prompts in CI or automated scripts.
- **Deduplicated Manifests:** LaraKube uses a unique single-pass engine to ensure your Kubernetes resources are never registered twice.

## `status {environment}`
The "Health Check" button. Displays a professional, color-coded table of all services in your cluster.
- **Visual Feedback:** Shows 🟢 **Ready** for healthy services and 🔴 **Not Ready** for issues.
- **Metrics:** Quickly see container restarts and pod age to identify unstable services.

## `stop {environment}`
The "Safe Pause" button. Scales all application and database pods to 0.
- **Data Safety:** Your data remains perfectly safe in the cluster volumes (PVCs).
- **Stability:** Use this instead of `down` for daily development to avoid volume permission issues.
- **Quick Resume:** Use `larakube start` to bring your environment back to life in seconds.

## `start {environment}`
The "Resume" button. Scales your pods back to their original replica counts.
- **Instant Resume:** Your app and databases will pick up exactly where they left off.

---

## ⚠️ Destructive Commands
LaraKube includes professional safety gates for destructive actions. Unless you provide the `--force` flag, you will be required to type the **project name** to confirm.

## `down {environment}`
The "Cleanup" tool. Safely removes the environment namespace and its associated internal cluster volumes.
- **Safety Gate:** Requires typing the project name to confirm.
- **What stays:** Your local Docker images and project files remain intact.
- **When to use:** Use this when you are finished with a feature branch or project and want to free up cluster resources.

## `reset {environment}`
The "Factory Reset" tool. Forcefully wipes all cluster state, local volume data, and can optionally delete your Docker images.
- **Safety Gate:** Requires typing the project name to confirm.
- **Options:** Use `--image` to also delete the local Docker image from your machine.
- **When to use:** Use this as a last resort if your environment is corrupted or if you want an absolute fresh start.

---

## `deploy {environment}`
The "Remote Launch" button. Specifically for non-local environments (staging, production). 
- Checks your cluster context and builds production images.
- Injects environment-specific secrets.
- Applies production-hardened overlays.

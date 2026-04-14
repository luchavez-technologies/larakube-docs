---
sidebar_position: 2
---
# LaraKube Architecture & Best Practices Guide

LaraKube is an opinionated CLI for Laravel developers to manage Kubernetes environments from development to deployment, following a **Container-First** philosophy.

## 🚀 Core Philosophy: Zero-Host Dependency
LaraKube assumes the host machine (Mac/Linux) is "clean."
- **No Local PHP/Node:** All project creation, dependency installation, and asset building happen inside isolated Docker containers.
- **UID/GID Mapping:** To prevent permission issues, the CLI maps the host's User ID and Group ID into the containers so generated files are owned by the developer.
- **Service Isolation:** PHP and Node.js tasks are strictly separated. The PHP container handles Laravel/Composer, while a dedicated Node container handles Vite/NPM.

## 🛠 Command Reference

### `new {name}`
Creates a new Laravel project using the containerized installer.
- **Flow:** Pulls `serversideup/php` CLI image -> Runs `laravel new` -> Configures Dockerfiles -> Generates K8s Manifests -> Installs chosen features.
- **Validation:** Enforces dependencies (e.g., Horizon requires Redis; Octane requires FrankenPHP).

### `up {environment}`
Deploys the application.
- **Local:** Builds the local Docker image and applies the `local` Kustomize overlay. Mounts local code for instant updates (Live Mounting).
- **Production:** Applies the `production` overlay.
- **Features:** Automatically waits for pods to be ready and offers to run migrations inside the pod.

### `down {environment}`
Tears down the environment.
- **Safety:** Prompts for confirmation before deleting the entire namespace.
- **Cleanup:** Runs `kubectl delete namespace {app-name}-{env}` to ensure zero leftover resources.

### `exec "{command}"`
Runs any command inside the active PHP pod (e.g., `larakube exec "php artisan migrate"`).

### `node "{command}"`
Shortcut to run NPM/Yarn commands inside the dedicated local Node pod.

### `dashboard`
Opens the `k9s` visualization tool, automatically focused on the current project's namespace.

## 🏗 Kubernetes Strategy

### Kustomize Over Helm
We use Kustomize for its "Pure YAML" approach. 
- **Base:** Standard resources (Deployment, Service, PVC, ConfigMap, Secrets).
- **Overlays:** Environment-specific overrides.
- **Live Mounting:** Locally, we use `hostPath` volumes to mount the project folder into the pod for instant feedback.

### Namespace Management
Namespaces follow the pattern: `{slug-app-name}-{environment}`.
- This allows multiple versions of the same app (or different apps) to coexist on one cluster without naming conflicts.

### Image Pull Policy
In local environments, we use `imagePullPolicy: IfNotPresent`. This ensures Kubernetes uses the image built by the CLI instead of trying to pull a non-existent image from a remote registry.

## 🔐 Security & Persistence

### Database Hardening
- **Application Users:** Never use `root` or `superuser` for the application connection.
- **MySQL/MariaDB:** Creates a `laravel` user with scoped permissions.
- **PostgreSQL:** Uses the standard `postgres` user but with passwords managed via K8s Secrets.

### Secrets Management
- Sensitive data (DB passwords, App Keys, Meilisearch Master Keys) are stored in Kubernetes `Secret` resources, never in plain-text ConfigMaps.

## 📦 Deployment (Spin Style)
- **CI/CD:** Uses GitHub Actions to build multi-stage Docker images.
- **Registry:** Publishes images to GitHub Container Registry (GHCR).
- **Multi-Stage Build:** Production images are "self-contained"—the Node build happens in a temporary stage, and only the compiled assets are copied into the final PHP image.

## 🎨 Professional UI (LaraKubeOutput)
All commands must use the `LaraKubeOutput` trait to maintain brand consistency:
- `laraKubeInfo()`: High-contrast blue tag for status updates.
- `laraKubeError()`: High-contrast red tag for failures.

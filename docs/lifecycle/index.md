---
sidebar_position: 1
title: Project Lifecycle Commands
description: Master the LaraKube CLI lifecycle. Learn about scaffolding new projects (new), initializing existing apps (init), swapping components (swap), and uninstallation.
---
# Project Lifecycle

These are the fundamental commands for creating, preparing, and cleaning up LaraKube CLI projects.

:::info Transparency-by-Default
LaraKube CLI follows a **"Preview First"** philosophy. Commands in this section will always show you an **Architectural Preview** of the files and configurations they are about to modify before asking for your final confirmation.
:::

:::tip Nesting Protection
LaraKube CLI includes a built-in safety shield. If you try to run `new` or `init` inside an existing project, the CLI will stop and warn you about **accidental nesting**, requiring manual consent to proceed.
:::

## `new {name}`
The starting point for every new masterpiece. LaraKube CLI scaffolds your entire Kubernetes environment, Dockerfiles, and Laravel application in one go.

- **Fast Track:** Use `--fast` to skip the LaraKube CLI wizard and use "ideal" high-performance defaults.
- **Frontend Stacks:** Native support for your favorite stack. Use `--react`, `--vue`, `--livewire`, or `--svelte` to pre-configure your frontend.
- **Architecture-by-Flag:** Providing any architectural flags (e.g., `--frankenphp`, `--mysql`) will intelligently skip the wizard.
- **Preview Only:** Use `--dry-run` to see the generated DNA without touching your disk.

### 🎨 Frontend & Backend Passthrough
LaraKube CLI isn't just about Kubernetes. It acts as a professional wrapper for the native Laravel installer. Any flag supported by `laravel new` is automatically passed through:
- **Stacks:** `--react`, `--vue`, `--livewire`, `--svelte`
- **Testing:** `--pest`, `--phpunit`
- **Workspaces:** `--git`, `--dark`

---

## `init`
Already have a project? `init` gracefully prepares your existing Laravel application for its Kubernetes debut. 

- **Scaffolding**: Generates `.infrastructure/k8s` and `Dockerfile.php`.
- **Injection**: Offers to install required Laravel features (Horizon, Reverb, etc.).
- **Detection**: Automatically identifies your existing PHP and asset managers.

---

## `swap`
The "Pivot" tool. Seamlessly switch between different architectural components without manually removing and adding them. 

- **Atomic**: Automatically removes old manifests and generates new ones in a single pass.
- **Safety**: Provides an architectural preview and a **Data Migration Warning**.
- **Supported Categories**: Database Engines, Object Storage, Search Engines (Scout), and Server Variations.

```bash
# Non-interactive swap
larakube swap --db=PostgreSQL --storage=SeaweedFS

# Interactive wizard
larakube swap
```

---

## `uninstall`
The clean break. If you need to remove LaraKube CLI from a project, this command performs a total cleanup of local manifests and cluster resources.

- **Cluster Cleanup**: Automatically deletes ALL project namespaces (local, production, etc.).
- **File Cleanup**: Removes `.infrastructure/`, `.larakube.json`, and Dockerfiles.
- **Docker Cleanup**: Use the `--image` flag to also delete the local Docker image.
- **Safety**: 
  - Your Laravel source code, migrations, and `.env` files are **never touched**.
  - **Project Confirmation**: You must type the project name to confirm the uninstall.
- **Transparency**: Previews every file and cluster resource to be deleted before execution.

```bash
# Total cleanup including cluster resources
larakube uninstall

# Total cleanup including Docker image
larakube uninstall --image
```

---
sidebar_position: 4
---
# Command Reference

LaraKube provides a suite of commands to manage your project lifecycle entirely from the terminal.

## Core Commands

### `new {name}`
Creates a new project.
- Downloads the installer image.
- Runs `laravel new` inside a temporary container.
- Scaffolds all Kubernetes and Docker configuration.

### `init`
Initializes LaraKube in an **existing** Laravel project.
- Asks configuration questions.
- Generates the `.infrastructure` directory and root Dockerfiles.

### `up {environment}`
Deploys the application to the cluster.
- **Default:** `local`
- Builds local images (for `local` env).
- Manages `/etc/hosts` automatically.
- Restarts deployments to pick up `.env` changes.

### `down {environment}`
Tears down the specified environment.
- **Default:** `local`
- Prompts for confirmation.
- Deletes the entire Kubernetes namespace.

## Management Commands

### `add {feature}`
Plugs in a new Laravel feature (e.g., `horizon`, `reverb`, `scout`) to an existing project.
- Updates manifests, Docker Compose, and installs required packages.

### `env {name}`
Creates a new environment overlay (e.g., `staging`, `qa`).
- Scaffolds from the production base.
- Configures environment-specific namespaces.

### `exec "{command}"`
Runs a command inside the active PHP pod.
```bash
larakube exec "php artisan migrate"
```

### `node "{command}"`
Runs a Node/NPM command inside the local Node pod.
```bash
larakube node "npm install some-package"
```

### `logs {service}`
Tails logs for a specific service (`web`, `node`, `horizon`, `reverb`, or `traefik`).

### `hosts`
Checks and updates your local `/etc/hosts` file.

### `dashboard`
Launches the `k9s` dashboard, automatically focused on your project's namespace.

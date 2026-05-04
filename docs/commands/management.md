---
sidebar_position: 2
title: Management Tools
description: Discover the LaraKube CLI management tools for adding features, self-healing infrastructure, and sharing live previews of your Laravel cluster.
---
# Management Tools

Evolve your infrastructure and manage your services with these specialized operational commands.

:::info Transparency-by-Default
Just like the [Deployment Operations](./operations), the `add` command will always show you an **Architectural Preview** of the manifests and packages about to be added to your project before asking for confirmation.
:::

## `add {items}`
The "Evolution" tool. Use `add` to plug in new features (like Reverb), database engines (like MariaDB), architectural blueprints (like Statamic), or object storage (like MinIO) to your project anytime.
- **Multiple Items**: You can provide multiple items as arguments or use the interactive multiselect prompt.
- **Transparency**: Always shows a preview of what will be added before applying changes.
- **Dry Run**: Use `--dry-run` to preview the addition without changing your repository.
- **Database Switching**: Automatically offers to update your `.env` when adding a new database.
- **Duplicate Protection**: LaraKube intelligently skips anything already installed in your project.

## `heal`
The "Self-Healing" tool. Regenerates your entire Kubernetes manifest and patch structure from your project's architectural DNA (`.larakube.json`).

-   **Regeneration**: Surgically updates all base manifests and environment-specific overlays.
-   **Stability**: Use this to apply the latest LaraKube stability standards to an existing project.
-   **Surgical HTTPS**: Automatically injects HTTPS compatibility (like `URL::forceScheme`) into your application logic.
-   **Safety**: Displays an Architectural Preview of affected files and requires project name confirmation.
-   **Cluster Resilience**: LaraKube automatically backs up your blueprint to your cluster. If your local `.larakube.json` is missing or corrupted, `heal` will offer to restore it directly from the cluster.
-   **Example**: `larakube heal`

## `share`
The "Live Preview" tool. Instantly expose your local project to the internet via a secure Cloudflare Tunnel.
- **Usage:** `larakube share`
- **Automation:** LaraKube deploys an ephemeral `cloudflared` pod and extracts your temporary `*.trycloudflare.com` URL.
- **Cleanup:** Run `larakube share --stop` or press Ctrl+C to terminate the tunnel.
- **Note:** Only available in the `local` environment.

## `cluster:install`
The "Quick Cluster" tool. Automated setup of a local Kubernetes cluster.
- **k3d (Recommended):** Creates a lightweight k3s cluster inside Docker.
- **Features:** Auto-configures Docker bridge networking and prepares the cluster for LaraKube's Ingress stack.
- **Usage:** `larakube cluster:install`

## `status {environment}`
The "Health Check" tool. Displays a professional, color-coded table of all services in your cluster.
- **Visual Feedback**: Shows 🟢 **Ready** for healthy services and 🔴 **Not Ready** for issues.
- **Metrics**: Quickly see container restarts and pod age to identify unstable services.

## `logs {service}`
The "Observer" tool. Tail the logs of any service to see exactly what's happening.

-   **Multi-Service**: Tail multiple services simultaneously by using a comma-separated list.
    *   `larakube logs web,reverb`
-   **Tail Everything**: Use the `--all` flag to see a unified, color-coded stream of every container in your cluster.
    *   `larakube logs --all`
-   **Context**: Combined streams automatically include container prefixes so you can identify the source of each log line.

## `project:list`
The "Dashboard" tool. Displays a professional table of every LaraKube CLI project tracked on your machine.
- **Insights**: Shows project names, blueprints, absolute paths, and the last time they were updated.
- **Auto-Sync**: Projects are automatically added during `new`/`init` and removed during `purge`.

## `project:activity {name?}`
The "Audit Trail" tool. View a detailed history of every architectural and operational event for a project.
- **Traceability**: See when features were added, databases swapped, or cluster deployments (`up`) occurred.
- **Details**: Includes specific properties of each change (e.g., which database engine was switched).

## `init`
The "Adoption" tool. Initializes LaraKube in an existing Laravel project.

-   **Existing Projects**: Scans your current `.env` and `composer.json` to suggest a matching LaraKube architecture.
-   **Clean Slate**: If run in a project already containing LaraKube, it will recommend running `purge` first to ensure a clean re-initialization.
-   **Infrastructure-Only**: Focuses on generating the `.infrastructure` directory and Dockerfiles for your specific project needs.

## `swap {--db|--storage|--server|--scout}`
The "Architectural Pivot" tool. Seamlessly swap core components of your infrastructure without starting over.

-   **Hot-Swapping**: Switch from MySQL to PostgreSQL or MinIO to Garage with a single command.
-   **Safe Mutation**: Updates your `.larakube.json`, regenerates manifests, and offers to update your `.env` connection keys.
-   **Example**: `larakube swap --postgres` or `larakube swap --garage`.
-   **Warning**: Swaps are infrastructure-only; you are responsible for migrating any existing data between engines.

## `chat`
The "Interactive Architect." Opens a natural language chat session with your cluster.

-   **Conversational Control**: Ask questions like "Why is my worker pod failing?" or "Scale the web deployment to 3 replicas."
-   **Context-Aware**: The chat assistant has full access to your pod logs, events, and manifests to provide accurate diagnosis and execution.

## `doctor {--environment}`
The "Infrastructure Consultant." Scans your project and cluster for common issues and provides human-friendly fixes.
-   **Checks**: `.env` health, manifest integrity, `/etc/hosts` resolution, port conflicts (80/443), cluster connectivity, and pod failures.
-   **Translations**: Automatically translates cryptic errors like `CreateContainerConfigError` into plain English.
-   **Example**: `larakube doctor`

## `php:ext {extension}`
The "Chemist" tool. Easily add PHP extensions (like `gd` or `bcmath`) to your project without touching a Dockerfile.

## `tunnel {service}`
The "Tunnel" tool. Creates a secure port-forwarding tunnel to your cluster's database services and automatically resolves local port conflicts.

## `exec {command}`
The "Remote Artisan" tool. Run any command directly inside your running Kubernetes pod. No quotes required!
- **Example**: `larakube exec ls -la`

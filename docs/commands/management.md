---
sidebar_position: 2
---
# Management Tools

Evolve your infrastructure and manage your services with these specialized operational commands.

## `heal`
The "Self-Healing" tool. Regenerates your entire Kubernetes manifest and patch structure from your project's architectural DNA (`.larakube.json`).

-   **Regeneration**: Surgically updates all base manifests and environment-specific overlays.
-   **Stability**: Use this to apply the latest LaraKube stability standards to an existing project.
-   **Cluster Resilience**: LaraKube automatically backs up your blueprint to your cluster. If your local `.larakube.json` is missing or corrupted, `heal` will offer to restore it directly from the cluster.
-   **Example**: `larakube heal`

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

## `add {items}`
The "Evolution" tool. Use `add` to plug in new features (like Reverb), database engines (like MariaDB), architectural blueprints (like Statamic), or object storage (like MinIO) to your project anytime.
- **Multiple Items**: You can provide multiple items as arguments or use the interactive multiselect prompt.
- **Database Switching**: Automatically offers to update your `.env` when adding a new database.
- **Duplicate Protection**: LaraKube intelligently skips anything already installed in your project.

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

## `art {artisan-command}`
A convenient shortcut for `exec php artisan ...`. Run any Laravel artisan command without the extra typing.
- **Example**: `larakube art migrate`

## `npm {npm-command}`, `pnpm`, `bun`, `yarn`
Direct shortcuts to run your favorite package manager commands inside the cluster Node pod.

## `dashboard`
The "Command Center." Launches your choice of visualization tools to monitor pods and logs.
-   **K9s Mode**: If installed, launches a full-screen interactive dashboard.
-   **Simple View**: Automatically falls back to a live `kubectl` pod list if K9s is missing.
-   **💡 Pro-Tip**: For the best, flicker-free experience, install these tools:
    -   **macOS**: `brew install k9s watch`
    -   **Linux**: `snap install k9s` and `sudo apt install watch`.

---
sidebar_position: 2
title: Management Tools
description: Discover the LaraKube CLI management tools for adding features, self-healing infrastructure, and accessing the visual Console.
---
# Management Tools

Evolve your infrastructure and manage your services with these specialized operational commands.

:::info Transparency-by-Default
Just like the [Deployment Operations](./operations), the `add` command will always show you an **Architectural Preview** of the manifests and packages about to be added to your project before asking for confirmation.
:::

## `add {items}`
The "Evolution" tool. Use `add` to plug in new features (like Reverb), database engines (like MariaDB), architectural blueprints (like Statamic), or object storage (like MinIO) to your project anytime.

- **Conflict Detection:** LaraKube automatically detects if you are adding a component that conflicts with your primary setup (e.g., adding Postgres while MySQL is active).
- **Intelligent Swapping:** If a conflict is found, it will ask if you'd like to **swap** the primary connection or add the new service as an additional instance.
- **Data Migration Mode:** Offers to comment out new `.env` variables so you can migrate your data before finalizing the switch.
- **Dependency Resolution:** Automatically adds required services (e.g., adding Horizon will automatically suggest adding Redis).

## `console`
The "Command Center" tool. Launches the **LaraKube Console**, your visual command center.
- **Shortcut:** `larakube web`
- **Management:** Provides a GUI for creating projects, monitoring fleet health, and streaming live logs.
- **CLI Fallback:** If you prefer the terminal, you can choose to launch **K9s** for real-time pod management instead.

## `status {environment}`
The "Health Check" tool. Displays a professional, color-coded table of all services in your cluster.
- **Watch Mode:** Use `larakube status --watch` for a real-time, auto-refreshing view of your pods.
- **Visual Feedback**: Shows 🟢 **Ready** for healthy services and 🔴 **Not Ready** for issues.

## `heal`
The "Self-Healing" tool. Regenerates your entire Kubernetes manifest and patch structure from your project's architectural DNA (`.larakube.json`).
- **Stability**: Use this to apply the latest LaraKube architectural standards to an existing project.
- **Cluster Resilience**: LaraKube automatically backs up your blueprint to your cluster. If your local `.larakube.json` is missing or corrupted, `heal` will restore it directly from the cluster.

## `init`
The "Adoption" tool. Initializes LaraKube in an existing Laravel project.
- **Existing Projects**: Scans your current `.env` and `composer.json` to suggest a matching LaraKube architecture.
- **Console Registration:** Automatically registers the project with your LaraKube Console for visual management.

## `doctor {--environment}`
The "Infrastructure Consultant." Scans your project and cluster for common issues and provides human-friendly fixes.
- **Checks**: `.env` health, manifest integrity, `/etc/hosts` resolution, cluster connectivity, and pod failures.
- **Console Sync:** Sends a full diagnostic report to your LaraKube Console for detailed history and AI-powered fixes.

## `logs {service}`
The "Observer" tool. Tail the logs of any service to see exactly what's happening.
- **Multi-Service**: Tail multiple services simultaneously by using a comma-separated list: `larakube logs web,horizon`.
- **Tail Everything**: Use the `--all` flag to see a unified, color-coded stream of every container in your cluster.

## `share`
The "Live Preview" tool. Instantly expose your local project to the internet via a secure Cloudflare Tunnel.
- **Note:** Only available in the `local` environment.

## `php:ext {extension}`
The "Chemist" tool. Easily add PHP extensions (like `gd` or `bcmath`) to your project without touching a Dockerfile.

## `exec {command}`
The "Remote Artisan" tool. Run any command directly inside your running Kubernetes pod. No quotes required!
- **Example**: `larakube exec ls -la`

## `tunnel {service}`
The "Tunnel" tool. Creates a secure port-forwarding tunnel to your cluster's database services.

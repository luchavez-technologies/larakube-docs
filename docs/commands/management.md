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

## `new {name}`
The "Scaffolding" tool. Creates a brand-new Laravel application with a custom Kubernetes architecture baked in from day one.
- **Wizard or Flags**: Run interactively or skip prompts with flags like `--react`, `--mysql`, `--horizon`, `--frankenphp`, `--reverb`, `--phpunit`.
- **Lifecycle Battle Test**: `larakube new lifecycle-test --fast --react --phpunit` is the canonical sequence used in CI for validating LaraKube CLI itself end-to-end.

## `kustomize {environment?}`
The "Manifest Preview." Renders and prints the final, merged Kubernetes manifests for a given environment — exactly what would be `kubectl apply`'d by `up` / `heal` / `cloud:deploy`.
- **Use Cases**: Debugging overlay merges, reviewing what production will receive before `cloud:deploy`, copy-pasting into a third-party Kustomize/Argo CD pipeline.
- **Default**: Targets the `local` environment if no argument is provided.

## `k9s`
The "Terminal Dashboard." Launches the [K9s](https://k9scli.io/) terminal UI pre-scoped to your project's namespace — instant pod-level visibility.
- **Requires**: K9s installed locally (`brew install k9s` on macOS).
- **Companion to `larakube console`**: K9s for terminal power-users; `console` (a.k.a. `web`) for the GUI.

## `add {items}`
The "Evolution" tool. Use `add` to plug in new features (like Reverb), database engines (like MariaDB), architectural blueprints (like Statamic), or object storage (like MinIO) to your project anytime.

- **Conflict Detection:** LaraKube CLI automatically detects if you are adding a component that conflicts with your primary setup (e.g., adding Postgres while MySQL is active).
- **Intelligent Swapping:** If a conflict is found, it will ask if you'd like to **swap** the primary connection or add the new service as an additional instance.
- **Data Migration Mode:** Offers to comment out new `.env` variables so you can migrate your data before finalizing the switch.
- **Dependency Resolution:** Automatically adds required services (e.g., adding Horizon will automatically suggest adding Redis).

## `web`
The "Command Center" tool. Opens the **LaraKube Console**, your visual command center.
- **Alias:** `larakube console`
- **Management:** Provides a GUI for monitoring fleet health, and streaming live logs.
- **Cleanup**: Use `larakube web --down` to remove the LaraKube Console from the cluster.

## `about {environment}`
The "Health Check" tool. Display a unified architectural and health overview of the project.
- **Visual Feedback**: Shows 🟢 **Ready** for healthy services and 🔴 **Not Ready** for issues.
- **Default**: Targets the `local` environment if no argument is provided.

## `heal`
The "Self-Healing" tool. Regenerates your entire Kubernetes manifest and patch structure from your project's architectural DNA (`.larakube.json`).
- **Stability**: Use this to apply the latest LaraKube CLI architectural standards to an existing project.
- **Cluster Resilience**: LaraKube CLI automatically backs up your blueprint to your cluster. If your local `.larakube.json` is missing or corrupted, `heal` will restore it directly from the cluster.
- **Hand-Edit Safety**: Edit the blueprint, not the manifest! If you hand-edit a generated manifest in `.infrastructure/k8s`, `heal` will detect the divergence, warn you, and preserve your changes. To permanently lock a file from regeneration, add it to the `locked_manifests` array in your blueprint.

## `resources {environment}` {#resources}
The "Limits Manager." Interactively configures Kubernetes CPU and memory requests and limits for your application pods.
- **Guided Configuration**: Prompts you for k8s-valid quantities (e.g., `100m`, `512Mi`) and saves them to your `.larakube.json` blueprint.
- **Per-Component Overrides**: Set a baseline for `default` (all app pods), or specify precise overrides for roles like `horizon` and `ssr`.
- **Drift Protection**: Redundant overrides that match the inherited defaults are automatically pruned to keep your blueprint clean.

## `init`
The "Adoption" tool. Initializes LaraKube CLI for an existing Laravel project.
- **Existing Projects**: Scans your current `.env` and `composer.json` to suggest a matching LaraKube CLI architecture.
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

## `ext:add {extension}`
The "Chemist" tool. Easily add PHP extensions (like `gd` or `bcmath`) to your project without touching a Dockerfile.

## `ext:remove {extension}`
The "Extension Remover." Remove a PHP extension from your project.

## `exec {command}`
The "Remote Command" tool. Run any command directly inside your running Kubernetes pod. No quotes required!
- **Example**: `larakube exec ls -la`

## `tunnel {service}`
The "Tunnel" tool. Creates a secure port-forwarding tunnel to your cluster's database services.

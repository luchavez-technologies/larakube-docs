---
sidebar_position: 1
title: Deployment Operations
description: Master the core LaraKube CLI deployment operations. Learn how to launch (up), pause (stop), and cleanup (down) your Laravel Kubernetes environment.
---
# Deployment Operations

These commands manage the active state of your application within the Kubernetes cluster.

## `up {environment}`
The "Launch" button. Deploys your infrastructure and application to the cluster.
- **Automated Workflow:** Automatically runs migrations and performs a connectivity smoke test.
- **Validation:** Use `--dry-run` to perform a full architectural validation of your manifests before deploying.
- **Deduplicated Manifests:** LaraKube uses a unique single-pass engine to ensure your Kubernetes resources are never registered twice.

## `build`
The "Image Builder." Rebuild the local Docker image for the project and re-import it into the local k3d cluster.
- **Use Cases**: After a `Dockerfile.php` change, or to refresh a stale local image without a full `up`.
- **Automatic Sideload**: Images are automatically imported into the k3d cluster via `k3d image import`.

:::info Looking for `deploy`?
Production deployments are now under the [`cloud:*` namespace](./cloud) — use `larakube cloud:deploy {environment}`. The flat `larakube deploy` was renamed in v0.3.0 to consolidate all cloud-related commands.
:::

## `env {name}`
The "Workspace" tool. Create a new Kubernetes environment overlay (e.g., `staging`, `production`).
- **Isolation**: Each environment gets its own namespace and dedicated resources.
- **Blueprint Inheritance**: Inherits your base architectural DNA while allowing environment-specific overrides.

## `smoke {environment}`
The "Smoke Test" tool. Performs a connectivity smoke test to ensure the application is reachable and responding correctly.
- **Automatic Execution**: Usually run automatically after `up`, but can be called manually for verification.
- **Default**: Targets the `local` environment if no argument is provided.

:::note Renamed in v0.3.0
This was previously `larakube test`. The new `larakube test` is a [phpunit/pest runner](./development#test) — separate, dedicated command. Scripts that called the old name should switch to `larakube smoke`.
:::

## `about {environment}`
The "Health Check" button. Display a unified architectural and health overview of the project.
- **Visual Feedback:** Shows 🟢 **Ready** for healthy services and 🔴 **Not Ready** for issues.
- **Metrics:** Quickly see container restarts and pod age to identify unstable services.
- **Default**: Targets the `local` environment if no argument is provided.

## `stop {environment}`
The "Safe Pause" button. Scales all application and database pods to 0.
- **Data Safety:** Your data remains perfectly safe in the cluster volumes (PVCs).
- **Stability:** Use this instead of `down` for daily development to avoid volume permission issues.
- **Quick Resume:** Use `larakube start` to bring your environment back to life in seconds.

## `start {environment}`
The "Resume" button. Scales your pods back to their original replica counts.

## `down {environment}`
The "Cleanup" button. Removes your application's resources and internal volumes from the cluster.
- **Safety Preview**: Use `--dry-run` to see which resources will be deleted before they are removed.
- **Confirmation**: Requires you to type the project name to confirm the deletion.
- **Force Mode**: Use `--force` to skip the manual confirmation.

## `purge {environment}`
The "Nuclear Cleanup." Completely removes LaraKube manifests AND all cluster resources for the project, including database PVCs.
- **More destructive than `down`**: `down` removes app/internal volumes but `purge` also wipes persistent data (databases, storage volumes).
- **Use when**: Starting completely fresh, or when `reset` of the project's blueprint is also planned.
- **Confirmation**: Requires explicit project-name confirmation.

## `reset`
The "Hard Reset." Remove all LaraKube DNA and manifests from the project.
- **Action**: Deletes `.larakube.json`, `.infrastructure`, and other LaraKube-generated files.
- **Destructive**: This is a destructive action that wipes the project's Kubernetes configuration.
- **Force Mode**: Use `--force` to skip confirmation.

## `purge`
The "Total Project Cleanup." Completely remove LaraKube manifests and cluster resources from this project.
- **Action**: Deletes cluster resources (Namespaces, PersistentVolumes) and local files (`.infrastructure`, `.larakube.json`, Dockerfiles).
- **Preservation**: Your actual Laravel source code and database data (in `volume_data`) remain safe.
- **Best Practice**: Use `purge` followed by `init` if you want to re-architect a project from a clean slate.

## `uninstall`
The "System Cleanup." Remove the LaraKube CLI application from your system.
- **Action**: Deletes the `larakube` binary from your system path.
- **Recommendation**: Run `untrust` first to clean up the SSL root CA from your system trust store.

# GitHub Actions

LaraKube provides built-in tools to manage your CI/CD workflows directly from the CLI.

## `gha:configure {environment}`
The "CI Architect." Configure GitHub Actions secrets and workflows for a specific environment using the native GitHub CLI container.

## `gha:login`
The "CI Authenticator." Authenticate with GitHub using the official CLI.

## `gha:switch`
The "Context Switcher." Switch between different GitHub accounts.

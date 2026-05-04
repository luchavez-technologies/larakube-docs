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

## `down {environment}`
The "Cleanup" button. Removes your application's namespace and all internal volumes.
- **Safety Preview**: Use `--dry-run` to see which resources will be deleted before they are removed.
- **Confirmation**: Requires you to type the project name to confirm the deletion.
- **Force Mode**: Use `--force` to skip the manual confirmation.

## `purge`
The "Total Project Cleanup." Completely remove LaraKube manifests and cluster resources from this project.
- **Action**: Deletes cluster resources (Namespaces, PersistentVolumes) and local files (`.infrastructure`, `.larakube.json`, Dockerfiles).
- **Preservation**: Your actual Laravel source code and database data (in `volume_data`) remain safe.
- **Best Practice**: Use `purge` followed by `init` if you want to re-architect a project from a clean slate.

## `uninstall`
The "System Cleanup." Remove the LaraKube CLI application from your system.
- **Action**: Deletes the `larakube` binary from your system path (e.g., `/usr/local/bin/larakube`).
- **Recommendation**: Run `untrust` first to clean up the SSL root CA from your system trust store.

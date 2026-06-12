---
sidebar_position: 3
title: Traefik Networking & SSL
description: Manage your cluster's networking stack with Traefik commands. Learn how to setup Ingress, provision wildcard SSLs, and monitor real-time traffic.
---
# Networking & Traefik

Traefik acts as the "Front Desk" for your entire LaraKube ecosystem. Because it is a cluster-wide service, it has its own dedicated suite of commands to manage SSL, routing, and troubleshooting.

## `traefik:setup`
The "Receptionist Installer." Install or upgrade the Traefik Ingress Controller and its cluster-scoped permissions.
- **Idempotent**: Safe to run multiple times.
- **SSL Configuration**: Automatically provisions wildcard certificates for your `.kube` domains.
- **Usage**: `larakube traefik:setup`

## `traefik:dashboard`
The "Network UI." LaraKube provides a dedicated dashboard for Traefik to monitor all ingress traffic and routing rules.

- **Preferred Access**: Visits **`https://traefik.kube`**
- **Why it's better**: Unlike temporary port-forwarding or tunneling, the `traefik.kube` domain provides a persistent, cluster-wide address that is automatically secured with valid SSL. It gives you a complete view of how Traefik is routing traffic across all your projects, not just the current one.

## `traefik:logs`
The "Traffic Monitor." Tails the logs specifically for the Traefik Ingress Controller.
- **Usage**: `larakube traefik:logs`

## `traefik:restart`
The "Soft Reset." Forces a graceful rollout restart of the Traefik pods without deleting the namespace or configuration.
- **Usage**: `larakube traefik:restart`

## `traefik:destroy`
The "Total Cleanup." Completely removes the Traefik Ingress Controller and its cluster-scoped permissions.
- **Safety**: Requires confirmation unless the `--force` flag is used.
- **Usage**: `larakube traefik:destroy`

## `hosts`
The "Domain Sync." Manages `/etc/hosts` entries for your project's `.kube` domains. Run after `up` if your browser can't resolve a project URL.
- **Idempotent**: Safe to run multiple times; existing entries are reused.
- **Mac/Windows**: Maps your project domains to `127.0.0.1` for local Docker Desktop / OrbStack setups.
- **Linux**: Maps to the cluster LoadBalancer IP (MetalLB or k3d's built-in).
- **Sudo**: Prompts for elevation since `/etc/hosts` is a protected file.

## `trust`
The "Authority Installer." Installs the LaraKube Local CA into your system's trust store.
- **Support**: Works natively on **macOS**, **Linux**, and **Windows WSL2**.
- **Confidence**: Enabling this gives you the "Green Lock" (valid HTTPS) for all your `.kube` sites.
- **Fallback**: Automatically detects if the CA has expired and offers to download the latest version from Server Side Up.

## `trust:check`
The "Trust Diagnostics." Diagnoses the local HTTPS trust chain end-to-end.
- **What it checks**: CA files present in `~/.larakube/certificates/`, CA trusted in the system keychain, DNS resolving for `.kube` domains, system cert validity, and per-app cert validity.
- **Exit code**: Returns exit code `1` if any issues are found, making it safe to use in scripts.
- **Usage**: `larakube trust:check`

:::tip First diagnostic to run
If any `.kube` domain shows a browser security warning or an HTTPS error, run `larakube trust:check` first. It pinpoints exactly which part of the chain is broken before you try anything else.
:::

## `trust:reset`
The "CA Regenerator." Destroys and regenerates the local Certificate Authority.
- **When to use**: When the CA has become invalid, expired, or corrupted beyond what `trust` can fix.
- **Confirmation**: Asks you to type `reset` to confirm, or use the `--force` flag to skip.
- **Per-app certs**: All per-app certificates regenerate automatically on the next `larakube up`.
- **Usage**: `larakube trust:reset` (or `larakube trust:reset --force`)

## `trust:remove`
The "Authority Remover." Removes the LaraKube Local CA from your system's trust store.
- **Precision**: Uses unique SHA-1 fingerprints (macOS) or file paths (Linux/Windows) to ensure a clean removal.
- **Usage**: `larakube trust:remove`

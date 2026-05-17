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
- **SSL Configuration**: Automatically provisions wildcard certificates for your `.dev.test` domains.
- **Usage**: `larakube traefik:setup`

## `traefik:dashboard`
The "Network UI." LaraKube provides a dedicated dashboard for Traefik to monitor all ingress traffic and routing rules.

- **Preferred Access**: Visits **`https://traefik.dev.test`**
- **Why it's better**: Unlike temporary port-forwarding or tunneling, the `traefik.dev.test` domain provides a persistent, cluster-wide address that is automatically secured with valid SSL. It gives you a complete view of how Traefik is routing traffic across all your projects, not just the current one.

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

## `trust`
The "Authority Installer." Installs the LaraKube Local CA into your system's trust store.
- **Support**: Works natively on **macOS**, **Linux**, and **Windows WSL2**.
- **Confidence**: Enabling this gives you the "Green Lock" (valid HTTPS) for all your `.dev.test` sites.
- **Fallback**: Automatically detects if the CA has expired and offers to download the latest version from Server Side Up.

## `untrust`
The "Authority Remover." Removes the LaraKube Local CA from your system's trust store.
- **Precision**: Uses unique SHA-1 fingerprints (macOS) or file paths (Linux/Windows) to ensure a clean removal.
- **Usage**: `larakube untrust`

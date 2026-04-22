---
sidebar_position: 3
title: Traefik Networking & SSL
description: Manage your cluster's networking stack with Traefik commands. Learn how to setup Ingress, provision wildcard SSLs, and monitor real-time traffic.
---
# Networking & Traefik

Traefik acts as the "Front Desk" for your entire LaraKube ecosystem. Because it is a cluster-wide service, it has its own dedicated suite of commands to manage SSL, routing, and troubleshooting.

## `traefik:setup`
The "Receptionist Installer." Installs or upgrades the Traefik Ingress Controller.
- **Idempotent**: Safe to run multiple times.
- **SSL Configuration**: Automatically provisions wildcard certificates for your `.dev.test` domains.
- **Usage**: `larakube traefik:setup`

## `traefik:dashboard`
The "Network UI." Opens a secure tunnel to the Traefik web dashboard.
- **Visualization**: See all HTTP/HTTPS routes, middlewares, and backend health statuses.
- **Usage**: `larakube traefik:dashboard`
- **Access**: Visits `http://localhost:8080/dashboard/`

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

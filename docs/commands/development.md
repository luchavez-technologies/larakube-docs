---
sidebar_position: 4
title: Development Tools
description: Access your containers with interactive shells, run Artisan commands remotely, and manage frontend dependencies with LaraKube's development suite.
---
# Development Tools

These commands bridge the gap between your local host machine and the professional containers running inside your cluster.

## `shell {service?}`
The "Remote Terminal." Opens a secure, interactive shell directly inside a running pod.

- **Interactive Menu**: Run `larakube shell` without arguments to see a menu of all active services in your project.
- **Service Mapping**: Automatically maps your architecture (e.g., `web`, `reverb`, `horizon`, `mysql`) to the correct pod and container.
- **Rich Interface**: Prioritizes `bash` for a full terminal experience, falling back to `sh` for minimal images.

## `art {command*}`
The "Remote Artisan." Run any Laravel Artisan command directly in your cluster. No setup or tunnel required.

- **Usage**: `larakube art migrate`
- **Tinker Support**: Supports interactive commands like `larakube art tinker`.
- **Automatic Context**: Automatically targets your `local` environment by default.

## `exec {service} {command*}`
The "Remote Command." Run a one-off command inside a specific pod.

- **Direct Action**: Perfect for running DB dumps, checking files, or verifying configurations.
- **Example**: `larakube exec --service=mysql "mysql -u root -p"`

## `node {command*}`, `npm`, `yarn`, `pnpm`, `bun`
The "Frontend Bridge." Manage your frontend assets without having Node.js installed on your host.

- **Zero-Host**: All commands run inside the `laravel-node` container.
- **Usage**: `larakube npm install`, `larakube bun run build`.
- **Persistence**: Installs are persisted to your project's node_modules via volume mounts.

## `php {command*}`
The "Remote PHP." Execute PHP scripts or check your environment directly in the web container.

- **Example**: `larakube php -v`, `larakube php script.php`.

## `env:sync`
The "Configuration Mirror." Synchronizes your local `.env` file with the Kubernetes `laravel-secrets` and `laravel-config`.

- **Live Updates**: Use this to push small configuration changes without running a full `up`.
- **Safety**: Always prompts before overwriting secrets.

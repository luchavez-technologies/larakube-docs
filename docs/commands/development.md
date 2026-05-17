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
- **Automatic Context**: Automatically targets your `local` environment by default.

## `tinker`
The "Interactive Lab." Interact with your application via an interactive shell. This is a convenient shortcut to `larakube art tinker`.

:::tip High-Fidelity Forwarding
Proxy commands like `art`, `php`, and `npm` feature **Transparent Flag Capture**. This means you can pass flags (e.g., `larakube art migrate --force` or `larakube php -i`) and they will be forwarded exactly as-is to the container.
:::

## `exec {command*}`
The "Remote Command." Run a one-off command inside a running pod.

- **Direct Action**: Perfect for running DB dumps, checking files, or verifying configurations.
- **Usage**: `larakube exec ls -la`

## `node {command*}`, `npm`, `yarn`, `pnpm`, `bun`
The "Frontend Bridge." Manage your frontend assets without having Node.js installed on your host.

- **Zero-Host**: All commands run inside the `laravel-node` container.
- **Usage**: `larakube npm install`, `larakube bun run build`.
- **Persistence**: Installs are persisted to your project's `node_modules` via volume mounts.

## `php {command*}`
The "Remote PHP." Execute PHP scripts or check your environment directly in the web container.

- **Example**: `larakube php -v`, `larakube php script.php`.

## MCP (Model Context Protocol)

LaraKube supports the Model Context Protocol to provide AI tools with deep knowledge of your project.

### `mcp:register`
The "AI Connector." Register the LaraKube CLI MCP server with AI tools like Gemini or Claude.
- **Options**:
    - `--gemini`: Register with Gemini CLI.
    - `--claude`: Register with Claude Desktop.
    - `--all`: Register with all supported AI tools.

### `mcp:inspector`
The "MCP Debugger." Open the MCP Inspector tool to debug and test MCP Servers.

### `mcp:start`
The "MCP Engine." Start the MCP Server for a given handle.

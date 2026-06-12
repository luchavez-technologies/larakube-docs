---
sidebar_position: 4
title: Development Tools
description: Access your containers with interactive shells, run Artisan commands remotely, and manage frontend dependencies with LaraKube CLI's development suite.
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
Proxy commands (`art`, `php`, `exec`, `composer`, `npm`, `node`, `yarn`, `pnpm`, `bun`) feature **Transparent Flag Capture**. Pass any flag — including `--help`, complex args like `tinker --execute='echo \App\Models\User::count();'`, or unusual shell metacharacters — and it's forwarded exactly as-is to the container. `larakube art migrate --help` now shows artisan's migrate help, not LaraKube CLI's.
:::

## `test`
The "Test Runner." Run phpunit/pest inside the web pod safely. **This is the recommended way to run tests** under LaraKube CLI.

- **Safe by default**: Tests run against in-memory SQLite regardless of the project's actual DB driver. `RefreshDatabase` can't touch your dev data.
- **`--db` flag**: Provisions and runs against `<app>_testing` on the project's real DB engine. Idempotent — re-running is a no-op when the test DB already exists. Auto-persists `"provisionTestDb": true` to `.larakube.json` on first use, so future runs are flag-free.
- **Driver coverage**: MySQL, MariaDB, PostgreSQL are auto-provisioned for `--db`. SQLite and MongoDB fall back to in-memory SQLite with an informative notice.
- **Native feel**: All phpunit/pest flags pass through (`--filter`, `--testsuite`, `--coverage`, `--parallel`, etc.).
- **Auto-delegation**: `larakube art test`, `larakube php artisan test`, `larakube php vendor/bin/pest`, `larakube exec vendor/bin/phpunit` all route through this command's safe flow — users who instinctively reach for those forms get the same protection.

:::warning Why the safety net matters
LaraKube CLI pods inject DB credentials (`DB_CONNECTION`, `DB_DATABASE`, etc.) via ConfigMap at container start. PHP reads those before consulting `phpunit.xml`, so `phpunit.xml`'s `<env>` blocks are silently ignored — and any test using `RefreshDatabase` would wipe your dev database. `larakube test` strips those env vars before invoking phpunit, restoring `phpunit.xml`'s authority and adding safe SQLite defaults.
:::

## `reload`
The "Worker Recycle" tool. Recycle long-running PHP processes (Octane workers, Horizon, queue workers) to pick up code changes — without restarting the pod.

- **Octane (FrankenPHP)** → `php artisan octane:reload` (instant, no socket drop).
- **Horizon** → `php artisan horizon:terminate` (graceful drain; current jobs finish).
- **Queues** → `php artisan queue:restart` (graceful drain).
- **Service discovery**: Iterates the `features` array in your `.larakube.json` — only reloads what's actually enabled.

## `watch`
The "File Watcher." Polls the project directory and triggers `larakube reload` when files change. Pure PHP, no `fswatch`/inotify dependency.

- **Watch paths**: Configurable via the `watchPaths` field in `.larakube.json` (defaults to `app`, `bootstrap`, `config`, `database`, `public`, `resources`, `routes`, `composer.lock`, `.env`).
- **Interval**: Defaults to 500ms; tune with `--interval=N` (milliseconds).
- **Pairs with reload**: Edit a Blade template or PHP class → ~500ms later, Octane workers cycle, no manual reload needed.

## `exec {command*}`
The "Remote Command." Run a one-off command inside a running pod.

- **Direct Action**: Perfect for running DB dumps, checking files, or verifying configurations.
- **Usage**: `larakube exec ls -la`

## `node {command*}`, `npm`, `yarn`, `pnpm`, `bun`
The "Frontend Bridge." Manage your frontend assets without having Node.js installed on your host.

- **Zero-Host**: All commands run inside the `laravel-node` container.
- **Usage**: `larakube npm install`, `larakube bun run build`.
- **Persistence**: Installs are persisted to your project's `node_modules` via volume mounts.

## `composer {command*}`
The "PHP Package Bridge." Run any composer command inside the web container — no host PHP/composer needed.
- **Usage**: `larakube composer require spatie/laravel-permission`, `larakube composer update`.
- **Pairs with `larakube up`**: First-time installs are auto-handled; this command is for ongoing maintenance.

## `php {command*}`
The "Remote PHP." Execute PHP scripts or check your environment directly in the web container.

- **Example**: `larakube php -v`, `larakube php script.php`.

## `update`
The "Self-Update" tool. Pulls the latest CLI release from GitHub and installs it in place. Use after a new version is announced.

## MCP (Model Context Protocol)

LaraKube CLI supports the Model Context Protocol to provide AI tools with deep knowledge of your project.

### `mcp:register`
The "AI Connector." Register the LaraKube CLI MCP server with AI tools like Gemini or Claude.
- **Options**:
    - `--gemini`: Register with Gemini CLI.
    - `--claude`: Register with Claude Desktop.
    - `--all`: Register with all supported AI tools.

### `mcp:start`
The "MCP Engine." Start the MCP Server for a given handle. Usually invoked indirectly by AI clients via the registration step above — you rarely need to run this by hand.

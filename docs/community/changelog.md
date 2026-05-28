---
sidebar_position: 2
title: Changelog
description: Track the latest updates across the LaraKube ecosystem (CLI, Console, and Documentation).
---
# 📜 Changelog

LaraKube is evolving rapidly. We maintain a high-level changelog here for major architectural shifts, while specific technical commits can be tracked on GitHub.

## 🚀 Unified Ecosystem Updates

### May 2026: The "Per-Environment Schema" Release (CLI v0.4.0)
This release reshapes `.larakube.json` so every environment owns its own configuration — ingress, managed services, hosts. It's the foundation for multi-environment deployments where local, staging, QA, and production may legitimately need different settings (e.g., projects deployed across isolated VPCs/networks where each env runs an entirely different ingress controller).

- **Per-environment overrides**: `environments` is now a map keyed by env name. Each env carries its own `ingress`, `managed`, `hosts`, plus optional `addFeatures` / `excludeFeatures` for the rare cases where a feature's natural environment scope needs to be overridden.
- **Enum-driven feature scoping**: `LaravelFeature::defaultEnvironments()` declares where each feature naturally applies — `BOOST`, `AI`, `MCP`, `MAILPIT` default to local-only; `SSR` to production-only; everything else runs everywhere. The blueprint's top-level `features` list stays lean and you don't repeat yourself per env.
- **Cleaner production manifests**: dev-only feature env vars (`BOOST_*`, etc.) no longer leak into production deployments — feature filtering is now env-aware end-to-end.
- **Folder-name guard**: `larakube up` and `larakube heal` now fail fast with explicit rename instructions when the project folder name doesn't match the `name` field in `.larakube.json` (the common case: cloning a GitHub repo whose default folder name differs in capitalization).
- **MCP command hygiene**: `make:mcp-app-resource` is now hidden from `larakube list` (it's a LaraKube-internal scaffolding command, not a project-facing one).
- **Breaking blueprint changes** (clean break, no compat layer — migrate manually):
  - `ingressController` (top-level) → `environments.<env>.ingress`
  - `managedServices` (top-level, production-only) → `environments.<env>.managed`
  - `productionHost` → `environments.production.hosts.web`
  - `environments: ["local", "production"]` → `environments: {"local": {…}, "production": {…}}`
- **Migration**: edit `.larakube.json` to the new shape (see the [environments-config-schema plan](https://github.com/luchavez-technologies/larakube-cli/blob/main/plans/active/environments-config-schema.md) for the full target shape), then run `larakube heal` to regenerate manifests against the new schema. Existing K8s deployments stay running — no cluster-level migration needed.

### May 2026: The "First-Class Testing" Release (CLI v0.3.0)
This milestone made local Laravel testing inside Kubernetes feel **native and safe**, while shipping the foundation for production-grade SSR.

- **Testing**: New `larakube test` command — defaults to in-memory SQLite regardless of project DB driver so `RefreshDatabase` can never wipe dev data. `--db` provisions `<app>_testing` on MySQL/MariaDB/PostgreSQL (auto-persists `provisionTestDb` to `.larakube.json` on first use).
- **Safety Net**: `larakube art test`, `larakube php artisan test`, `larakube php vendor/bin/pest`, `larakube exec vendor/bin/phpunit`, etc. — all routes auto-delegate to the safe `test` flow. No more accidentally-wiped dev databases.
- **Hot Reload**: New `larakube reload` recycles Octane workers and gracefully drains Horizon/queues via a `HasReloadCommand` contract. New `larakube watch` pairs with it — a pure-PHP polling watcher with no host dependencies. Paths configurable via new `watchPaths` field in `.larakube.json`.
- **SSR**: New `ssr` feature flag generates a production-only `node-ssr` Deployment + Service for Inertia Server-Side Rendering. Local dev intentionally skipped (Inertia v3 has native Vite SSR; v2 local SSR adds latency for no benefit).
- **Self-Update**: New `larakube update` command pulls the latest CLI release from GitHub.
- **Faster Pod Boots**: Conditional install during `larakube up` (vendor, node_modules, SSR bundle) means subsequent pod restarts boot in ~5s instead of ~2 min.
- **Cleaner Local Dev**: `AUTORUN_LARAVEL_OPTIMIZE` and cache flags disabled in local pods. `.env` edits show up without restarting the pod; test-time env overrides actually take effect.
- **Vite 8 Fix**: Node pod readiness probe under Vite 8 fixed via explicit `--host 0.0.0.0` (Vite 8's bare `--host` bound to IPv6 wildcard only).
- **Help Passthrough**: `larakube art migrate --help` (and 9 other proxies) now shows the inner command's help instead of LaraKube's.
- **Breaking**: The old `larakube test` (HTTP smoke check) was renamed to `larakube smoke`. The `--with-db` flag was renamed to `--db` (old name kept as backward-compat alias).

### May 2026: The "Cloud Pilot" Release
This milestone transformed LaraKube into a professional deployment suite, establishing the **$6/mo Baseline** and the **Scaling Roadmap**.

- **Ecosystem**: Established the **$6/mo (1GB RAM) VPS** as the official baseline for stable production Kubernetes.
- **GitOps**: Launched **Cloud Pilot**, an automated GHA-to-GHCR pipeline that offloads heavy builds to GitHub to prevent OOM on small servers.
- **AI-Native**: Refactored the core into a **Dual-MCP** architecture (Local Mechanic + Master Architect).
- **Console**: Migrated to **Filament v5** for a professional "Control Plane" aesthetic and Saloon-powered API integration.
- **UX**: Added interactive **Anchor Links** and **Share Buttons** to the documentation for better developer collaboration.

---

## 🔗 Technical Release Notes
For a line-by-line breakdown of every fix and feature, please follow our individual repository releases:

- **[LaraKube CLI Releases](https://github.com/luchavez-technologies/larakube-cli/releases)**: Tracking the core PHP orchestration engine.
- **[LaraKube Console Releases](https://github.com/luchavez-technologies/larakube-console/releases)**: Updates to the visual Kubernetes Control Plane.
- **[LaraKube Documentation](https://github.com/luchavez-technologies/larakube-docs/commits/main)**: Ongoing improvements to guides and visual schematics.

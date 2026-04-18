---
sidebar_position: 2
---
# 📜 Changelog

LaraKube is currently under **active development**. We are hard at work building the ultimate Kubernetes experience for Laravel, with the goal of releasing version **`0.0.1`** within this week.

---

## [Unreleased] - 2026-04-18 (Current Session)

This session focused on transforming LaraKube into an expressive, industrial-strength orchestrator with a heavy emphasis on local stability and automated lifecycles.

### 🚀 Major Features
-   **Expressive CLI API ("Architecture-by-Flag")**: You can now define your entire stack directly in the `new` command using flags like `--frankenphp`, `--mysql`, `--meilisearch`, and `--reverb`.
-   **Stability-First Storage**: Migrated local databases from problematic `hostPath` mounts to **Managed Persistent Volumes (PVCs)**. This eliminates 100% of the "Permission Denied" errors common in macOS/Docker environments while keeping data durable.
-   **Hands-Off Automations**: Integrated **Serversideup Automations** (`AUTORUN_ENABLED`). The cluster now handles its own migrations and optimizations automatically the moment a pod boots up.
-   **Safe Pause/Resume**: Introduced `stop` and `start` commands. These scale your pods to zero replicas, allowing you to pause your cluster and save resources without deleting your namespace or losing data.
-   **Service Dashboard**: Created the `status` command, featuring an elegant **Laravel Prompts** table that shows the real-time health, restarts, and age of all cluster services.

### 🛠 Technical Improvements
-   **Vite HMR Hardening**: The orchestration engine now surgically hardens `vite.config.ts` for Kubernetes Ingress. It automatically configures `clientPort: 80` and enables `CORS`, eliminating whitescreens and origin errors.
-   **Deduplicated Manifest Engine**: Refactored the internal registration logic to follow a strict two-phase "Single-Pass" strategy, definitively resolving "Already Registered ID" and strategic merge patch conflicts.
-   **Professional Teardown Hierarchy**: Refined `down` (Cleanup) and `reset` (Factory Reset) with "Confirm by Name" safety gates to prevent accidental data loss.
-   **Integrated Documentation**: Created a collection of **Architectural Recipes** and a **Kubernetes Glossary** to bridge the gap between Laravel development and cluster orchestration.

### 🤝 Community & Personal
-   Added a dedicated tribute to [Serversideup](https://serversideup.net/) and [Spin Pro](https://getspin.pro/).
-   Integrated the creator's professional profile and "Open to Work" invitation.

---

### 📅 Roadmap to 0.0.1
- [x] Finalize expressive CLI flags.
- [x] Harden local database persistence.
- [x] Implement automated migration hooks.
- [ ] Final validation of Statamic and Filament blueprints.
- [ ] Initial release of the LaraKube binary.

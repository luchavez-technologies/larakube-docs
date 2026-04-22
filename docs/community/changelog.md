---
sidebar_position: 2
title: Changelog & Roadmap
description: Stay updated with the latest LaraKube CLI features, technical improvements, and the roadmap to version 0.0.1. Track our progress in real-time.
---
# 📜 Changelog

LaraKube is currently under **active development**. We are hard at work building the ultimate Kubernetes experience for Laravel, with the goal of releasing version **`0.0.1`** within this week.

---

## [Unreleased] - 2026-04-18 (Current Session)

This session focused on transforming LaraKube into an expressive, industrial-strength orchestrator with a heavy emphasis on local stability, automated lifecycles, and architectural resilience.

### 🚀 Major Features
-   **Blueprint Resilience**: Your architectural DNA (`.larakube.json`) is now automatically backed up to a secure **Kubernetes Secret**. The `heal` command can now restore your master configuration directly from the cluster if the local file is lost.
-   **Full-Stack Live Coding**: Integrated native backend watching for **FrankenPHP/Octane** using `chokidar`. Local development now features instant hot-reloading for both PHP and JavaScript with zero manual refreshes.
-   **Hardened Database Initialization**: Switched from basic port checks to initialization-aware probes (`mysqladmin ping`, `pg_isready`). This ensures your database is 100% ready before your application pod even starts.
-   **Self-Healing Startup**: Added a `wait-for-db` initContainer to the web pod, definitively resolving "Connection Refused" errors and initialization deadlocks during cluster boot.
-   **Expressive CLI API ("Architecture-by-Flag")**: You can now define your entire stack directly in the `new` command using flags like `--frankenphp`, `--mysql`, `--meilisearch`, and `--reverb`.
-   **Stability-First Storage**: Implemented **Managed Persistent Volumes (PVCs)** with native `subPath` mounts for Laravel's framework directories. This ensures durability and eliminates host-path permission conflicts.
-   **Safe Pause/Resume**: Introduced `stop` and `start` commands to scale pods to zero and back, saving resources without data loss.

### 🛠 Technical Improvements
-   **Vite HMR Hardening**: Surgically hardens `vite.config.ts` for Kubernetes Ingress (Port 80/CORS), eliminating whitescreens.
-   **Deduplicated Manifest Engine**: Refactored to a strict two-phase "Single-Pass" strategy to prevent Kustomize conflicts.
-   **Professional UX**: Implemented "Confirm by Name" safety gates for destructive commands and an elegant, frequency-capped GitHub star prompt.
-   **Integrated Documentation**: Created a collection of **Architectural Recipes** and a **Kubernetes Glossary** to bridge the gap between Laravel and cluster orchestration.

### 🤝 Community & Personal
-   Added a dedicated tribute to [Serversideup](https://serversideup.net/) and [Spin Pro](https://getspin.pro/).
-   Integrated the creator's professional profile and LinkedIn/Email contact details.

---

### 📅 Roadmap to 0.0.1
- [x] Finalize expressive CLI flags.
- [x] Harden local database persistence.
- [x] Implement automated migration and wait hooks.
- [x] Integrate full-stack live watching.
- [ ] Final validation of Statamic and Filament blueprints.
- [ ] Initial release of the LaraKube binary.

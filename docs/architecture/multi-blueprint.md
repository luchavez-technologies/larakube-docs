---
sidebar_position: 6
title: Multi-Blueprint Architecture
description: Learn how LaraKube CLI allows you to combine multiple specialized blueprints in a single Laravel project.
---
# 🧩 Multi-Blueprint Architecture

LaraKube CLI treats architectural blueprints as "Composable Layers" rather than mutually exclusive choices.

## 🧱 The Implicit Foundation: Laravel
Every LaraKube CLI project starts with a hardened **Laravel** foundation. This includes the core PHP deployment, local Node.js development server, and the basic Ingress configuration.

## 📂 Specialized Blueprints
Beyond the base Laravel layer, you can stack multiple specialized blueprints to suit your project's needs:

-   **Filament PHP:** Optimizes the architecture for a high-performance administration panel, including specialized container hooks and asset optimization.
-   **Statamic CMS:** Configures the cluster for a flat-file or database-driven CMS experience, ensuring storage persistence is correctly mapped for content.

## 🤝 Can I combine them?
**Yes.** While it might not be a standard requirement, LaraKube CLI supports projects that use both Statamic and Filament simultaneously. 

When you choose multiple blueprints during `larakube new` or add one later via `larakube add`, LaraKube CLI performs an **Architectural Reconciliation**:
- It merges the required PHP extensions.
- It consolidates the Kubernetes volume requirements.
- It ensures that lifecycle hooks (like installation commands) are run in the correct order.

## 🚀 How to Evolution
To add a new blueprint foundation to your existing project:
```bash
larakube add statamic
```
LaraKube CLI will detect your current setup and surgically inject the Statamic requirements without breaking your existing Filament or custom Laravel logic.

---
sidebar_position: 3
title: Laravel Scout Search Integration
description: Automate full-text search with Laravel Scout. Support for Meilisearch, Typesense, and Database drivers with automated cluster hardening and config.
---
# Laravel Scout (Search)

Full-text search is a cornerstone of modern applications. LaraKube automates the deployment of your preferred search engine and its integration with [Laravel Scout](https://laravel.com/docs/scout).

## 🏛 Supported Drivers
LaraKube offers three distinct "flavors" for your search foundation:

### 1. Meilisearch (Self-hosted)
The fastest typt-tolerant search engine, specifically tuned for the Laravel community.
- **Image:** `getmeili/meilisearch:v1.12`
- **Dashboard:** `https://meilisearch.your-project.dev.test`

### 2. Typesense (Self-hosted)
A high-performance, open-source search engine that focuses on performance and developer experience.
- **Image:** `typesense/typesense:27.1`
- **URL:** `https://typesense.your-project.dev.test`

### 3. Database (Built-in)
A zero-infrastructure search option that uses your existing database (MySQL or PostgreSQL) for full-text indexing. Perfect for small projects or internal tools.

---

## ⚡️ Automations
When you enable Scout, LaraKube automatically:
1.  **Installs PHP Drivers:** Adds `laravel/scout` and the driver-specific SDKs to your container.
2.  **Hardens the Cluster:** Deploys your chosen engine with a secure Master Key.
3.  **Auto-Configures Laravel:** Injects the correct `SCOUT_DRIVER` and connection settings into your `.env`.
4.  **Sets up Local Ingress:** Provides a dedicated local URL for API and dashboard access.

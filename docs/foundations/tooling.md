---
sidebar_position: 6
title: Filament & Statamic
description: Scaffold FilamentPHP admin panels or Statamic flat-file CMS projects with LaraKube CLI — automated installation, optimized PHP extensions, and cluster-ready configuration.
---
# 🪄 Filament & Statamic

Both of these are `larakube new` blueprints for content/admin-heavy Laravel apps — pick the one matching what you're building.

| Tool | Command | Best for |
|---|---|---|
| 🪄 [FilamentPHP](#-filamentphp) | `larakube new my-admin --filament` | TALL-stack admin panels, complex data + exports |
| 📁 [Statamic](#-statamic) | `larakube new my-cms --statamic` | Flat-file, Git-based content management |

## 🪄 FilamentPHP

[Filament](https://filamentphp.com) is the most popular way to build modern Laravel admin panels. LaraKube CLI runs the Filament installer and panel setup for you, injects the required PHP extensions (like `intl`) into your `Dockerfile.php`, and pre-configures the panel to work with **MySQL** or **PostgreSQL** in your cluster.

💡 Filament apps often handle complex data and long-running exports. By using LaraKube CLI's **Architecture-by-Flag**, you can easily add **Horizon** and **Redis** to ensure your admin panel remains responsive under load.

## 📁 Statamic

[Statamic](https://statamic.dev) is the premier flat-file CMS for Laravel. LaraKube CLI handles the Statamic CLI installation and project scaffolding, provides a specialized environment for the storage requirements of a Git-based CMS, injects `gd` and `exif` extensions for image optimization, and pre-configures **Mailpit** so you can test contact forms immediately.

💡 Statamic shines in high-traffic corporate sites. Pair `--statamic` with **Nginx** and **Redis** to build a content-first site that's production-ready from day one.

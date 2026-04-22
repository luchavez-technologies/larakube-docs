---
sidebar_position: 1
title: FilamentPHP on Kubernetes
description: Build modern Laravel admin panels with FilamentPHP and LaraKube CLI. Automated installation, optimized PHP extensions, and cluster-ready scaling.
---
# 🪄 FilamentPHP

Build beautiful, TALL-stack admin panels and applications with professional Kubernetes orchestration.

## 🏗 The Foundation
[Filament](https://filamentphp.com) is the most popular way to build modern Laravel admin panels. LaraKube automatically configures the necessary PHP extensions (like `intl`) and ensures your panel is ready for high-traffic scaling.

## 🚀 Instant Scaffolding
You can launch a fresh Filament project directly from the CLI:

```bash
# Explicitly choose the Filament blueprint
larakube new my-admin --filament
```

### 🧱 What's included:
-   **Automated Installation**: LaraKube runs the Filament installer and panel setup for you.
-   **Optimized PHP**: Injects the required extensions into your `Dockerfile.php`.
-   **Ready for Scaling**: Pre-configured to work with **MySQL** or **PostgreSQL** in your cluster.

---

### 💡 Why this works
Filament apps often handle complex data and long-running exports. By using LaraKube's **Architecture-by-Flag**, you can easily add **Horizon** and **Redis** to ensure your admin panel remains responsive under load.

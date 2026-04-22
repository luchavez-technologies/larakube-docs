---
sidebar_position: 2
title: Statamic CMS on Kubernetes
description: Launch professional flat-file CMS projects with Statamic and LaraKube CLI. Specialized storage handling, image optimization, and local email setup.
---
# 📁 Statamic

Create professional, flat-file content management systems with the power of Kubernetes.

## 🏗 The Foundation
[Statamic](https://statamic.dev) is the premier flat-file CMS for Laravel. LaraKube provides a specialized environment that handles the unique storage requirements of a Git-based CMS.

## 🚀 Instant Scaffolding
You can launch a fresh Statamic project directly from the CLI:

```bash
# Explicitly choose the Statamic blueprint
larakube new my-cms --statamic
```

### 🧱 What's included:
-   **Automated Installation**: LaraKube handles the Statamic CLI installation and project scaffolding.
-   **Image Optimization**: Automatically injects `gd` and `exif` extensions for high-performance asset processing.
-   **Local Email**: Pre-configures **Mailpit** so you can test your contact forms immediately.

---

### 💡 Why this works
Statamic shines in high-traffic corporate sites. By using the `--statamic` flag alongside **Nginx** and **Redis**, you can build a content-first masterpiece that is production-ready from Day One.

---
sidebar_position: 2
title: Vue.js
description: High-performance Vue.js and Laravel deployment on Kubernetes. Automatic HMR setup, SSR support, and Traefik routing.
---
# 🖖 Vue.js

Vue.js is the "Expressive" choice for UI development. Its clean syntax and powerful reactivity system make it a perfect partner for Laravel's elegant backend.

<div align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg" width="100" height="100" alt="Vue" />
</div>

## 🐘 Why Laravel + Vue?
1.  **Shared Philosophy**: Both frameworks prioritize developer happiness and clean, readable code.
2.  **Inertia.js First-Class**: Vue is the primary target for Inertia.js, offering the smoothest "Classic Laravel" feel for an SPA.
3.  **Tailwind Utility**: Pre-configured utility-first styling that integrates perfectly with Vue components.

## 🚀 Why LaraKube?
LaraKube CLI hardens your Vue deployment for high-traffic environments:

-   **Zero-Config HMR**: We bridge the Kubernetes networking gap so that Hot Module Replacement works out-of-the-box.
-   **Resource Isolation**: Vue SSR (Server-Side Rendering) is memory-intensive. LaraKube puts it in its own pod so it doesn't crash your PHP backend.
-   **Standardized Headers**: Pre-configured Traefik middleware to handle the specific security headers required for modern SPAs.

```bash
# Scaffold a Vue Masterpiece
larakube new my-app --vue
```

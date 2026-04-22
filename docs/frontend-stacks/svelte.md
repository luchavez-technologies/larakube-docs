---
sidebar_position: 3
title: Svelte
description: Deploy modern, lightweight Svelte and Laravel applications on Kubernetes. Optimized Docker builds and Traefik ingress configuration.
---
# 🧡 Svelte

Svelte is the "Future-Forward" choice. By compiling your UI at build-time rather than interpreting it in the browser, it offers unparalleled performance for Laravel applications.

<div align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/svelte.svg" width="100" height="100" alt="Svelte" />
</div>

## 🐘 Why Laravel + Svelte?
1.  **Lightweight Footprint**: Smallest possible bundle size for your Laravel frontend.
2.  **Native Integration**: Works seamlessly with Laravel's Vite configuration.
3.  **Clean State Management**: Svelte's stores and simple reactivity simplify complex years and interactive dashboards.

## 🚀 Why LaraKube?
Deploying a compiler-based UI like Svelte on Kubernetes requires precision:

-   **Optimized Build Steps**: LaraKube's Docker stubs are tuned to handle Svelte's compilation phase efficiently.
-   **Static Asset Offloading**: Pre-configures Traefik and Ingress to serve Svelte's compiled assets with optimal caching.
-   **Stable Foundations**: While Svelte moves fast, LaraKube provides a stable, "Fixed-Version" Kubernetes foundation so your app doesn't break during updates.

```bash
# Scaffold a Svelte Masterpiece
larakube new my-app --svelte
```

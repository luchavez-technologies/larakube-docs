---
sidebar_position: 1
title: React
description: Deploy professional React and Inertia.js applications on Kubernetes with LaraKube CLI. Optimized for Vite, HMR, and SSR.
---
# ⚛️ React

React is the world's most popular library for building user interfaces. When combined with Laravel, it provides a "Heavy-Industry" foundation for modern web applications.

<div align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" width="100" height="100" alt="React" />
</div>

## 🐘 Why Laravel + React?
1.  **Vite Bridge**: Laravel's native Vite integration makes React development instantaneous.
2.  **Inertia.js**: Build single-page apps without the complexity of a separate API layer. Keep your routing and controllers in PHP while using React for the UI.
3.  **Authentication**: Use Laravel **Starter Kits** to get professional, secure React-based auth in minutes.

## 🚀 Why LaraKube?
Deploying React (especially with SSR) on Kubernetes is notoriously complex. LaraKube CLI solves this by:

-   **Dedicated Node Pods**: Automatically scaffolds separate pods for the Vite dev server and Node.js SSR workers.
-   **Automated Networking**: Pre-configures **Traefik** to route `vite.your-app.dev.test` directly to the HMR server.
-   **Production Parity**: Your React build pipeline inside the cluster matches your production CI/CD exactly.

```bash
# Scaffold a React Masterpiece
larakube new my-app --react
```

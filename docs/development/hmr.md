---
sidebar_position: 3
title: Full-Stack Live Coding & HMR
description: Experience zero-config live coding with LaraKube CLI. Learn how we bridge Vite HMR and Octane backend watching directly into your Kubernetes cluster.
---
# ⚡️ Full-Stack Live Coding

LaraKube CLI provides a professional, "Zero-Config" live development experience. We automatically bridge the gap between the dev servers running inside your cluster and your local IDE.

## 🗺 How it Works (Frontend)
When you launch your cluster with `larakube up`, the CLI surgically hardens your `vite.config.ts` (or `.js`) for the Kubernetes environment:

1.  **Ingress Routing**: Vite is configured to use `clientPort: 80`. This allows HMR traffic to flow through the standard Kubernetes Ingress.
2.  **Domain Mapping**: Assets are fetched from `vite.{{your-app}}.kube`.
3.  **CORS Handling**: Cross-Origin Resource Sharing is automatically enabled so your main application can securely fetch assets from the asset subdomain.

## 🐘 Backend Live-Watching (Octane)
If you are using the **FrankenPHP** server variation, LaraKube CLI automatically enables high-performance backend watching:

1.  **Automated Watch**: The CLI appends the `--watch` flag to your `octane:start` command in local environments.
2.  **Native Performance**: We've integrated `chokidar` directly into the development stage of our PHP images, ensuring that file changes are detected instantly.
3.  **Zero production overhead**: These watching tools are stripped out of your `deploy` stage images, keeping your production environment lean and secure.

## ✨ The Developer Experience
- **Instant Everything**: Save a PHP file, and Octane restarts. Save a Vue/React file, and Vite updates your browser.
- **No Manual Refresh**: Enjoy a seamless "Live Coding" experience with zero manual browser refreshes or cluster restarts.
- **Perfect Isolation**: Enjoy professional pod separation while maintaining the speed of local development.

---

### 💡 Troubleshooting

**Changes not reflecting:**
1.  Run `larakube about` to ensure the `laravel-web` and `laravel-node` pods are **Ready 🟢**.
2.  Check your console for any "Connection Refused" errors. If found, run `larakube doctor` to verify your `/etc/hosts` and port mappings.

**Constant full-reload messages in browser:**
If your browser repeatedly shows full-reload notifications every few seconds (especially after running `larakube up`), the issue is likely MinIO temporary files triggering Vite's file watcher. 

LaraKube CLI automatically excludes `.infrastructure/volume_data` from Vite's watch list in v0.11.8+. If you're on an older version:

```javascript
// vite.config.ts
server: {
  watch: {
    ignored: ['**/.infrastructure/volume_data/**'],
  },
  // ... rest of config
},
```

This prevents MinIO temp files (which change constantly) from triggering unwanted reloads.

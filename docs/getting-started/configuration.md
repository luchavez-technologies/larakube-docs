---
sidebar_position: 3
---
# Secrets & Configuration

LaraKube follows a **"Zero-Secrets-in-Git"** philosophy. This ensures that your application configuration is handled securely and transparently, mimicking production standards even in local development.

## 🗺 How it Works
LaraKube keeps your sensitive credentials (passwords, API keys, etc.) out of your repository and your Kubernetes manifests:

1.  **Local Source:** The CLI reads your local `.env` file.
2.  **Safe Manifests:** Your Kubernetes files remain clean and contain no hardcoded secrets.
3.  **Automatic Protection:** LaraKube automatically ensures your environment files are ignored by Git.

## 🔄 Syncing Changes
If you update your local `.env` file, simply run `larakube up` again. The CLI will:
-   Sync the new values into your cluster.
-   Automatically restart your application pods to pick up the changes.
-   Ensure your cluster is always perfectly synchronized with your local source of truth.

## 💾 Local Persistence (Stability-First)
LaraKube is architected for stability and speed in local development:

-   **Development (`emptyDir`):** Local databases (MySQL, Postgres, Redis) use high-performance container storage. This eliminates the "Permission Denied" and "Silent Crash" issues common with macOS host-mounting.
-   **Production (PVC):** For non-local environments, LaraKube automatically switches to robust **PersistentVolumeClaims**, ensuring your data is durable and safe.
-   **Safe Pause:** Use `larakube stop` to turn off your app while preserving its internal state.

## 🔐 Standardized Local Passwords
To get you started instantly, LaraKube standardizes on **`secretpassword`** for all built-in services (MySQL, Postgres, Redis, Meilisearch, etc.) during local development.

---

## 🛠 Advanced Monitoring
You can verify your current cluster-side configuration at any time using the dashboard:
```bash
larakube dashboard
```

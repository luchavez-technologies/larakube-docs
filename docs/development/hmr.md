---
sidebar_position: 3
---
# Hot Module Replacement (HMR)

LaraKube provides a professional, "Zero-Config" Hot Module Replacement experience. We automatically bridge the gap between the Vite dev server running inside your cluster and your local browser.

## 🗺 How it Works
When you launch your cluster with `larakube up`, the CLI surgically hardens your `vite.config.ts` (or `.js`) for the Kubernetes environment:

1.  **Ingress Routing**: Vite is configured to use `clientPort: 80`. This allows HMR traffic to flow through the standard Kubernetes Ingress.
2.  **Domain Mapping**: Assets are fetched from `vite.{{your-app}}.local`.
3.  **CORS Handling**: Cross-Origin Resource Sharing is automatically enabled so your main application can securely fetch assets from the asset subdomain.
4.  **Network Binding**: The Vite server inside the pod binds to `0.0.0.0:5173` to ensure it is reachable by the cluster service.

## ⚡️ The Developer Experience
- **Instant Updates**: As soon as you save a file in your IDE, LaraKube's code-mounting logic syncs it to the PHP/Node pods, and Vite pushes the update to your browser instantly.
- **No Manual Refresh**: Enjoy a seamless "Live Coding" experience with zero manual browser refreshes.
- **SSL Ready**: Because all traffic flows through the LaraKube Ingress, your HMR traffic is as secure as your main application.

---

### 💡 Troubleshooting
If HMR is not reflecting your changes:
1.  Run `larakube status` to ensure the `laravel-node` pod is **Ready 🟢**.
2.  Check your console for any "Connection Refused" errors. If found, run `larakube doctor` to verify your `/etc/hosts` and port mappings.

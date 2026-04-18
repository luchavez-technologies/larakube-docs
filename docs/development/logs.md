---
sidebar_position: 3
---
# Monitoring Logs

Observability is the heartbeat of development. LaraKube provides a streamlined tool to monitor the pulse of every service in your cluster.

## The `logs` Command
Instead of remembering complex `kubectl` label selectors, you can tail logs using simple service names:

```bash
larakube logs {service}
```

### Supported Services
- **`web`:** Monitor the combined NGINX and PHP-FPM logs.
- **`node`:** See the output of your Vite dev server or build tasks.
- **`horizon`:** Track your background queue jobs.
- **`reverb`:** Watch your WebSocket traffic.
- **`traefik`:** Debug cluster ingress and routing.

## 🛠 Advanced Debugging
For a more visual experience, you can use the built-in Command Center:

```bash
larakube dashboard
```
This will launch **K9s**, pre-focused on your project's namespace. From there, you can select any pod and press `l` to see its logs in real-time.

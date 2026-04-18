---
sidebar_position: 4
---
# Laravel Octane (with FrankenPHP)

Laravel Octane supercharges your application's performance by serving it using high-powered application servers, including [FrankenPHP](https://frankenphp.dev/).

## ⚡️ The Power of Octane
When you enable Octane, LaraKube configures your application to stay in memory:
- **Blazing Fast:** No need to boot the Laravel framework on every request.
- **Persistent Connections:** Database and Redis connections stay open, reducing overhead.
- **Zero-Downtime:** Kubernetes handles the graceful rollout of new Octane workers.

## 🏛 Required Engine
To use Octane in LaraKube, you must select **FrankenPHP** as your server variation. LaraKube will then automatically:
1.  Configure the container entrypoint to run `php artisan octane:start`.
2.  Optimize the worker count based on your cluster's resource limits.
3.  Set up the necessary health probes to monitor the Octane master process.

## Environment Variables
Ensure your `OCTANE_SERVER` is set to `frankenphp` in your `.env`. LaraKube handles this automatically during project initialization.

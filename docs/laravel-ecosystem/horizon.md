---
sidebar_position: 2
title: Laravel Horizon
description: Industrial-strength queue management for Laravel Horizon on Kubernetes. Automated Redis integration, dedicated containers, and health monitoring.
---
# Laravel Horizon

LaraKube simplifies running [Laravel Horizon](https://laravel.com/docs/horizon) by handling the process management and Redis requirements automatically.

## 🧱 What's Included
- **Redis Integration:** Selecting Horizon automatically includes and configures a Redis instance in your cluster.
- **Dedicated Container:** LaraKube scaffolds a specialized container that runs `php artisan horizon`, isolated from your web traffic.
- **Master Process Monitoring:** A built-in `readinessProbe` uses `php artisan horizon:status` to ensure the queue master is healthy before signaling success.

## Workflow
Horizon is configured via your project's `config/horizon.php`. Since LaraKube uses your local code, any changes to your worker configurations or queue names are picked up during the `up` process.

## scaling
In production, you can scale your Horizon workers by updating the `replicas` in your `horizon-deployment.yaml`. LaraKube ensures that the master process and its workers have sufficient resources to handle your background workloads.

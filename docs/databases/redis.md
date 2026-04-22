---
sidebar_position: 6
title: Redis Caching & Queues
description: Power your Laravel app with Redis on Kubernetes. Learn how to configure caching, Horizon queues, and Reverb broadcasting within your cluster.
---
# Redis

Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker.

## Implementation Details
- **Image:** `redis:7.4`
- **Port:** `6379`

## 🧱 Role in LaraKube
Redis is a critical component for many LaraKube features:
- **Caching:** Speed up your application by storing expensive queries in memory.
- **Queues:** The default driver for **Laravel Horizon**.
- **WebSockets:** Used by **Laravel Reverb** for efficient message broadcasting.

## 🔐 Security
In local development, Redis is accessible without a password within the cluster. In production, we recommend adding a `REDIS_PASSWORD` to your `.env.production` for additional hardening.

## 🔌 Connection
To connect a GUI client to your local Redis instance:

1.  **Open a tunnel:**
    ```bash
    larakube tunnel redis
    ```
2.  **Use the credentials:**
    - **Host:** `127.0.0.1`
    - **Port:** `6379`

---
sidebar_position: 4
title: Pod Startup Sequence
description: Understand the architectural orchestration of LaraKube pods. Learn how initContainers manage database readiness, migrations, and service dependencies.
keywords: [laravel, kubernetes, startup sequence, initContainers, database migration, dependency management, orchestration]
---
# Pod Startup Sequence

LaraKube uses a deterministic startup sequence to ensure that your application never crashes during the initial `larakube up` or during subsequent updates. This is achieved through Kubernetes **initContainers** and a "Web-First" dependency model.

## 🏗 The "Orchestration" Flow

When you run `larakube up`, Kubernetes attempts to start all pods simultaneously. However, LaraKube enforces a strict functional order:

1.  **Infrastructure First:** Databases (Postgres/MySQL) and Cache (Redis) start. They have no dependencies.
2.  **Web Pod (The Leader):** The `php-web` pod starts but stays in an `Init` state until it can reach the database and redis.
3.  **Migration Runner:** Once the database is up, the `php-web` pod executes `php artisan migrate`.
4.  **Worker Readiness:** Dependent pods like `horizon`, `scheduler`, and `reverb` stay in an `Init` state until **both** the infrastructure is ready AND the `php-web` pod is "Ready" (meaning migrations are finished).

---

## 🔍 Who waits for what?

| Pod / Service | Waits For... | Why? |
| :--- | :--- | :--- |
| **Databases** | None | Foundation of the stack. |
| **php-web** | DB + Redis | Needs to run migrations and clear cache. |
| **horizon** | DB + Redis + **php-web** | Prevents workers from crashing if tables don't exist yet. |
| **reverb** | DB + Redis + **php-web** | Ensures the database schema is ready for websocket state. |
| **scheduler** | DB + Redis + **php-web** | Prevents scheduled tasks from failing due to missing schema. |

---

## 🛠 How it works (Technically)

### 1. `wait-for-services`
Every PHP-based pod contains a `wait-for-services` initContainer. It uses `nc` (Netcat) to probe the database and redis ports.
- **Resilience:** If you aren't using Redis, LaraKube intelligently skips this check by detecting the `REDIS_HOST=127.0.0.1` default.

### 2. `wait-for-web`
Worker pods (`horizon`, `reverb`, etc.) contain a second initContainer called `wait-for-web`. It probes the `laravel-web` service on port 80.
- **The Secret:** The `php-web` pod only becomes "Ready" in Kubernetes *after* its entrypoint script (which runs migrations) has successfully finished. By waiting for the web service, workers are guaranteed that the database schema is fully up-to-date.

### 3. `Recreate` Strategy
LaraKube uses the `strategy: type: Recreate` for all deployments. 
- **Migration Safety:** This ensures that during an update, the old pod is fully terminated before the new pod starts. This prevents two pods from trying to run `php artisan migrate` at the same time, which would cause database lock errors.

---

## 💡 Troubleshooting Startup
If your pods are stuck in `Init:0/2` or `Init:1/2`, it usually means one of the dependencies isn't reachable.
- **Check Logs:** `kubectl logs <pod-name> -c wait-for-web`
- **Check Web Pod:** If the web pod is crashing (e.g., a bad migration), all other pods will wait indefinitely until the web pod is fixed.

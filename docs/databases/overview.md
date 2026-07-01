---
sidebar_position: 1
title: Database Overview
description: High-performance, production-ready database orchestration for Laravel. Supported engines include PostgreSQL, MySQL, MariaDB, MongoDB, and Redis.
---
# Database Overview

Choosing the right foundation is critical for your application's success. LaraKube CLI supports a variety of server-based database engines, each with automated persistence and secure credential management.

## 🏛 Architectural Structure
LaraKube CLI distinguishes between your **Primary** and **Additional** databases:

1.  **Primary Database:** The engine linked to your Laravel application's main `DB_CONNECTION`. When you run `larakube new`, your first selection becomes the primary.
2.  **Additional Databases:** You can have multiple database engines running in the same project. This is useful for data migration, testing different engines, or specialized micro-services.

### Intelligent Swapping
If you decide to change your primary database (e.g., from MySQL to Postgres), the `add` command will intelligently guide you:
- It keeps both engines running in your cluster.
- It offers to update your `.env` connection strings.
- It provides a **"Migration Mode"** that comments out the new connection so you can manually migrate data before flipping the switch.

## 💾 Persistence Strategy (Stability-First)
LaraKube CLI uses a **"Managed Volume"** approach to eliminate the most common pain points of local Kubernetes development:

1.  **Durable Data**: Your data is stored in your cluster provider's native storage pool (PVC). It survives `larakube stop`, pod crashes, and server restarts.
2.  **Zero Permission Conflicts**: By avoiding Mac-to-Container "bind mounts" (`hostPath`) for databases, we eliminate the "Permission Denied" and ownership errors that typically plague local development.
3.  **Production Parity**: This approach ensures your local storage architecture behaves exactly like a professional cloud-managed database (e.g., AWS EBS or GCP Persistent Disk).

## Choosing an engine

| Engine | Image | Port | Notes |
|---|---|---|---|
| **MySQL** | `mysql:8.4` (LTS) | `3306` | World's most popular open-source DB — see [below](#mysql) |
| **MariaDB** | `mariadb:11.8` (LTS) | `3306` | Community MySQL fork, same security defaults — see [below](#mariadb) |
| **[PostgreSQL](./postgresql)** | `postgres:17.9` | `5432` | Advanced SQL features, strong JSON support |
| **[Redis](./redis)** | `redis:7.4` | `6379` | Cache/queue/session store, not a primary DB |

### MySQL

LaraKube CLI provides a hardened MySQL setup: a dedicated `laravel` application user (never `root`) with scoped permissions, credentials managed via Kubernetes `Secret` resources (never plain text), and a `mysqladmin ping` readiness probe so the database is fully ready before your application starts.

To connect a GUI client to your local instance:
```bash
larakube tunnel mysql
```
Then use host `127.0.0.1`, user `laravel`, database `laravel`.

### MariaDB

MariaDB gets the same security treatment as MySQL — a scoped `laravel` application user created automatically, encrypted secrets injected into the cluster, and the current LTS version pinned for stability.

To connect a GUI client to your local instance:
```bash
larakube tunnel mariadb
```
Then use host `127.0.0.1`, user `laravel`, database `laravel`.

## 📅 Versioning Strategy
We prioritize **stability and security**. All our stubs are pinned to the most recent stable Long-Term Support (LTS) versions:

### Databases
- **PostgreSQL:** `17.9` (Standard)
- **MySQL:** `8.4` (LTS)
- **MariaDB:** `11.8` (LTS)
- **MongoDB:** `8.0`
- **Redis:** `7.4` (Standard)

## 🔄 Infrastructure Evolution
LaraKube CLI projects are designed to grow. You can add a new database engine to your cluster at any time using the `add` command:

```bash
larakube add mysql
```
LaraKube CLI will scaffold the new engine and offer to automatically update your `.env` to make it your primary connection.

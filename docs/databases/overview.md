---
sidebar_position: 1
title: Database Overview
description: High-performance, production-ready database orchestration for Laravel. Supported engines include PostgreSQL, MySQL, MariaDB, MongoDB, and Redis.
---
# Database Overview

Choosing the right foundation is critical for your application's success. LaraKube CLI supports a variety of server-based database engines, each with automated persistence and secure credential management.

## 🏛 Supported Foundations
LaraKube provides hardened, production-ready manifests for:
- **MySQL:** The classic, reliable choice.
- **MariaDB:** A popular MySQL alternative.
- **PostgreSQL:** Advanced open-source database.
- **MongoDB:** Highly-scalable NoSQL for flexible data structures.
- **Redis:** Fast, in-memory caching and queues.

## 💾 Persistence Strategy (Stability-First)
LaraKube uses a **"Managed Volume"** approach to eliminate the most common pain points of local Kubernetes development:

1.  **Durable Data**: Your data is stored in your cluster provider's native storage pool (PVC). It survives `larakube stop`, pod crashes, and server restarts.
2.  **Zero Permission Conflicts**: By avoiding Mac-to-Container "bind mounts" (`hostPath`) for databases, we eliminate the "Permission Denied" and ownership errors that typically plague local development.
3.  **Production Parity**: This approach ensures your local storage architecture behaves exactly like a professional cloud-managed database (e.g., AWS EBS or GCP Persistent Disk).

## 📅 Versioning Strategy
We prioritize **stability and security**. All our stubs are pinned to the most recent stable Long-Term Support (LTS) versions:

### Databases
- **PostgreSQL:** `17.9` (Standard)
- **MySQL:** `8.4` (LTS)
- **MariaDB:** `11.8` (LTS)
- **MongoDB:** `8.0`
- **Redis:** `7.4` (Standard)

## 🔄 Infrastructure Evolution
LaraKube projects are designed to grow. You can add a new database engine to your cluster at any time using the `add` command:

```bash
larakube add mysql
```
LaraKube will scaffold the new engine and offer to automatically update your `.env` to make it your primary connection.

---
sidebar_position: 4
title: PostgreSQL for Laravel
description: Reliable PostgreSQL setup for Laravel on Kubernetes. Features zero-config migrations, automated secrets management, and cluster-native initialization.
---
# PostgreSQL

PostgreSQL is a powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.

## Implementation Details
- **Image:** `postgres:17.9`
- **Port:** `5432`
- **Default User:** `postgres`

## 🔐 Security & Initialization
LaraKube hardens your PostgreSQL instance from the first boot:
- **Secrets Management:** The database password is never stored in plain text; it is securely managed via Kubernetes Secrets.
- **Zero-Config Migrations:** Local Postgres instances automatically create the `laravel` database for you, ensuring your migrations run successfully on the first try.
- **Connection Ready:** The CLI ensures the database is fully initialized before signaling that your project is ready.

## 🔌 Connection
To connect a GUI client to your local PostgreSQL instance:

1.  **Open a tunnel:**
    ```bash
    larakube tunnel postgres
    ```
2.  **Use the credentials:**
    - **Host:** `127.0.0.1`
    - **User:** `postgres`
    - **Database:** `laravel`

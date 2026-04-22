---
sidebar_position: 2
title: MariaDB for Laravel
description: Professional MariaDB implementation for Laravel on Kubernetes. Learn about LTS stability, security defaults, and secure tunneling for your cluster.
---
# MariaDB

MariaDB is a community-developed, commercially supported fork of the MySQL relational database management system.

## Implementation Details
- **Image:** `mariadb:11.8` (LTS)
- **Port:** `3306`
- **Default User:** `laravel`

## 🔐 Security & Initialization
LaraKube treats MariaDB with the same level of security as MySQL:
- **Application User:** Scoped `laravel` user is created automatically.
- **Encrypted Secrets:** Passwords are injected securely into the cluster.
- **Stability:** Pinned to the current Long-Term Support (LTS) version for maximum reliability.

## 🔌 Connection
To connect a GUI client to your local MariaDB instance:

1.  **Open a tunnel:**
    ```bash
    larakube tunnel mariadb
    ```
2.  **Use the credentials:**
    - **Host:** `127.0.0.1`
    - **User:** `laravel`
    - **Database:** `laravel`

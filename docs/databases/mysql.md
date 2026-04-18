---
sidebar_position: 2
---
# MySQL

MySQL is the world's most popular open-source database, known for its performance and ease of use.

## Implementation Details
- **Image:** `mysql:8.0`
- **Port:** `3306`
- **Default User:** `laravel`

## 🔐 Security & Initialization
LaraKube provides a hardened MySQL setup:
- **Application User:** Instead of using the `root` account, LaraKube creates a dedicated `laravel` user with scoped permissions.
- **Secure Passwords:** All credentials are managed via Kubernetes `Secret` resources, ensuring they are never stored in plain text.
- **Readiness Probes:** Uses `mysqladmin ping` to ensure the database is fully ready to handle connections before your application starts.

## 🔌 Connection
To connect a GUI client to your local MySQL instance:

1.  **Open a tunnel:**
    ```bash
    larakube tunnel mysql
    ```
2.  **Use the credentials:**
    - **Host:** `127.0.0.1`
    - **User:** `laravel`
    - **Database:** `laravel`

---
sidebar_position: 2
title: MinIO S3 Storage
description: High-performance S3 storage with MinIO for Laravel. Automated Ingress setup for the MinIO Console and zero-config integration for your S3 assets.
---
# MinIO

MinIO is a high-performance, S3-compatible object store. It is the most widely used self-hosted storage solution in the Laravel ecosystem.

## Implementation Details
- **S3 API Port:** `9000`
- **Console Port:** `9001`
- **Service Name:** `laravel-minio`
- **Default User:** `larakube`
- **Default Secret:** `larakubesecretpassword`

## 🌐 Local Access
LaraKube automatically creates a local Ingress for the MinIO Console:
- **Dashboard URL:** `https://s3-console.your-project.dev.test`
- **Credentials:** Use the default user and secret mentioned above.

## 🛠 Initialization
MinIO requires a one-time manual bucket creation to work with Laravel:
1.  Visit the Console URL listed above.
2.  Login with the default credentials.
3.  Create a bucket named **`laravel`**.

## 🚀 Why choose MinIO?
MinIO is perfect if you want a proven, feature-rich storage solution with an excellent web-based management interface. It is highly compatible with almost every S3 tool and library available.

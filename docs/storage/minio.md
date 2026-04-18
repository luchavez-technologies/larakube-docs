---
sidebar_position: 2
---
# MinIO

MinIO is a high-performance, S3-compatible object store. It is the most widely used self-hosted storage solution in the Laravel ecosystem.

## Implementation Details
- **Port:** `9000` (API)
- **Console Port:** `9001` (Dashboard)
- **Default User:** `minioadmin`
- **Default Secret:** `minioadmin`

## 🌐 Local Access
LaraKube automatically creates a local Ingress for the MinIO Console:
- **Dashboard URL:** `https://s3-console.your-project.local`
- **Credentials:** Use the default user and secret mentioned above.

## 🚀 Why choose MinIO?
MinIO is perfect if you want a proven, feature-rich storage solution with an excellent web-based management interface. It is highly compatible with almost every S3 tool and library available.

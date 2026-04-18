---
sidebar_position: 3
---
# SeaweedFS

SeaweedFS is an independent, highly scalable distributed storage system. It is designed to be fast for both small and large files.

## Implementation Details
- **S3 Port:** `8333`
- **Master Port:** `9333`

## 🌐 Local Access
LaraKube configures dedicated local URLs for SeaweedFS:
- **S3 API URL:** `https://s3.your-project.local`
- **Admin Dashboard:** `https://s3-admin.your-project.local`
- **Credentials:** Use `any` for both Access Key and Secret Key for local development.

## 🚀 Why choose SeaweedFS?
Choose SeaweedFS if your application handles a massive number of small files (like user-uploaded thumbnails or small documents). It is significantly more lightweight than MinIO and offers incredible performance due to its unique "Seaweed" architecture.

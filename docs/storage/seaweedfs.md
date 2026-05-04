---
sidebar_position: 3
title: SeaweedFS Distributed Storage
description: Scalable distributed storage with SeaweedFS for Laravel. Ideal for high-performance asset handling, featuring dedicated S3 API and admin dashboards.
---
# SeaweedFS

SeaweedFS is an independent, highly scalable distributed storage system. It is designed to be fast for both small and large files.

## Implementation Details
- **S3 Port:** `8333`
- **Master Port:** `9333`
- **Service Name:** `laravel-seaweedfs`

## 🌐 Local Access
LaraKube configures dedicated local URLs for SeaweedFS:
- **S3 API URL:** `https://s3.your-project.dev.test`
- **Admin Dashboard:** `https://s3-admin.your-project.dev.test`
- **Credentials:** Use `any` for both Access Key and Secret Key for local development.

## 🛠 Initialization
SeaweedFS is highly automated:
*   **Automatic Buckets**: SeaweedFS usually handles bucket allocation automatically upon the first write request from your Laravel application. No manual CLI setup is typically required.

## 🚀 Why choose SeaweedFS?
Choose SeaweedFS if your application handles a massive number of small files (like user-uploaded thumbnails or small documents). It is significantly more lightweight than MinIO and offers incredible performance due to its unique "Seaweed" architecture.

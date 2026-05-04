---
sidebar_position: 4
title: Garage Object Storage
description: Lightweight, Rust-based distributed object storage for Laravel. Learn how to configure Garage S3 API and local URLs within your LaraKube cluster.
---
# Garage

Garage is a modern, distributed object storage service tailored for self-hosting. Written in Rust, it aims to be lightweight, efficient, and resilient.

## Implementation Details
- **S3 API Port:** `3900`
- **Web Port:** `3902`
- **Admin Port:** `3903`
- **Service Name:** `laravel-garage`

## 🌐 Local Access
LaraKube sets up a secure local URL for the S3 API:
- **S3 URL:** `https://s3.your-project.dev.test`

## 🛠 Initialization
Garage requires a one-time manual initialization after you run **`larakube up`** for the first time:

```bash
# 1. Get your unique Node ID
larakube exec --service=garage "/garage status"

# 2. Assign the layout (Replace <ID_PREFIX> with the first 4 chars of your Node ID)
larakube exec --service=garage "/garage layout assign <ID_PREFIX> --capacity 1GB --zone local --tag default"

# 3. Apply the layout
larakube exec --service=garage "/garage layout apply --version 1"

# 4. Create your S3 credentials
larakube exec --service=garage "/garage key create larakube"

# 5. Create your bucket
larakube exec --service=garage "/garage bucket create laravel"

# 6. Link credentials to the bucket
larakube exec --service=garage "/garage bucket allow --read --write laravel --key larakube"
```

### 🗝 Syncing to Laravel
After Step 4, Garage will output a machine-generated **Key ID** and a **Secret key**. You must copy these to your project:
1.  **Key ID** -> `AWS_ACCESS_KEY_ID`
2.  **Secret key** -> `AWS_SECRET_ACCESS_KEY`
3.  **Sync**: Run `larakube up` to push the new keys to your application pods.

## 🚀 Why choose Garage?
Garage is the perfect choice for modern, distributed architectures. Its Rust-based core makes it extremely memory-efficient and fast. It excels in clusters where simplicity and resilience are more important than a complex feature set.

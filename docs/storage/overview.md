---
sidebar_position: 1
title: Object Storage Overview
description: Add private S3-compatible storage to your Laravel Kubernetes cluster. Compare MinIO, SeaweedFS, and Garage, with zero-config integration for each.
---
# Object Storage Overview

LaraKube CLI allows you to include a private, S3-compatible Object Storage engine directly inside your cluster. This is the recommended way to handle file uploads (avatars, documents, assets) in a cloud-native Laravel application.

## ⚡️ Zero-Config Integration

Whichever engine you pick, LaraKube CLI automatically:
1.  **Installs Dependencies:** Adds `league/flysystem-aws-s3-v3` to your PHP container.
2.  **Configures Laravel:** Injects the correct `AWS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` into your `.env`.
3.  **Sets Path-Style URLs:** Automatically enables `AWS_USE_PATH_STYLE_ENDPOINT=true`, which is required for self-hosted S3 services.

Forgot to add storage during project creation? Add it anytime:

```bash
larakube add MinIO   # or SeaweedFS / Garage
```

## 🏛 Comparing engines

| Engine | S3 API port | Best for | Setup |
|---|---|---|---|
| **[MinIO](#minio)** | `9000` (console `9001`) | The most widely-used, feature-rich option — best web console | One-time bucket creation via the console |
| **[SeaweedFS](#seaweedfs)** | `8333` | Massive numbers of small files (thumbnails, small docs) | Fully automatic — buckets allocate on first write |
| **[Garage](#garage)** | `3900` | Modern, Rust-based, memory-efficient, resilient clusters | One-time CLI initialization (layout + key + bucket) |

## MinIO

Implementation details: service `laravel-minio`, default user `larakube`, default secret `larakubesecretpassword`.

LaraKube CLI creates a local Ingress for the MinIO Console at `https://s3-console.your-project.kube` (log in with the default credentials above). MinIO requires one manual step: visit the console and create a bucket named **`laravel`**.

Choose MinIO if you want a proven, feature-rich solution with an excellent web-based management interface — it's highly compatible with almost every S3 tool and library available.

## SeaweedFS

Implementation details: service `laravel-seaweedfs`, master port `9333`. Local URLs: S3 API at `https://s3.your-project.kube`, admin dashboard at `https://s3-admin.your-project.kube` (use `any` for both Access Key and Secret Key locally).

SeaweedFS is highly automated — it handles bucket allocation automatically on the first write request from your Laravel application, so there's typically no manual setup at all.

Choose SeaweedFS if your application handles a massive number of small files (like user-uploaded thumbnails). It's significantly more lightweight than MinIO and offers strong performance due to its distributed "Seaweed" architecture.

## Garage

Implementation details: service `laravel-garage`, web port `3902`, admin port `3903`. Local URL: `https://s3.your-project.kube`.

Garage requires one-time manual initialization after your first `larakube up`:

```bash
# 1. Get your unique Node ID
larakube exec --service=garage "/garage status"

# 2. Assign the layout (replace <ID_PREFIX> with the first 4 chars of your Node ID)
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

After step 4, Garage outputs a machine-generated **Key ID** and **Secret key** — copy them to `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively, then run `larakube up` to push the new keys to your application pods.

Choose Garage for modern, distributed architectures where simplicity and resilience matter more than a complex feature set — its Rust-based core is extremely memory-efficient and fast.

---
sidebar_position: 1
title: Object Storage Overview
description: Add private S3-compatible storage to your Laravel Kubernetes cluster. Support for MinIO, SeaweedFS, and Garage with zero-config integration.
---
# Object Storage Overview

LaraKube allows you to include a private, S3-compatible Object Storage directly inside your cluster. This is the recommended way to handle file uploads (avatars, documents, assets) in a cloud-native Laravel application.

## 🏛 Supported Engines
Choose the engine that best fits your project's scale and performance needs:

- **MinIO:** The classic, most popular S3-compatible store in the Laravel community.
- **SeaweedFS:** A high-performance, distributed system optimized for millions of small files.
- **Garage:** A modern, lightweight distributed storage engine written in Rust.

## ⚡️ Zero-Config Integration
When you select an Object Storage engine, LaraKube automatically:
1.  **Installs Dependencies:** Adds `league/flysystem-aws-s3-v3` to your PHP container.
2.  **Configures Laravel:** Injects the correct `AWS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` into your `.env`.
3.  **Sets Path-Style URLs:** Automatically enables `AWS_USE_PATH_STYLE_ENDPOINT=true`, which is required for self-hosted S3 services.

## 🔄 Adding Storage Later
Forgot to add storage during project creation? You can add it anytime using the `add` command:

```bash
larakube add MinIO
```
LaraKube will scaffold the manifests, update your configuration, and install the necessary PHP drivers for you.

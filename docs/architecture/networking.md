---
sidebar_position: 8
title: Hybrid Networking Reference
description: Understand how LaraKube CLI manages internal pod-to-pod communication and external browser-to-cloud traffic.
---
# 🌍 Hybrid Networking

LaraKube CLI uses a **Hybrid Networking** model to ensure high performance and security. It distinguishes between traffic that stays inside the cluster and traffic that comes from the public internet.

## 🔄 Internal vs. External
When configuring services like MinIO, Meilisearch, or Reverb, you will often encounter two different URLs in your `.env` file.

### 1. Internal Endpoints (`AWS_ENDPOINT`)
These are used for **Pod-to-Pod** communication.
-   **Pattern**: `http://{service}.{namespace}.svc.cluster.local`
-   **Example**: `http://minio.minio.svc.cluster.local:9000`
-   **Benefit**: Extremely low latency and high security, as the traffic never leaves the private Kubernetes network.

### 2. External URLs (`AWS_URL`)
These are used for **Browser-to-Cloud** communication.
-   **Pattern**: `https://{service}.{domain}.com`
-   **Example**: `https://minio.larakube.com`
-   **Benefit**: Allows users or external tools to interact with your services via the public internet with automated SSL.

---

## 🛰 Service Subdomains
LaraKube CLI follows standard subdomain patterns to keep your infrastructure organized. When you add a service via `larakube add`, the CLI automatically suggests these mappings:

| Service | Standard Subdomain | Purpose |
| :--- | :--- | :--- |
| **Reverb** | `reverb.{domain}` | Real-time WebSocket broadcasting |
| **MinIO** | `minio.{domain}` | Object storage browser/API access |
| **Meilisearch** | `search.{domain}` | Full-text search API |
| **Typesense** | `typesense.{domain}` | Alternative search API |
| **Console** | `console.{domain}` | LaraKube Console visual command center |

---

## 🏗 Ingress Architecture
LaraKube CLI utilizes **Traefik v3** as the primary Ingress Controller.

-   **Routing**: Based on the `Host` header.
-   **SSL**: Automatically provisioned via Let'sEncrypt (Production) or LaraKube Local CA (Local).
-   **Port Mapping**:
    -   **HTTP**: 80 (External) ➜ 8080 (FrankenPHP)
    -   **HTTPS**: 443 (External) ➜ 8443 (Nginx/Apache)

## 🛡 Network Security
By default, databases (MySQL, Postgres, Redis) are **not** exposed to the public internet. They are only reachable via internal endpoints or through a secure SSH tunnel:

```bash
larakube tunnel mysql
```

*This ensures your data remains protected even while providing easy local access for development tools.*

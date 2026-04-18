---
sidebar_position: 1
---
# Deployment Overview

LaraKube is designed to be cluster-agnostic. Whether you prefer the simplicity of a specialized VPS or the massive scale of a tech giant, your manifests will work seamlessly across any standard Kubernetes provider.

## 🚀 Choosing Your Cluster

Every Artisan has different needs. Here is our guide to choosing the right home for your application:

### 1. The "Specialists" (Recommended for Most)
These providers offer Managed Kubernetes services that are incredibly simple to set up and very affordable.

- **DigitalOcean (DOKS):** Beloved by the Laravel community for its simple UI and perfect integration with their Load Balancers.
- **Civo:** Built on K3s, Civo is the fastest way to get a cluster running (under 90 seconds). Incredibly cost-effective.
- **Linode (LKE):** A solid, reliable choice with predictable pricing and a straightforward management experience.

### 2. The "Enterprise" Giants (For Massive Scale)
For applications reaching millions of users, these providers offer the full breadth of cloud services.

- **AWS (EKS):** The industry heavyweight. Robust but comes with more complex networking requirements.
- **Google Cloud (GKE):** Generally considered the most automated and advanced Kubernetes platform available.
- **Azure (AKS):** The go-to for enterprise environments already using the Microsoft ecosystem.

## 🏗 The Staging Strategy
LaraKube makes it easy to test your code in a production-like environment before going live. Use the `env` command to create a `staging` environment in seconds:

```bash
larakube env staging
```
This scaffolds a new overlay that you can use with `.env.staging` for a true "pre-flight" check.

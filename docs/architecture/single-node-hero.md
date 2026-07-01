---
sidebar_position: 7
title: The "Single-Node Hero" Strategy
description: How LaraKube CLI runs a professional, cost-effective VPS for only $4-12/mo — the $6/mo 1GB baseline, HostPort ingress, automated swap, and remote build offloading.
---
# 🚀 The "Single-Node Hero" Strategy

The **Single-Node Hero** is the first major milestone in your scaling journey. It bridges the gap between your laptop and a full multi-node managed cluster, providing a professional production environment on a budget (starting around **$4-12/mo**).

## 💡 The Core Concept
Traditional Kubernetes deployments often require expensive **Load Balancers** (costing ~$15-30/mo) just to get traffic into your cluster. The Single-Node Hero strategy eliminates this cost by utilizing the server's own networking stack for ingress.

## 💾 Why the $6/mo, 1GB Baseline?

Running K3s on 512MB is technically possible with heavy swapping, but it isn't production-stable. LaraKube CLI treats a **$6/mo, 1GB RAM VPS** as the Minimum Viable Server because that headroom buys:
- **Control Plane Breathing Room**: Kubernetes control plane components (kube-apiserver, etcd, etc.) need consistent memory to avoid jitter.
- **Service Stability**: Your core Laravel services (Web, Horizon, Reverb) need guaranteed RAM to handle traffic spikes.
- **Zero-Downtime Rollouts**: During a deploy, Kubernetes runs new and old pods side by side briefly. Under 1GB, that handoff spike frequently causes **TLS timeouts** or worker crashes.

## 🛠 Technical Implementation

### 1. HostPort Ingress (Direct Access)
Instead of a LoadBalancer service, LaraKube CLI configures the Traefik Ingress Controller to use **HostPorts** on ports 80 and 443. This means Traefik listens directly on the VPS's public IP address, saving you the monthly load balancer fee while maintaining professional traffic management.

### 2. Automated Swap (Low-RAM Stability)
Small VPS instances (like a 1GB or even 512MB droplet) can be unstable under heavy Kubernetes workloads. When you run `larakube cloud:init`, LaraKube CLI automatically:
-   Detects the available memory.
-   Creates and enables a **1GB Swap file** on the server.
-   Ensures your cluster remains stable even when running multiple Laravel services (Web, Horizon, Reverb) on minimal hardware.

### 3. Built-in ACME (Let'sEncrypt)
SSL is non-negotiable for production. LaraKube CLI's Cloud Pilot automatically configures Traefik with the **ACME (Let'sEncrypt)** HTTP challenge. Once your domain is pointed to your VPS IP, LaraKube CLI handles the certificate provisioning and renewals automatically.

### 4. Remote Build Offloading
Since a 1GB droplet is dedicated to running your app, LaraKube CLI forces all CPU/RAM-heavy build processes (Docker, npm, composer) onto the GitHub Actions runner instead. This "Secret Sauce" is what lets a small VPS run a full K8s stack flawlessly without crashing during deployments.

## 🏆 Why It Matters
-   **Cost Efficiency**: Save ~$200-400/year by skipping cloud-provider load balancers.
-   **Production Parity**: Your application still runs on Kubernetes, ensuring that when you're ready to "graduate" to multi-node HA, your manifests are already proven and ready.
-   **Simplicity**: One command (`larakube cloud:init`) transforms a fresh Linux box into a hardened, production-ready Kubernetes node.

## 🏁 Getting Started
Ready to deploy? Ensure your domain is pointed to your VPS IP, then run:

```bash
larakube cloud:init
```

*Follow the prompts to secure your server, install K3s, and deploy the Single-Node Traefik stack.*

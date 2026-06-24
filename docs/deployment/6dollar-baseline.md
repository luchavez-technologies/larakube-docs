---
sidebar_position: 4
title: The $6/mo Baseline
description: How LaraKube CLI establishes a robust production environment on a cost-effective 1GB VPS.
---
# 📦 The $6/mo Baseline

Running professional-grade Kubernetes requires enough overhead for the control plane. We have established the **$6/mo VPS (1GB RAM)** as the official LaraKube CLI Minimum Viable Server.

## 💡 Why 1GB RAM?
While running K3s on 512MB is technically possible with heavy swapping, it is not production-stable. The 1GB baseline ensures:
- **Control Plane Breathing Room**: Kubernetes control plane components (Kube-apiserver, etcd, etc.) require consistent memory to prevent jitter.
- **Service Stability**: Your core Laravel services (Web, Horizon, Reverb) need guaranteed RAM to handle traffic spikes.
- **Zero-Downtime Rollouts**: During a deployment, Kubernetes spins up new pods while terminating old ones. With <1GB of memory, the spike in resource usage during this "handoff" period frequently leads to **TLS timeouts** or worker crashes.

## 🛠 Stability Safeguards
When you run `larakube cloud:init` on your baseline server, we enforce two critical stability measures:

1.  **Automated Swap File**: We automatically provision a **1GB Swap file**. This provides a vital "safety net" during high-load events, ensuring that the kernel doesn't aggressively terminate your application processes.
2.  **Remote Build Offloading**: Since your 1GB droplet is dedicated to running your app, LaraKube CLI forces all CPU/RAM-heavy build processes (Docker, npm, composer) to the GitHub Actions runner. This is the **"Secret Sauce"** that allows a small VPS to run a full K8s stack flawlessly without crashing during deployments.

*By adhering to this baseline, you get a production environment that is stable, performant, and ready for real traffic, all for the price of a cup of coffee.*

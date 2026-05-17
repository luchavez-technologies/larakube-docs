---
sidebar_position: 5
title: LaraKube Console
description: Learn about the LaraKube Console, the professional Kubernetes control plane for your Laravel fleet.
---
# 🧠 LaraKube Console

The **LaraKube Console** is the professional Kubernetes control plane and visual command center for your entire orchestration ecosystem. While the CLI handles the "doing," the Console handles the "observing," "monitoring," and "auditing."

## 🏗 Control Plane Architecture
The Console is built on the **Filament v5 Schema system**, providing a high-fidelity, data-dense interface designed for professional infrastructure management:

- **CLI-as-Writer**: The LaraKube CLI is the primary "Writer." It is the only tool that modifies your local manifests and pushes changes to the Kubernetes cluster.
- **Console-as-Observer**: The Console acts as a robust **Observer**. It utilizes a high-performance **Saloon-powered API integration** to communicate directly with the Kubernetes API, providing real-time visibility into Pods, Deployments, Services, and Ingresses.
- **RBAC-Powered**: The Console operates via a dedicated `larakube-dashboard` ServiceAccount with surgical RBAC permissions, allowing for safe log streaming, event monitoring, and rollout restarts.

## 🚀 Launching the Console
The Console runs directly inside your local Kubernetes cluster. You can launch it at any time using:

```bash
larakube web
# or
larakube console
```

This will ensure the Console is installed, the domain `https://console.dev.test` is mapped, and then open it in your default browser.

## 🛠 Features

### 1. Global Cluster Monitor
- **Multi-Tabbed Visibility:** Bird's-eye view into project health, cluster-wide warnings, and hardware node pressure.
- **Resource Explorer:** Drill down into every Kubernetes resource (Pods, Deployments, Services, Events) with color-coded health status.

### 2. Project Command Center
- **Infrastructure Tabs:** Searchable, real-time views of a project's dedicated infrastructure.
- **Live Logs:** High-performance terminal UI with auto-scrolling and pod selection for real-time debugging.
- **Operational Actions:** Perform rollout restarts or scale deployments directly from the UI.

### 3. Path-Aware Hybrid Management
The Console is designed to work across different host operating systems. It manages **Hybrid Paths**:
- **Internal Paths**: Uses container-native paths for all Kubernetes logic.
- **Translated Host Paths**: Displays host-appropriate paths (macOS/Linux/Windows) for you, ensuring that you always know where your code lives on your machine.

### 4. Audit & History
The Console stores a complete audit trail of every orchestration command run via the CLI or UI. This historical context is vital for both human debugging and AI-powered root cause analysis.

## 🤖 The "Master Architect" MCP
The Console serves as the **Master Architect MCP** server. When you use AI agents in the web or cloud, they connect to the Console to understand the historical context and state of your projects, making them significantly more accurate than stateless agents.

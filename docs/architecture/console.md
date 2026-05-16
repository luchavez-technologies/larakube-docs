---
sidebar_position: 5
title: LaraKube Console
description: Learn about the LaraKube Console, the visual command center for your Laravel Kubernetes fleet.
---
# 🧠 LaraKube Console

The **LaraKube Console** is the centralized brain of your orchestration ecosystem. While the CLI handles the "doing," the Console handles the "remembering" and "monitoring."

## 🏗 Observer Architecture
LaraKube follows a robust **Observer Architecture** that separates administrative action from state visualization:

- **CLI-as-Writer**: The LaraKube CLI is the primary "Writer." It is the only tool that modifies your local manifests and pushes changes to the Kubernetes cluster.
- **Console-as-Scanner**: The Console acts as the "Scanner" and "Observer." It continuously monitors the state of your cluster and reads your project directories to provide a high-fidelity visual representation of your fleet.

This separation ensures that your local filesystem remains the "Source of Truth," while the Console provides the "State of Truth" from the cluster.

## 🚀 Launching the Console
The Console runs directly inside your local Kubernetes cluster. You can launch it at any time using:

```bash
larakube console
# or
larakube web
```

This will ensure the Console is installed, the domain `https://console.dev.test` is mapped, and then open it in your default browser.

## 🛠 Features

### 1. Project Management & Control
- **Visual Scaffolding:** Create new masterpieces via a step-by-step wizard.
- **Project Discovery:** Automatically scan your code directories to import existing LaraKube projects.
- **Project Down:** Terminate an entire project environment directly from the UI, cleanly removing the Kubernetes namespace and associated resources.
- **Infrastructure Scaling:** Scale your deployments (Web, Horizon, Reverb) up or down with a simple slider.

### 2. Live Fleet Monitoring
- **Pod Status:** See real-time health badges for every service in your cluster.
- **Streaming Logs:** Debug your application by streaming live logs from any pod directly in the web UI.
- **Cluster Events:** Monitor low-level Kubernetes events like `ImagePullBackOff` or `Pending` volumes.

### 3. Path-Aware Hybrid Management
The Console is designed to work across different host operating systems. It manages **Hybrid Paths**:
- **Internal Paths**: Uses container-native paths for all Kubernetes logic.
- **Translated Host Paths**: Displays host-appropriate paths (macOS/Linux/Windows) for you, ensuring that you always know where your code lives on your machine.

### 4. Audit & History
The Console stores a complete audit trail of every orchestration command run via the CLI or UI. This historical context is vital for both human debugging and AI-powered root cause analysis.

## 🤖 The "Brain" for AI
The Console serves as the **Master Architect MCP** server. When you use AI agents in the web or cloud, they connect to the Console to understand the historical context and state of your projects, making them significantly more accurate than stateless agents.

---
sidebar_position: 0
title: Introduction to LaraKube CLI
description: Get started with LaraKube CLI, the industrial-strength Kubernetes orchestrator for Laravel. Learn about the Standalone Engine, Shared Storage, and Proxy-First workflow.
---
# 🌟 Introduction

LaraKube is a high-performance **Kubernetes Control Plane** for Laravel. It bridges the gap between local development and cloud-scale infrastructure, treating architecture as a first-class citizen.

## 🚀 The Standalone Engine
LaraKube is distributed as a **self-contained binary** for Linux and macOS, featuring its own embedded PHP runtime. You no longer need to install PHP, Composer, or Node.js on your machine. As long as you have **Docker** and **kubectl**, you are ready to orchestrate masterpieces.

## 💾 Shared Storage (Workload Parity)
LaraKube implements a sophisticated **Shared Storage Architecture**. By using a synchronized volume across your Web, Worker, and Scheduler pods, we achieve true **Workload Parity**. 
- **Atomic Updates:** File changes (like `storage/` or `bootstrap/cache`) are instantly visible across all pods.
- **Sidecar Optimizations:** Support services run with minimal overhead, sharing the same application state as your main web process.

## 🔌 Proxy-First Workflow
Stop jumping in and out of containers. LaraKube provides transparent proxy commands that execute directly inside your Kubernetes pods:
- `larakube art migrate`
- `larakube composer require`
- `larakube npm run dev`

## 🧠 LaraKube Console (The Brain)
The **LaraKube Console** is your professional Kubernetes Control Plane and visual command center. Accessible at `https://console.kube`, it provides:
- **Global Fleet Visibility:** Real-time health monitoring of all projects in your cluster.
- **Master Memory:** A centralized database of project history, audit logs, and architectural state.
- **High-Fidelity Diagnostics:** Live pod logs and real-time cluster event monitoring via a data-dense UI.

## 🤖 Dual-Brain AI (MCP)
LaraKube is built for the age of AI agents. We provide a specialized **Dual-MCP (Model Context Protocol)** architecture that empowers AI agents with professional-grade orchestration capabilities:

1.  **The Local Mechanic (`larakube-cli`):** A project-scoped MCP server with **6 expert tools** for modifying local code, patching blueprints, and running orchestration "verbs" (`up`, `down`, `add`).
2.  **The Master Architect (`larakube-console`):** A cluster-wide MCP server with **9 fleet tools** for monitoring project health, streaming diagnostic logs, and managing your entire Kubernetes fleet.

## 🚀 The Vision: Container-First Laravel
By bringing Kubernetes to the local development environment, we ensure that your code is "Production-Ready" from the very first line you write.

LaraKube stands on the shoulders of giants. We would like to express our deepest gratitude to [Server Side Up](https://serversideup.net/). Their world-class [PHP Docker Images](https://serversideup.net/open-source/docker-php/) are the bedrock of this project, providing the stability and performance that make professional Laravel-on-Kubernetes possible.

LaraKube empowers you to create as many masterpieces as your imagination allows. But at the end of the day, the real magic happens when you **share your work with the world**. 

Whether you are deploying to a small cluster for friends or a global scale-out infrastructure for millions, LaraKube provides the **Production-Grade Blueprints** and **CI/CD Pipelines** to make that transition seamless.

---

## ⭐ Star the Project
LaraKube is a labor of love for the Laravel community. If this tool has helped you launch a masterpiece, **please consider giving us a star on GitHub!**

-   **[LaraKube CLI](https://github.com/luchavez-technologies/larakube-cli)**: The core orchestration engine.
-   **[LaraKube Console](https://github.com/luchavez-technologies/larakube-console)**: The visual control plane.
-   **[LaraKube Docs](https://github.com/luchavez-technologies/larakube-docs)**: Our high-context guides and recipes.

---

### 🎨 Craft the Future
With LaraKube and the **Laravel AI SDK**, the only limit is your imagination. Scaffold your next architectural masterpiece today.

```bash
larakube new my-masterpiece --fast
```

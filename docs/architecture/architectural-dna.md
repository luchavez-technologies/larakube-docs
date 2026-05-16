---
sidebar_position: 2
title: Architectural DNA
description: Learn how LaraKube CLI uses UUIDs and persistent identity to track project DNA, activity history, and ensure cluster consistency for Laravel apps.
---
# Architectural DNA

LaraKube CLI treats infrastructure as code, but it also treats every project as a unique, tracked entity with its own "DNA."

## 🧬 Persistent Identity (UUID)
Every project managed by LaraKube is assigned a permanent **UUID** (Universally Unique Identifier) stored in its `.larakube.json` file.

### Why this matters:
- **Moving Projects**: If you move your project folder or rename it, LaraKube will recognize the project by its ID the next time you run a command.
- **Audit Trails**: Your activity history and chat memory are linked to this ID, ensuring consistency even if your local file path changes.
- **Cluster Sync**: This ID allows the CLI to verify that the manifests in your repository match the ones currently running in the Kubernetes namespace.

## 📜 Centralized Memory (SQLite)
Instead of scattering logs across different projects, the **LaraKube Console** maintains a global SQLite database. This provides a unified history for all your masterpieces.

### What is tracked:
- **Operational Verbs:** Every `up`, `down`, `heal`, or `purge` command.
- **Architectural Evolution:** When you add features or swap databases via the CLI or UI.
- **AI Diagnostics:** Full reports from the `doctor` command and AI-powered fix history.

### Real-time Sync
Whenever you run a command via the CLI, it "calls home" to the Console API to register the event. This ensures your visual dashboard is always accurate, even if you prefer working in the terminal.

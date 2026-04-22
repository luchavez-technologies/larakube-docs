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

## 📜 Professional Audit Trail
LaraKube CLI maintains a global SQLite database on your machine to provide a professional audit trail of every major event.

### What is tracked:
- **Architectural Changes**: Adding features, removing services, or swapping databases.
- **Operational Events**: Cluster launches (`up`), pauses (`stop`), and resumes (`start`).
- **Safety Overrides**: When a developer intentionally ignores a "Project Nesting" warning.
- **Self-Healing**: Every time `larakube heal` regenerates your manifests.

You can view this history at any time using:
```bash
larakube project:activity
```

---
sidebar_position: 10
title: AI-Native Orchestration
description: LaraKube CLI is the first AI-native Kubernetes orchestrator. Learn about the Local Mechanic (CLI MCP) and Master Architect (Console MCP).
---
# 🤖 AI-Native Orchestration

LaraKube CLI is the first Kubernetes orchestrator designed for the age of AI. We provide a **Dual-MCP** architecture that gives AI agents both local execution power and global fleet visibility.

## 🔌 Model Context Protocol (MCP)

LaraKube CLI implements two distinct MCP servers to provide AI agents (like Gemini CLI, Claude Desktop, or Cursor) with the perfect balance of context.

### 🛠 1. The Local Mechanic (`larakube-cli`)
The CLI MCP handles **Local Execution**. It has direct access to your source code, `.env` files, and orchestration verbs.

- **Status**: 🟢 Ready (6 Expert Tools)
- **Best For**: Scaffolding new projects, adding services, and patching local configuration.
- **Tools**:
  - `inspect-local-code`: Deep-scan your project for architectural DNA.
  - `local-health-check`: Verify Docker, K3d, and host networking status.
  - `orchestrate-verb`: Run core verbs like `up`, `down`, `heal`, and `add`.
  - `patch-blueprint`: Surgically modify `.larakube.json`.
  - `patch-local-env`: Update your local `.env` configuration.
  - `run-proxy`: Execute `artisan`, `composer`, or `npm` inside the cluster.

#### One-Click Registration
You can automatically register the Local Mechanic with your favorite AI tools:
```bash
# Register with Gemini CLI
larakube mcp:register --gemini

# Register with Claude Desktop
larakube mcp:register --claude

# Register with all supported tools
larakube mcp:register --all
```

---

### 🧠 2. The Master Architect (`larakube-console`)
The Console MCP handles **Global Observability**. It lives inside your cluster and has access to real-time logs, events, and project history.

- **Status**: 🟢 Ready (9 Fleet Tools)
- **Best For**: Debugging pod failures, analyzing fleet health, and historical audit trails.
- **Transport**: SSE (Server-Sent Events) via your console URL.
- **Tools**:
  - `get-fleet-status`: Bird's-eye view of all registered projects.
  - `list-pods`: Real-time health check of all project containers.
  - `get-project-logs`: Fetch the latest logs for any project pod.
  - `diagnose-pod`: Combined log and status analysis for failing services.
  - `get-cluster-events`: Check for Kubernetes warnings and failures.
  - `explain-architecture`: AI analysis of a project's infrastructure.
  - `get-project-config`: Read the architectural DNA from the cluster.
  - `fetch-audit-trail`: Historical activity logs for projects or the entire fleet.
  - `search-documentation`: Real-time RAG search of the LaraKube CLI docs.

#### Setup Guide
To add the Master Architect to your AI tool, use the **SSE Transport** pointing to your Console URL:

```json
{
  "mcpServers": {
    "larakube-console": {
      "url": "https://console.kube/mcp"
    }
  }
}
```

---

### 💡 Pro Tip: Which one should I use?
- Use the **Local Mechanic (CLI)** when you need the AI to **do things** (build, up, add, change code).
- Use the **Master Architect (Console)** when you need the AI to **understand things** (why is it failing? what happened yesterday?).

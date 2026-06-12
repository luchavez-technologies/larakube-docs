---
sidebar_position: 3
title: Dual-MCP Architecture
description: Understand how LaraKube uses two distinct MCP servers to provide AI agents with both local and global context.
---
# 🤖 Dual-MCP Architecture

LaraKube is the first orchestrator to implement a **Dual-MCP (Model Context Protocol)** system. This provides AI agents with the perfect balance of "Local Reach" and "Global Memory."

## 🛠 1. The Local Mechanic (CLI MCP)
The CLI binary acts as the **Local Mechanic**. It has direct access to your host machine's files and terminal.

-   **Primary Context:** Current working directory, source code, and local `.env` files.
-   **Transport:** `stdio` (Incredibly fast for local tools).
-   **Best For:** Cursor, Windsurf, and local terminal agents.
-   **Capabilities:** Modifying code, patching `.env`, and running orchestration verbs like `up` or `add`.

## 🧠 2. The Master Architect (Console MCP)
The Console application acts as the **Master Architect**. It has access to the global project registry and history.

-   **Primary Context:** Project fleet status, historical audit logs, and remote cluster state.
-   **Transport:** `SSE` (Accessible via web URL).
-   **Best For:** Web-based agents like Gemini, Claude Web, or remote management tools.
-   **Capabilities:** Analyzing fleet health, debugging historical failures, and managing cross-project dependencies.

## 🤝 How they work together
When you ask an AI agent to "Add Redis to this project," the **Local Mechanic** handles the file changes, while the **Master Architect** provides the historical context of why the previous attempt might have failed, ensuring a higher success rate.

### Configuration
To register these servers with your AI tools:

-   **Local Agent:** `larakube mcp`
-   **Web/Remote Agent:** `https://console.kube/mcp`

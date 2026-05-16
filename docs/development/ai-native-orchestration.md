---
sidebar_position: 10
title: AI-Native Orchestration
description: LaraKube is the first AI-native Kubernetes orchestrator. Learn about the Local Mechanic (CLI MCP) and Master Architect (Console MCP).
---
# 🤖 AI-Native Orchestration

LaraKube is the first Kubernetes orchestrator designed for the age of AI. We provide a **Dual-MCP** architecture that gives AI agents both local execution power and global fleet visibility.

## 💬 Chat & Ask Commands
Interact with your Kubernetes cluster and official documentation using natural language. 

### `larakube chat`
Enter an interactive session for ongoing troubleshooting or multi-step architectural planning.
- **Fresh Start**: Use `larakube chat --new` to explicitly start a new conversation and clear previous context for the current project.

### `larakube ask`
LaraKube's "Power Action" command. Perfect for single-shot queries and direct actions.
```bash
larakube ask "Why is my database pod crashing?"
```

---

## 🧠 Smart Context & Memory

### Project-Centric Memory
LaraKube features **CWD-Scoped History**. This means the AI remembers your previous conversations specifically for the directory you are currently in. 
- Move to a new project: Get a fresh AI context.
- Return to a previous folder: Instantly resume where you left off.
- Email-Agnostic: Your project history persists even if you change your global LaraKube configuration.

### Knowledge-Integrated AI
The LaraKube AI is no longer limited to "pre-trained" knowledge. It now searches the **Official Documentation** in real-time. It can find:
- Architectural flags for `larakube new`.
- Setup instructions for specific services (Meilisearch, Redis, etc.).
- "Blueprint Resilience" and "Self-Healing" documentation snippets.

---

## 🔌 Model Context Protocol (MCP)

LaraKube implements two distinct MCP servers to provide AI agents (like Gemini CLI, Claude Desktop, or Cursor) with the perfect balance of context.

### 🛠 1. The Local Mechanic (CLI MCP)
The CLI MCP handles **Local Execution**. It has direct access to your source code, `.env` files, and orchestration verbs.

- **Best For**: Scaffolding new projects, adding services, and patching local configuration.
- **Tools**: `inspect_local_code`, `patch_local_env`, `orchestrate_verb`, and more.

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

### 🧠 2. The Master Architect (Console MCP)
The Console MCP handles **Global Observability**. It lives inside your cluster and has access to real-time logs, events, and project history.

- **Best For**: Debugging pod failures, analyzing fleet health, and historical audit trails.
- **Transport**: SSE (Server-Sent Events) via your console URL.

#### Setup Guide
To add the Master Architect to your AI tool, use the **SSE Transport** pointing to your Console URL:

```json
{
  "mcpServers": {
    "larakube-console": {
      "url": "https://console.dev.test/mcp"
    }
  }
}
```

---

### 💡 Pro Tip: Which one should I use?
- Use the **Local Mechanic (CLI)** when you need the AI to **do things** (build, up, add, change code).
- Use the **Master Architect (Console)** when you need the AI to **understand things** (why is it failing? what happened yesterday?).

### Manual Global Setup
If you prefer to add the servers manually to your global AI host (like Claude or Gemini):

```json
{
  "mcpServers": {
    "larakube-cli": {
      "command": "/path/to/larakube",
      "args": ["mcp"]
    },
    "larakube-console": {
      "url": "https://console.dev.test/mcp"
    }
  }
}
```

---

### 💡 Pro Tip: Security & Privacy
LaraKube's AI features respect your privacy. All diagnostic data is captured only when explicitly requested, and we never share your sensitive cluster secrets (like API keys) in the prompt context.

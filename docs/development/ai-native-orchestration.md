---
sidebar_position: 10
title: AI-Native Orchestration
description: LaraKube is the first AI-native Kubernetes orchestrator. Learn about larakube chat, the Intelligent Doctor, and MCP tools for AI agents.
---
# 🤖 AI-Native Orchestration

LaraKube is the first Kubernetes orchestrator designed for the age of AI. We provide native integrations for both **AI Agents** (via MCP) and **Built-in Interaction** (via LaraKube Chat).

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
LaraKube's `doctor` command now has an "AI Brain." If you encounter pod failures or cluster errors, run:

```bash
larakube doctor --ai
```

### How it works:
1.  **Context Capture**: LaraKube identifies unhealthy pods and captures their last 50 lines of logs and recent Kubernetes events.
2.  **Architectural Analysis**: It feeds this data alongside your project's `.larakube.json` blueprint to a specialized AI model.
3.  **Human Diagnosis**: The doctor returns a plain-English explanation of the error and the **exact command** needed to fix it.

---

## 🔌 Model Context Protocol (MCP)
LaraKube acts as an **MCP Server**, giving AI agents (like Gemini CLI, Claude Desktop, or Cursor) "eyes and hands" inside your cluster.

### Tools for Agents:
-   **`list_pods`**: Allows agents to see all active pods and their health.
-   **`diagnose_pod`**: Provides agents with deep-dive logs and events.
-   **`get_project_config`**: Lets agents read your project's architectural blueprint.
-   **`apply_healing_patch`**: Empowers agents to surgically write and apply manifest fixes.
-   **`list_commands`**: Allows agents to discover all available LaraKube CLI commands.
-   **`get_command_help`**: Provides agents with detailed usage and flags for specific commands.
-   **`execute_command`**: Enables agents to run any LaraKube command (e.g., `new`, `up`, `trust`).
-   **`search_documentation`**: Real-time RAG via Algolia to find architectural patterns and fixes.

### Auto-Scaffolded MCP
LaraKube **automatically scaffolds** configuration files for your favorite AI tools whenever you run `larakube new`. This allows agents to manage your infrastructure immediately without manual setup.

Scaffolded files include:
-   **Gemini CLI**: `.gemini/settings.json`
-   **Claude Code**: `mcp.json`
-   **Cursor / VSCode**: `.vscode/settings.json`

### Manual MCP Setup
If you are using a global AI host, add LaraKube to its configuration:

```json
{
  "mcpServers": {
    "larakube": {
      "command": "/path/to/larakube",
      "args": ["mcp"]
    }
  }
}
```

---

### 💡 Pro Tip: Security & Privacy
LaraKube's AI features respect your privacy. All diagnostic data is captured only when explicitly requested, and we never share your sensitive cluster secrets (like API keys) in the prompt context.

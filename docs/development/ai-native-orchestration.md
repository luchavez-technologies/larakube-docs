---
sidebar_position: 10
---
# 🤖 AI-Native Orchestration

LaraKube is the first Kubernetes orchestrator designed for the age of AI. We provide native integrations for both **AI Agents** (via MCP) and **Standalone Intelligence** (via Laravel AI SDK).

## 🧠 Intelligent Doctor (`--ai`)
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

### Setting up the MCP:
Add LaraKube to your AI host's configuration:

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

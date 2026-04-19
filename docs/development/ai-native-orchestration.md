---
sidebar_position: 10
---
# 🤖 AI-Native Orchestration

LaraKube is the first Kubernetes orchestrator designed for the age of AI. We provide native integrations for both **AI Agents** (via MCP) and **Built-in Interaction** (via LaraKube Chat).

## 💬 LaraKube Chat
Interact with your Kubernetes cluster using natural language. No more memorizing complex `kubectl` flags—just talk to your orchestrator.

```bash
larakube chat
```

### What you can do:
-   **"Create a new project named masterpiece"**: Scaffolds a complete project.
-   **"Start my local cluster"**: Builds images and deploys manifests.
-   **"Pause the project"**: Safely scales pods down without deleting data.
-   **"What's wrong with my pods?"**: Automatically runs the Intelligent Doctor.

---

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

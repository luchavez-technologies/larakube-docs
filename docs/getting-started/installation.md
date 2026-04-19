---
sidebar_position: 1
---
# 🚀 Installation

LaraKube is designed for speed and stability. You can get up and running with a single command, or choose a manual installation if you prefer more control.

## ⚡️ One-Step Installation (Recommended)
The fastest way to install LaraKube is using our automated installer. This will download the latest **standalone binary** for your architecture, install it globally, and initialize your configuration.

```bash
curl -s https://larakube.luchtech.dev/install.sh | bash
```

> 🔐 **Note:** The installer will ask for your `sudo` password to move the binary into your global `/usr/local/bin` directory.

---

## 🔌 AI & MCP Configuration
To unlock the full power of LaraKube's **AI-Native Orchestration**, you should register the LaraKube tools with your favorite AI host.

```bash
# Register for Gemini and Claude Desktop
larakube config:mcp --all
```

---

## 🧠 AI API Key (Optional)
If you want to use the built-in **LaraKube Chat** or the **Intelligent Doctor**, provide your API key:

```bash
# Set your Gemini key and use it as default
larakube config:ai --gemini=YOUR_KEY
```
---

## 🏁 Verification
Confirm your installation by checking the version and cluster status:

```bash
larakube status
```

You are now ready to build your first masterpiece! 🚀🍭🕺🐘

---
sidebar_position: 1
---
# 🚀 Installation

LaraKube is designed for speed and stability. You can get up and running with a single command, or choose a manual installation if you prefer more control.

## ⚡️ One-Step Installation (Recommended)
The fastest way to install LaraKube is using our automated installer. This will download the latest CLI binary, install it globally, and initialize your configuration.

```bash
curl -s https://larakube.luchtech.dev/install.sh | bash
```

> 🔐 **Note:** The installer will ask for your `sudo` password to move the binary into your global `/usr/local/bin` directory.

---

## 🛠 Prerequisites
LaraKube requires two industrial-strength foundations to be installed on your host machine:

1.  **[Docker](https://docs.docker.com/get-docker/)**: For building your high-performance container images.
2.  **[Kubectl](https://kubernetes.io/docs/tasks/tools/)**: The standard command-line tool for cluster orchestration.

---

## 🏗 Manual Installation
If you prefer to manage your binary manually, you can download the latest release directly from GitHub:

1.  Visit the **[GitHub Releases](https://github.com/luchavez-technologies/larakube/releases)** page.
2.  Download the `larakube` PHAR binary.
3.  Move it to your binary path:
    ```bash
    mv larakube /usr/local/bin/larakube
    chmod +x /usr/local/bin/larakube
    ```

---

## 🤖 AI Configuration (Optional)
To unlock LaraKube's **AI-Native Orchestration** features, you should provide an AI API Key. 

1.  Obtain a **[Gemini API Key](https://aistudio.google.com/)** (Recommended) or OpenAI key.
2.  Configure LaraKube to use it:
    ```bash
    larakube config --ai-key=YOUR_KEY
    ```

---

## 🏁 Verification
Confirm your installation by checking the version and cluster status:

```bash
larakube status
```

You are now ready to build your first masterpiece! 🚀🍭🕺🐘

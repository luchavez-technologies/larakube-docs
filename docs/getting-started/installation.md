---
sidebar_position: 1
---
# Installation

LaraKube is designed to be as simple to install as it is to use. It is distributed as a single, portable binary with no external dependencies (other than Docker and Kubectl).

## macOS & Linux

1.  **Download the latest release:**
    Visit the [GitHub Releases](https://github.com/luchavez-technologies/larakube/releases) page and download the binary for your architecture (`darwin` for Mac, `linux` for Linux).

2.  **Make it executable:**
    ```bash
    chmod +x larakube
    ```

3.  **Move it to your PATH:**
    ```bash
    sudo mv larakube /usr/local/bin/larakube
    ```

4.  **Verify the installation:**
    ```bash
    larakube --version
    ```

## Required "Master Tools"

While LaraKube handles the complex orchestration, it relies on a few industry-standard tools to be present on your host machine:

### 🐳 Docker
The engine that builds your container images. LaraKube uses Docker for all local build and installation tasks to keep your host machine clean.
- [Get Docker Desktop](https://docs.docker.com/get-docker/) (Mac/Windows)
- [Get OrbStack](https://orbstack.dev/) (Highly recommended for Mac)

### ☸️ Kubectl
The command-line tool for communicating with your Kubernetes cluster.

**Note for Mac/Windows users:** `kubectl` is bundled with **Docker Desktop** and **OrbStack**. You typically do not need to install it separately if you have one of these installed, though you must ensure the Kubernetes feature is enabled in their respective settings (e.g., in OrbStack, it must be toggled on in the sidebar or settings).

- [Install kubectl](https://kubernetes.io/docs/tasks/tools/) (If not using Docker Desktop or OrbStack)

### 🐕 K9s (Highly Recommended)
While not required, K9s is a beautiful terminal-based UI for interacting with your Kubernetes clusters. LaraKube includes a built-in `dashboard` command that launches K9s pre-focused on your project.

**Fallback:** If `k9s` is not installed on your machine, the `dashboard` command will gracefully fall back to a live-refreshing view using `kubectl get pods`.

- [Install K9s](https://k9scli.io/topics/install/)

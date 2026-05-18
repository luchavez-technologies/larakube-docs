---
sidebar_position: 6
title: Surgical Credentials
description: Understand how LaraKube uses the --minify flag to keep your local cluster credentials private and secure.
---
# 🔐 Surgical Credentials

When configuring your GitOps pipeline (`larakube cloud:configure gha`), you need to provide your cluster's credentials to GitHub. LaraKube handles this with extreme precision to ensure your privacy.

## The "--minify" Passport
Instead of blindly uploading your entire `~/.kube/config` file—which might contain secrets for your local dev cluster, staging cluster, and work cluster—LaraKube uses a **Surgical Extraction** strategy:

1.  **Isolation**: The CLI targets the specific cluster context matching your environment (e.g., `larakube-123.45.67.89`).
2.  **Minification**: It runs `kubectl config view --minify --flatten`.
3.  **Clean Room**: This command outputs a clean, standalone "Passport" for your cluster, containing **only** the necessary server URL and authentication tokens.

## Why this is critical:
- **No Private Context Leaks**: Your local `127.0.0.1` context never leaves your computer.
- **Principle of Least Privilege**: The GitHub Action only has credentials for the specific environment it is deploying to. If a repository is compromised, your other clusters remain completely invisible and safe.
- **Deterministic Builds**: The minified config is always a valid Kubeconfig, ensuring your pipeline isn't bogged down by parsing unnecessary credentials.

*With LaraKube, your secret management is as surgical as your deployment architecture.*

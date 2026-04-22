---
sidebar_position: 4
title: Livewire
description: Deploy high-performance Livewire and TALL stack applications on Kubernetes. Automated setup for Reverb, Redis sessions, and Traefik sticky sessions.
---
# 🌊 Livewire

Livewire is the "TALL" stack standard. For developers who want to stay entirely within the Laravel ecosystem without writing a single line of JavaScript.

<div align="center">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/livewire.svg" width="100" height="100" alt="Livewire" />
</div>

## 🐘 Why Laravel + Livewire?
1.  **Pure PHP**: Build dynamic, reactive interfaces using only PHP classes and Blade templates.
2.  **State Synchronization**: Automatically syncs your UI with your backend models—no API required.
3.  **Maximum Productivity**: The fastest way to build and iterate on a professional Laravel application.

## 🚀 Why LaraKube?
Livewire relies heavily on real-time server communication, which LaraKube CLI optimizes for Kubernetes:

-   **Websocket Mastery**: Pre-configures **Reverb** in a dedicated pod with the correct Kubernetes networking to handle high-concurrency Livewire updates.
-   **Session Stability**: Livewire requires stable sessions. LaraKube automatically scaffolds **Redis** and configures it as your session driver to ensure seamless pod-to-pod transitions.
-   **Sticky Sessions**: Configures Traefik to handle the "Sticky Session" requirements often needed for complex Livewire applications.

```bash
# Scaffold a Livewire Masterpiece
larakube new my-app --livewire
```

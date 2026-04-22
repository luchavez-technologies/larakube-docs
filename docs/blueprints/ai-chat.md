---
sidebar_position: 1
title: Realtime AI Masterpiece Blueprint
description: Scaffold a high-performance AI chat application using FrankenPHP, Reverb, and Meilisearch for real-time streaming and fast history retrieval.
---
# 🤖 Realtime AI Masterpiece

Build a modern, intelligent chat application that responds in real-time.

### 🏗 The Blueprint
This recipe focuses on high-performance response streaming and lightning-fast history retrieval.

-   **Command**: `larakube new ai-chat --frankenphp --postgres --redis --reverb --meilisearch`
-   **Server**: [FrankenPHP](https://laravel.com/docs/13.x/octane#frankenphp) provides the high-performance worker mode needed for long-running AI processes.
-   **Realtime**: [Reverb](https://laravel.com/docs/13.x/reverb) handles the instant streaming of AI responses to the frontend.
-   **Search**: [Meilisearch](https://laravel.com/docs/13.x/scout) ensures your chat history is lightning-fast to search and filter.

---

### 💡 Why this works
By using **Laravel AI SDK** alongside **Laravel MCP**, you can build an experience that feels alive. LaraKube handles the "plumbing" of the cluster so you can focus on crafting the intelligent future.

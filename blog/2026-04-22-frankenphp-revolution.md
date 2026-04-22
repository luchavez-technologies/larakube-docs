---
slug: frankenphp-revolution
title: "The FrankenPHP Revolution: Why Your PHP App Should Stay in Memory"
authors: [luchavez]
tags: [laravel, octane, performance]
---

For decades, the standard way to run PHP was through a "Request-Response" cycle where the entire framework booted up, handled a request, and then died. It worked, but it was far from efficient.

Enter the **FrankenPHP Revolution**.

<!--truncate-->

### What is FrankenPHP?
[FrankenPHP](https://frankenphp.dev/) is a modern PHP app server that brings the power of **Laravel Octane** to the masses. Instead of booting your framework 1,000 times for 1,000 requests, Octane boots it *once* and keeps it in memory.

### Why It’s a Game Changer in LaraKube
When you use LaraKube CLI with the `--frankenphp` flag, you aren't just getting a faster web server. You are getting:
1. **Persistent Connections**: Your database and Redis connections stay open, eliminating the "handshake" overhead on every request.
2. **Native Worker Mode**: Your app is served by a high-performance C-based Go server that manages PHP workers with incredible efficiency.
3. **Automated Live-Watching**: In LaraKube, we've integrated `chokidar` so that when you save a file, the Octane workers restart instantly inside your cluster.

### Production-Ready Performance, Locally
The best part? Because LaraKube uses the same **Serversideup** images in your local cluster that you use in production, your performance benchmarks are actually meaningful. You aren't testing on a "fake" local setup; you are testing on your actual infrastructure.

If you haven't tried running your Laravel app in memory yet, now is the time. 🚀🐘⚡️

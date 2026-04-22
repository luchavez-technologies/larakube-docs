---
slug: artisan-to-architect
title: "From Artisan to Architect: Building Your First Cluster Masterpiece"
authors: [luchavez]
tags: [laravel, kubernetes, scaling]
---

Laravel has always been about "Developer Happiness." But for many of us, the happiness ends when it's time to talk about Kubernetes, Ingress controllers, and Persistent Volume Claims.

LaraKube CLI was built to bridge that gap. It allows you to stop being "just a coder" and start being an **Infrastructure Architect**.

<!--truncate-->

### The Power of "Architecture-by-Flag"
In a traditional setup, adding something like **Redis** or **Meilisearch** involves hunting down Docker Compose snippets and manually mapping ports. In LaraKube, it’s a single flag.

```bash
larakube new my-app --frankenphp --mysql --redis --meilisearch
```

With one command, you aren't just creating a Laravel folder; you are scaffolding an industrial-strength infrastructure stack.

### Professional Defaults, No Magic
We don't use "black box" magic. LaraKube generates standard, pure **Kustomize YAML** manifests. This means that as you grow, you can look inside the `.infrastructure` folder and learn how professional Kubernetes manifests are structured.

### Why It Matters
When you build with LaraKube, you are building for scale from Day One. You get:
- **Automated SSL**: Real wildcard certificates for your local `.dev.test` domains.
- **Dedicated Workers**: Isolated pods for Horizon and Scheduled tasks.
- **Service Isolation**: Your database isn't just a process; it's a secured service in your namespace.

Stop managing servers. Start orchestrating masterpieces. 🏛️🏗️

---
sidebar_position: 1
title: Frontend Stacks
description: Deploy Livewire, React, Vue, or Svelte on Kubernetes with LaraKube CLI — automated HMR, SSR pod isolation, sticky sessions, and Traefik routing per stack.
---
# 🎨 Frontend Stacks

Whichever frontend you pick, `larakube new my-app --<stack>` scaffolds the matching Kubernetes wiring — dev-server HMR routing, SSR pod isolation where relevant, and any session/networking quirks the stack needs.

| Stack | Command | LaraKube CLI handles |
|---|---|---|
| ⚛️ [React](#react) | `larakube new my-app --react` | Dedicated Vite/SSR node pods, `vite.your-app.kube` routing via Traefik |
| 🖖 [Vue.js](#vuejs) | `larakube new my-app --vue` | Zero-config HMR, isolated Vue SSR pod, SPA security headers |
| 🧡 [Svelte](#svelte) | `larakube new my-app --svelte` | Docker build steps tuned for Svelte's compile phase, static asset caching |
| 🌊 [Livewire](#livewire) | `larakube new my-app --livewire` | Dedicated Reverb pod, Redis-backed sessions, Traefik sticky sessions |

## ⚛️ React {#react}
Combined with Laravel's native **Vite** integration and **Inertia.js**, React gives you single-page apps without a separate API layer — plus Laravel Starter Kits for auth. Deploying React with SSR on Kubernetes is notoriously complex, so LaraKube CLI automatically scaffolds separate pods for the Vite dev server and Node.js SSR workers, pre-configures Traefik to route the HMR server, and keeps your in-cluster build pipeline matching CI/CD exactly.

## 🖖 Vue.js {#vuejs}
Vue is the primary target for Inertia.js, offering the smoothest "Classic Laravel" SPA feel, with Tailwind utility classes integrating cleanly into components. LaraKube CLI bridges the Kubernetes networking gap so Hot Module Replacement works out of the box, isolates memory-intensive Vue SSR into its own pod so it can't crash the PHP backend, and pre-configures the Traefik middleware modern SPAs need.

## 🧡 Svelte {#svelte}
Svelte compiles your UI at build time instead of interpreting it in the browser, giving Laravel apps the smallest possible bundle size while integrating natively with Laravel's Vite config. LaraKube CLI tunes its Docker stubs for Svelte's compilation phase, pre-configures Traefik/Ingress to cache compiled assets, and keeps a stable "fixed-version" Kubernetes foundation underneath a fast-moving frontend.

## 🌊 Livewire {#livewire}
Livewire lets you build dynamic, reactive interfaces using only PHP classes and Blade — no API, no JavaScript, and it automatically syncs your UI with backend models. Because Livewire depends heavily on real-time server communication, LaraKube CLI pre-configures a dedicated **Reverb** pod for high-concurrency updates, scaffolds **Redis** as the session driver for seamless pod-to-pod transitions, and configures Traefik's sticky sessions for complex Livewire apps.

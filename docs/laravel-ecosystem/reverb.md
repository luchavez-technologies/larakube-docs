---
sidebar_position: 1
title: Laravel Reverb WebSockets
description: Real-time Laravel Reverb on Kubernetes. Automated server scaffolding, Echo wiring, and dedicated microservice scaling for thousands of connections.
---
# Laravel Reverb

LaraKube provides a first-class experience for [Laravel Reverb](https://laravel.com/docs/reverb), the high-performance WebSocket server for Laravel applications.

## ⚡️ Automations
When you enable Reverb, LaraKube handles the complex networking for you:
1.  **Server Scaffolding:** Creates the Reverb server deployment and a dedicated Service.
2.  **Frontend Wiring:** 
    - Automatically detects your framework (React or Vue).
    - Installs the required `@laravel/echo-*` packages.
    - Configures `app.js` or `app.tsx` with the correct broadcaster settings.
3.  **Local Ingress:** Sets up a secure local URL at `https://reverb.your-project.dev.test`.

## Environment Variables
LaraKube automatically injects and configures these essential keys in your `.env`:
- `REVERB_APP_ID`
- `REVERB_APP_KEY`
- `REVERB_APP_SECRET`
- `REVERB_HOST`
- `REVERB_PORT`

## Deployment
In production, Reverb scales as a dedicated microservice within your cluster, allowing your main application to remain lean while Reverb handles thousands of concurrent WebSocket connections.

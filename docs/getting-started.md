---
sidebar_position: 3
---
# Getting Started

Follow these steps to create your first LaraKube-powered Laravel application.

## Prerequisites

LaraKube will automatically check for these, but it's good to have them ready:

- **Docker:** [Get Docker](https://docs.docker.com/get-docker/)
- **Kubectl:** [Install kubectl](https://kubernetes.io/docs/tasks/tools/)
- **K9s:** (Highly recommended) [Install K9s](https://k9scli.io/topics/install/)

## 1. Create a New Project

Run the following command to start the interactive installer:

```bash
larakube new my-awesome-app
```

## 2. Follow the Wizard

LaraKube will ask you several questions to configure your environment:

1.  **Server Variation:** Choose between FrankenPHP, NGINX, or Apache.
2.  **PHP Version:** Select your target PHP version (8.2 to 8.5).
3.  **Operating System:** Alpine (lightweight) or Debian.
4.  **Laravel Features:** Select from Horizon, Reverb, Scout, and more.
5.  **Database Engines:** Choose your persistent databases (SQLite, MySQL, Postgres).

## 3. Launch the Application

Enter your project directory and bring the cluster up:

```bash
cd my-awesome-app
larakube up
```

LaraKube will:
- Build your local Docker image.
- Set up your `/etc/hosts` automatically.
- Install the Traefik Ingress Controller if missing.
- Apply all Kubernetes manifests.
- Wait for pods to be ready.
- Offer to run initial migrations.

## 4. Access your App

Open your browser and visit: `https://my-awesome-app.local`
To view your intercepted emails, visit: `https://mailpit.my-awesome-app.local`

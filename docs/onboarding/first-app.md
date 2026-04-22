---
sidebar_position: 5
title: Launch Your First Application
description: Bring your first Laravel masterpiece to Kubernetes. A step-by-step guide to project creation, architectural choices, configuration, and launching your cluster.
---
# Your First Application

Ready to bring your first masterpiece to the cluster? LaraKube makes the process as intuitive as running a standard Laravel installer.

## 1. Start the Wizard
Run the following command to begin the interactive orchestration process:

```bash
larakube new my-awesome-app
```

> 💡 **Fast Track:** Want to skip the LaraKube questions and use our "ideal" high-performance defaults (MySQL, Redis, Reverb, etc.)? Just add the `--fast` flag:
> `larakube new my-awesome-app --fast`

## 2. Architectural Choices
LaraKube will guide you through several thoughtful decisions:

1.  **Application Blueprint:** Choose your foundation (Standard Laravel, FilamentPHP, or Statamic).
2.  **Server Variation:** Select your engine. **FrankenPHP** is recommended for its incredible performance and Octane support.
3.  **Operating System:** Choose between the lightweight **Alpine** or the standard **Debian**.
4.  **Laravel Features:** Select the "Lego bricks" your app needs (Horizon, Reverb, Scout, etc.).
5.  **Databases:** Choose your foundation (MySQL, MariaDB, or PostgreSQL).

## 3. Configuration (The .env Source of Truth)
LaraKube uses your local environment files to configure the entire cluster.
- **Local:** Edit the standard `.env` file.
- **Production:** A `.env.production` was created for you.

LaraKube automatically configures these files with the correct Kubernetes hostnames (e.g., `DB_HOST=mysql`), so you usually don't need to change much for local development.

## 4. Launching the Cluster
Enter your new project directory and bring the environment to life:

```bash
cd my-awesome-app
larakube up
```

LaraKube will automatically:
- Build your local Docker image.
- Configure your `/etc/hosts` for the project's local domains.
- Deploy the Kubernetes manifests (Deployments, Services, Ingresses, PVCs).
- Wait for all pods to be healthy.
- **Run migrations** once the database is fully ready.
- **Perform a smoke test** to verify that your domains are reachable.

## 5. Daily Development (Pause & Resume)
LaraKube makes daily development fast and stable. Instead of deleting your environment when you're finished for the day, use the **Stop/Start** workflow to preserve your data:

```bash
# Pause your cluster (Saves CPU/RAM, keeps data safe)
larakube stop

# Resume exactly where you left off
larakube start
```

## 6. Behold!
Your application is now live! 
- **App:** [https://my-awesome-app.dev.test](https://my-awesome-app.dev.test)
- **Mailpit:** [https://mailpit.my-awesome-app.dev.test](https://mailpit.my-awesome-app.dev.test)
- **Meilisearch:** [https://meilisearch.my-awesome-app.dev.test](https://meilisearch.my-awesome-app.dev.test) (If enabled)

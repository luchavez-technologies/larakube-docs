---
sidebar_position: 1
title: Masterpiece Blueprints
description: Ready-made larakube new recipes for common Laravel app shapes — AI chat, e-commerce, portfolio/CMS, and background-processing workloads.
---
# 🎨 Masterpiece Blueprints

Each blueprint below is just a `larakube new` invocation with a stack picked for a specific job — a starting point, not a separate product. Copy the command, then adjust flags as needed.

| Blueprint | Command | Stack | Best for |
|---|---|---|---|
| 🤖 [Realtime AI Masterpiece](#-realtime-ai-masterpiece) | `larakube new ai-chat --frankenphp --postgres --redis --reverb --meilisearch` | FrankenPHP, Postgres, Redis, Reverb, Meilisearch | Chat apps that stream AI responses in real time |
| 🛒 [Scalable E-Commerce Engine](#-scalable-e-commerce-engine) | `larakube new storefront --filament --mysql --redis --minio --schedule` | FilamentPHP, MySQL, Redis, MinIO, Scheduler | Storefronts needing transactional integrity + product imagery |
| 📁 [Enterprise Portfolio](#-enterprise-portfolio) | `larakube new portfolio --statamic --nginx --mysql` | Statamic, Nginx, MySQL | High-traffic portfolio/corporate sites, version-controlled content |
| 🏗 [High-Throughput Data Processor](#-high-throughput-data-processor) | `larakube new processor --frankenphp --redis --horizon --schedule` | FrankenPHP, Redis, Horizon, Scheduler | Analytics, scraping, and other background-heavy processing |

## 🤖 Realtime AI Masterpiece
Build a modern, intelligent chat application that responds in real-time — high-performance response streaming plus lightning-fast history retrieval.
- **Server**: [FrankenPHP](https://laravel.com/docs/13.x/octane#frankenphp) provides the high-performance worker mode needed for long-running AI processes.
- **Realtime**: [Reverb](https://laravel.com/docs/13.x/reverb) handles the instant streaming of AI responses to the frontend.
- **Search**: [Meilisearch](https://laravel.com/docs/13.x/scout) ensures your chat history is lightning-fast to search and filter.

💡 By using **Laravel AI SDK** alongside **Laravel MCP**, you can build an experience that feels alive. LaraKube CLI handles the "plumbing" of the cluster so you can focus on crafting the intelligent future.

## 🛒 Scalable E-Commerce Engine
Scaffold a rock-solid foundation for your next digital storefront — designed for transactional integrity and high-resolution asset management.
- **Admin**: [FilamentPHP](https://filamentphp.com/docs) gives you an instant, beautiful admin panel for product and order management.
- **Persistence**: [MySQL](https://laravel.com/docs/13.x/database) provides reliable transactional integrity for your orders.
- **Storage**: [MinIO](https://laravel.com/docs/13.x/filesystem) handles your high-resolution product imagery with ease using the S3 driver.

💡 Use [Task Scheduling](https://laravel.com/docs/13.x/scheduling) to automate order processing and inventory syncs. LaraKube CLI orchestrates the CronJobs so your store never misses a beat.

## 📁 Enterprise Portfolio
A professional, high-traffic portfolio or corporate site that's easy to manage — focused on simplicity, speed, and clean content management.
- **CMS**: [Statamic](https://statamic.dev) offers a clean, flat-file CMS experience that's perfect for version-controlled content.
- **Server**: [Nginx](https://laravel.com/docs/13.x/deployment#nginx) provides a traditional and widely-trusted web server foundation.
- **Stability**: Using **MySQL** ensures your portfolio remains highly available and production-ready.

💡 With **Laravel Boost**, you can turn your professional portfolio into a high-performance masterpiece that ranks perfectly on Core Web Vitals.

## 🏗 High-Throughput Data Processor
Ideal for background task heavy applications like analytics, scraping, or heavy processing — built for massive scaling and industrial-strength background processing.
- **Monitoring**: [Horizon](https://laravel.com/docs/13.x/horizon) provides a beautiful dashboard to monitor your background scaling and job health.
- **Throughput**: [FrankenPHP](https://laravel.com/docs/13.x/octane) ensures your API endpoints remain responsive even under heavy cluster load.
- **Persistence**: [Redis](https://laravel.com/docs/13.x/queues#redis) handles your job queues with the highest possible throughput.

💡 Focus on your business logic. LaraKube CLI handles the "plumbing" of auto-scaling your worker pods and managing your cluster's high-performance [Cache](https://laravel.com/docs/13.x/cache).

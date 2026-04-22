---
sidebar_position: 100
---
# ⚖️ Comparison Guide

How does LaraKube stack up against other Laravel development and deployment tools? This guide helps you understand the professional landscape.

## 🐑 LaraKube vs. Laravel Herd
[Laravel Herd](https://herd.laravel.com) is the fastest way to get a Laravel environment running on macOS and Windows. 

-   **Native vs. Containerized**: Herd uses native binaries (PHP, Nginx) for maximum local speed. LaraKube uses **Kubernetes containers** for absolute production parity.
-   **Host Dependencies**: Herd requires installation on your host machine. LaraKube follows a **"Zero-Host-Dependency"** philosophy—your host stays "factory-clean" while all orchestration happens inside Docker.
-   **Orchestration**: Herd is a development tool; LaraKube is an **orchestrator** that bridges the gap between local development and production-grade Kubernetes clusters.

## 🐘 LaraKube vs. Laravel Sail
[Laravel Sail](https://laravel.com/docs/sail) is an excellent entry point for Docker development, but LaraKube is designed for the next level:
-   **Orchestration**: Sail uses Docker Compose; LaraKube uses **Kubernetes**.
-   **Production Parity**: LaraKube ensures your local environment is architecturally identical to your production cluster.
-   **Stability**: LaraKube's cluster-native volume strategy and automated manifest engine solve the common permission and configuration errors found in simpler tools.

## 🌀 LaraKube vs. Spin Pro
We are huge fans of [Serversideup's Spin](https://getspin.pro/). It is a fantastic tool for managing Docker Compose environments.
-   **Philosophy**: Spin focuses on making Docker Compose easy and standardized.
-   **Orchestrator**: LaraKube focuses on bringing that same level of "Pro" developer experience to **Kubernetes**.
-   **The Synergy**: If you love the stability and performance of [Serversideup's Docker Images](https://serversideup.net/open-source/docker-php/), you will feel right at home with LaraKube. We use their images as our absolute foundation for cluster reliability.

## 🚢 LaraKube vs. Laravel Forge
[Laravel Forge](https://forge.laravel.com) is the gold standard for traditional server management. LaraKube serves a different architectural philosophy:
-   **Immutable Infrastructure**: Forge manages long-lived servers; LaraKube manages **immutable containers**.
-   **Zero-Downtime**: Kubernetes' native rolling updates provide industrial-strength zero-downtime deployments out of the box.
-   **Scaling**: LaraKube makes it trivial to scale specialized pods (like horizon or reverb) independently.

## 🚀 LaraKube vs. Laravel Vapor
[Laravel Vapor](https://vapor.laravel.com) is a powerful serverless platform. LaraKube provides a similar "hands-off" experience but within your own cluster:
-   **Ownership**: With LaraKube, you own the infrastructure and the cluster.
-   **Customization**: You have full control over the PHP extensions, server variations (FrankenPHP/Nginx), and sidecar containers.
-   **Local Development**: LaraKube provides the same professional orchestration on your local machine as it does in production.

## ☁️ LaraKube vs. Laravel Cloud
[Laravel Cloud](https://cloud.laravel.com) is the official, fully-managed infrastructure platform for Laravel. LaraKube CLI complements this landscape for specific use cases:
-   **Infrastructure-as-Code**: Laravel Cloud is a managed platform; LaraKube is an **orchestrator** for your own private or public Kubernetes clusters.
-   **Local Development**: LaraKube provides a professional Kubernetes environment on your **local machine**, which is perfect for testing cluster-native features before deploying to a platform like Laravel Cloud.
-   **Ownership**: If you have specific regulatory or compliance needs that require you to host on your own "Bare Metal" or specialized Kubernetes distribution, LaraKube is your tool.

---

### 💡 The LaraKube Advantage
LaraKube is for architects who want the power of Kubernetes with the simplicity of the Laravel ecosystem. We bridge the gap between "it works on my machine" and "it's ready for the world." 🚀🍭🕺

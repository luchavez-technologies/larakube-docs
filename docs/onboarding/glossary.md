---
sidebar_position: 7
title: Kubernetes Glossary
description: Master the language of Kubernetes with the LaraKube glossary. Learn about Pods, Deployments, Services, Ingress, and cluster-native persistence.
---
# 📖 Kubernetes Glossary

LaraKube speaks the language of **Kubernetes**, the industry-standard orchestrator for containers. While we handle the "plumbing" for you, understanding these core concepts will help you master your cluster.

For deep dives, we recommend the [Official Kubernetes Documentation](https://kubernetes.io/docs/home/).

## 🏗 Cluster & Organization

### [Cluster](https://kubernetes.io/docs/concepts/architecture/)
A set of node machines for running containerized applications. LaraKube orchestrates your app within this cluster.

### [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
A virtual partition in your cluster. LaraKube creates a dedicated namespace for every project (e.g., `my-app-local`), keeping your environments isolated.

## 📦 Workloads & Running Code

### [Pod](https://kubernetes.io/docs/concepts/workloads/pods/)
The smallest unit in Kubernetes. A Pod runs one or more containers (like your PHP app or a MySQL database). When you run `larakube up`, you are launching Pods.

### [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
Describes the "desired state" of your application. It manages the creation and scaling of Pods. If a Pod crashes, the Deployment automatically replaces it.

### [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
Manages time-based tasks. LaraKube uses this to orchestrate the [Laravel Task Scheduler](https://laravel.com/docs/13.x/scheduling).

## 🌍 Networking & Access

### [Service](https://kubernetes.io/docs/concepts/services-networking/service/)
An abstract way to expose your Pods as a network service. This is how your PHP app talks to your Database (e.g., `DB_HOST=mysql`).

### [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
The "Front Door" of your cluster. It manages external access to your services, typically HTTP. This allows you to visit your app at `my-app.dev.test`.

## 💾 Storage & Persistence

### [PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
A piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes.

### [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
A request for storage by a user. Think of it like a "Ticket" to use a piece of a PersistentVolume.

### [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir)
A simple volume that is created when a Pod is assigned to a node and exists as long as that Pod is running. LaraKube uses this for ephemeral data like temporary build tasks. **It is not used for databases.**

### [Cluster-Native Persistence]
LaraKube's strategy of using **PersistentVolumeClaims (PVCs)** even in local development. This ensures that your local databases (MySQL, Postgres) keep their data even if you stop or restart your cluster.

## 🛠 Configuration & Customization

### [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) & [Secret](https://kubernetes.io/docs/concepts/configuration/secret/)
Objects used to store non-confidential and sensitive data (like your `.env` values). LaraKube automatically syncs these into your cluster.

### [Kustomize](https://kubernetes.io/docs/concepts/overview/working-with-objects/kustomize/)
A tool for customizing Kubernetes manifests without templates. LaraKube uses this to manage **Base** configurations and **Overlays** (like Local vs. Production).

### [Overlay](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#overlay)
A set of Kustomize patches that modify a base configuration for a specific environment.

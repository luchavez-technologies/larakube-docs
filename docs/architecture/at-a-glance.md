---
sidebar_position: 1
title: Architecture at a Glance
description: A visual tour of how a LaraKube CLI cluster, namespaces, pods, and replicas occupy a single VPS — including where your Laravel app actually runs, the built-in kube-system plumbing, two apps or two environments on one server, shared Plex Commons, and multi-node.
---
# 🗺️ Architecture at a Glance

This page is a **visual tour** of how everything fits together — from a single cheap VPS to a multi-node cluster. If you've never touched Kubernetes, start here: every diagram uses a running **shop** and **blog** analogy so you can *see* where your Laravel app lives before reading the deep-dive pages.

---

## 🧱 The building blocks

Kubernetes has a small vocabulary. Here's the whole cast, in plain terms:

| Kubernetes object | What it really is | In the "shopping mall" analogy |
|---|---|---|
| **Cluster** | The whole system that runs your containers | The shopping mall |
| **Node** | One machine (your VPS is one node) | The building |
| **Namespace** | An isolated section of the cluster | A rented store unit |
| **Deployment** | A rule: "keep N identical copies running" | The staffing plan |
| **Pod** | One running instance of your app | One staffed counter |
| **Replica** | Extra identical Pods of the same Deployment | More counters at rush hour |
| **Service** | A stable internal address for a set of Pods | The store's front desk |
| **Ingress** (Traefik) | Routes outside traffic in, by hostname | The mall greeter/directory |
| **PVC / Volume** | Persistent disk storage | The stockroom |

:::tip Where is my Laravel app?
Your Laravel app is the **FrankenPHP container inside each `web` Pod** (the <img src="/icons/laravel.svg" alt="Laravel" width="16" height="16" /> Laravel icon in the diagrams below). When you scale to 2 replicas, you have two identical Pods each running your app — Traefik load-balances requests across them.
:::

---

## 1️⃣ What lives on a single VPS

One `larakube cloud:provision` turns a fresh Linux box into a K3s cluster. Here's everything running on it for a single app called **shop**, in production:

```mermaid
flowchart TB
    User([🌐 Browser — shop.com])

    subgraph VPS["🖥️ Single VPS · one Linux box · one public IP"]
      subgraph Cluster["☸️ K3s Cluster"]
        subgraph KS["kube-system namespace · built-in plumbing"]
          SVCLB["svclb-traefik<br/>binds host ports 80 / 443"]
          TRAEFIK["traefik<br/>ingress router + TLS"]
          COREDNS["coredns<br/>in-cluster DNS"]
          LPP["local-path-provisioner<br/>carves PVCs from disk"]
        end
        subgraph APP["shop-production namespace · your app"]
          WEBSVC["Service: web"]
          subgraph DEP["Deployment: web · replicas 2"]
            P1@{ img: "/icons/laravel.svg", label: "Pod · Laravel", pos: "b", w: 40, h: 150 }
            P2@{ img: "/icons/laravel.svg", label: "Pod · Laravel", pos: "b", w: 40, h: 150 }
          end
          MYSQL@{ img: "/icons/mysql.svg", label: "mysql pod", pos: "b", w: 40, h: 150 }
          REDIS@{ img: "/icons/redis.svg", label: "redis pod", pos: "b", w: 40, h: 150 }
        end
      end
    end

    User -->|HTTPS 443 → host port| SVCLB
    SVCLB --> TRAEFIK
    TRAEFIK -->|Host: shop.com| WEBSVC
    WEBSVC --> P1
    WEBSVC --> P2
    P1 -.->|mysql.shop-production.svc.cluster.local| MYSQL
    P1 -.-> REDIS
    COREDNS -.->|resolves service names| WEBSVC
    LPP -.->|persistent volume| MYSQL

    classDef iconNode fill:none,stroke:none;
    class P1,P2,MYSQL,REDIS iconNode;
```

**Reading the diagram:**

- The **namespace** `shop-production` holds your whole app — Pods, Services, and data Pods — walled off from everything else. The naming is always `{app}-{environment}`.
- The **Deployment** keeps **2 replicas** of the `web` Pod running. Each Pod *is* your Laravel app.
- Pods talk to each other by **DNS name** (`mysql.shop-production.svc.cluster.local`), never by IP — that's what **coredns** is for.

### Why is there a `kube-system` namespace?

You didn't create it — K3s ships it, and it's what makes the single-node magic work:

| Component | Why it exists |
|---|---|
| **coredns** | Gives every Service a DNS name so Pods find each other by name (`mysql.shop-production…`) instead of brittle IPs. |
| **local-path-provisioner** | On a single node there's no cloud disk service. When your `mysql` Pod asks for a PVC, this turns that request into a real folder on the VPS disk — that's how your data survives restarts. |
| **svclb-traefik** | K3s's built-in "service load balancer" (Klipper). It's the piece that binds Traefik to the **host's ports 80/443**, so your public IP actually reaches the cluster — **no paid cloud load balancer needed.** This is the heart of the [Single-Node Hero](./single-node-hero) strategy. |
| **traefik** | The ingress controller itself: terminates TLS (Let's Encrypt) and routes each request to the right namespace by its `Host` header. |

➡️ Deep dive: [Kubernetes Strategy](./infrastructure) · [Hybrid Networking](./networking) · [Single-Node Hero](./single-node-hero)

---

## 2️⃣ Two Apps, One Server

Two **independent repos** — `shop` and `blog` — can share one VPS. Each gets its own namespace and its own services; **Traefik routes by hostname** so they never collide.

```mermaid
flowchart TB
    U1([🛒 shop.com])
    U2([📝 blog.com])

    subgraph VPS["🖥️ One VPS"]
      T{{"Traefik · routes by Host header"}}
      subgraph NS1["shop-production namespace"]
        SW@{ img: "/icons/laravel.svg", label: "web Pods ×2", pos: "b", w: 40, h: 150 }
        SM@{ img: "/icons/mysql.svg", label: "mysql", pos: "b", w: 40, h: 150 }
        SR@{ img: "/icons/redis.svg", label: "redis", pos: "b", w: 40, h: 150 }
      end
      subgraph NS2["blog-production namespace"]
        BW@{ img: "/icons/laravel.svg", label: "web Pods ×2", pos: "b", w: 40, h: 150 }
        BM@{ img: "/icons/mysql.svg", label: "mysql", pos: "b", w: 40, h: 150 }
        BR@{ img: "/icons/redis.svg", label: "redis", pos: "b", w: 40, h: 150 }
      end
    end

    U1 --> T
    U2 --> T
    T -->|Host: shop.com| SW
    T -->|Host: blog.com| BW
    SW --> SM
    SW --> SR
    BW --> BM
    BW --> BR

    classDef iconNode fill:none,stroke:none;
    class SW,SM,SR,BW,BM,BR iconNode;
```

Notice each app runs its **own** `mysql` and `redis` Pods — simple, but it duplicates RAM. That's exactly the problem **Plex** solves (diagram 4).

➡️ Full walkthrough: [Two Apps, One Server](../deployment/multiple-projects)

---

## 3️⃣ Two Environments, One Server

Same idea, but now it's **one repo, two branches**: `main` → production, `develop` → staging. Each environment gets its own namespace, isolated by the `{app}-{environment}` convention.

```mermaid
flowchart TB
    M([🌿 main branch])
    D([🌱 develop branch])
    U1([shop.com])
    U2([staging.shop.com])

    subgraph VPS["🖥️ One VPS"]
      T{{"Traefik"}}
      subgraph P["shop-production namespace"]
        PW@{ img: "/icons/laravel.svg", label: "web Pods ×2", pos: "b", w: 36, h: 150 }
      end
      subgraph S["shop-staging namespace"]
        SW@{ img: "/icons/laravel.svg", label: "web Pod ×1", pos: "b", w: 36, h: 150 }
      end
    end

    M -.->|GitHub Actions deploys| PW
    D -.->|GitHub Actions deploys| SW
    U1 --> T
    U2 --> T
    T -->|Host: shop.com| PW
    T -->|Host: staging.shop.com| SW
        
    classDef iconNode fill:none,stroke:none;
    class PW,SW iconNode;
```

Both environments typically share **one Plex Commons** for their data, but each gets its **own isolated database, Redis logical DB, and S3 bucket** — staging can never touch production's data. That sharing is the next diagram.

➡️ Full walkthrough: [Two Environments, One Server](../deployment/two-envs-one-server)

---

## 4️⃣ Plex Commons — share services, save RAM

Instead of every app/env running duplicate `mysql` + `redis` + storage Pods, **Plex** runs **one shared set** in the `larakube-shared` namespace — the **Commons**. Each app joins as an isolated **tenant**.

```mermaid
flowchart TB
    subgraph VPS["🖥️ One VPS"]
      subgraph A1["shop-production"]
        SW@{ img: "/icons/laravel.svg", label: "web Pods", pos: "b", w: 40, h: 150 }
      end
      subgraph A2["blog-production"]
        BW@{ img: "/icons/laravel.svg", label: "web Pods", pos: "b", w: 40, h: 150 }
      end
      subgraph COMMONS["larakube-shared · Plex Commons — one set of services"]
        CM@{ img: "/icons/mariadb.svg", label: "MariaDB · db shop · db blog", pos: "b", w: 40, h: 150 }
        CR@{ img: "/icons/redis.svg", label: "Redis · DB 0 · DB 1", pos: "b", w: 40, h: 150 }
        CO@{ img: "/icons/minio.svg", label: "MinIO · bucket shop · blog", pos: "b", w: 40, h: 150 }
        CME@{ img: "/icons/meilisearch.svg", label: "Meilisearch · index per tenant", pos: "b", w: 40, h: 150 }
      end
    end

    SW -->|tenant: shop| CM
    SW --> CR
    SW --> CO
    SW --> CME
    BW -->|tenant: blog| CM
    BW --> CR
    BW --> CO
    BW --> CME

    classDef iconNode fill:none,stroke:none;
    class SW,BW,CM,CR,CO,CME iconNode;
```

**One MariaDB Pod, many isolated databases.** Exactly like several apps sharing one managed database: shared engine, separate logins and data. Plex is **demand-driven** — joining provisions only the services an app's blueprint actually declares, and never removes a service another tenant still uses.

➡️ Full walkthrough: [Two Apps, One Server → Plex](../deployment/multiple-projects#going-further-plex) · [Commons Resource Tuning](../deployment/plex-resources)

---

## 5️⃣ Putting it all together

You can combine **all** of the above on one box: **two apps**, each with **production *and* staging**, all sharing a **single Plex Commons**. That's **four isolated tenants** on one VPS — and it's a completely normal setup.

```mermaid
flowchart TB
    T{{"Traefik · routes by Host"}}

    subgraph VPS["🖥️ One VPS · K3s cluster"]
      subgraph SHOP["🛒 shop (one repo)"]
        SP@{ img: "/icons/laravel.svg", label: "shop-production", pos: "b", w: 40, h: 150 }
        SS@{ img: "/icons/laravel.svg", label: "shop-staging", pos: "b", w: 40, h: 150 }
      end
      subgraph BLOG["📝 blog (one repo)"]
        BP@{ img: "/icons/laravel.svg", label: "blog-production", pos: "b", w: 40, h: 150 }
        BS@{ img: "/icons/laravel.svg", label: "blog-staging", pos: "b", w: 40, h: 150 }
      end
      subgraph COMMONS["larakube-shared · Plex Commons"]
        CM@{ img: "/icons/mariadb.svg", label: "MariaDB", pos: "b", w: 40, h: 150 }
        CR@{ img: "/icons/redis.svg", label: "Redis", pos: "b", w: 40, h: 150 }
        CO@{ img: "/icons/minio.svg", label: "MinIO", pos: "b", w: 40, h: 150 }
        CME@{ img: "/icons/meilisearch.svg", label: "Meilisearch", pos: "b", w: 40, h: 150 }
      end
    end

    T -->|shop.com| SP
    T -->|staging.shop.com| SS
    T -->|blog.com| BP
    T -->|staging.blog.com| BS

    SP -->|tenant| COMMONS
    SS -->|tenant| COMMONS
    BP -->|tenant| COMMONS
    BS -->|tenant| COMMONS

    classDef iconNode fill:none,stroke:none;
    class SP,SS,BP,BS,CM,CR,CO,CME iconNode;
```

Each of the four namespaces is its **own Plex tenant** — its own database, Redis logical DB, and S3 bucket on the shared services — so `shop`'s staging can't see `blog`'s production, and nothing collides. One caveat: it all shares the node's **RAM**, so size the box for the total (see the [capacity reality](../deployment/multiple-projects#-will-it-fit-capacity-reality) table).

➡️ The exact per-tenant naming scheme: [Two Environments, One Server](../deployment/two-envs-one-server#-how-isolation-works)

---

## 6️⃣ Going multi-node

When one box isn't enough, you graduate to a managed cluster (e.g. DigitalOcean Kubernetes). The concepts are identical — the **plumbing changes**:

```mermaid
flowchart TB
    User([🌐 Browser])
    LB["☁️ Cloud Load Balancer<br/>(managed)"]

    subgraph CP["Control Plane · managed by the provider"]
      API["kube-apiserver + scheduler"]
    end

    subgraph N1["Worker Node 1"]
      T{{"Traefik"}}
      W1@{ img: "/icons/laravel.svg", label: "shop web Pod", pos: "b", w: 40, h: 150 }
      W2@{ img: "/icons/laravel.svg", label: "blog web Pod", pos: "b", w: 40, h: 150 }
    end
    subgraph N2["Worker Node 2"]
      W3@{ img: "/icons/laravel.svg", label: "shop web Pod", pos: "b", w: 40, h: 150 }
      DBN@{ img: "/icons/mysql.svg", label: "managed DB / networked volume", pos: "b", w: 40, h: 150 }
    end

    User -->|HTTPS| LB
    LB --> T
    T --> W1
    T --> W3
    API -.->|schedules Pods| N1
    API -.->|schedules Pods| N2
    W1 -.-> DBN
    W3 -.-> DBN

    classDef iconNode fill:none,stroke:none;
    class W1,W2,W3,DBN iconNode;
```

**What changes from single-node:**

| | Single-Node Hero | Multi-node |
|---|---|---|
| Traffic in | `svclb-traefik` binds host ports (free) | A **managed Load Balancer** fronts the cluster |
| Pod placement | All on one node | The **scheduler** spreads Pods across nodes |
| Storage | `local-path-provisioner` (one disk) | **Networked** storage or a **managed database** (a local disk can't follow a Pod to another node) |
| Control plane | Runs on your one box | **Managed** by the provider |

:::caution Storage is the gotcha
The biggest leap to multi-node is storage: a Pod can be rescheduled onto any node, so it can't rely on one node's local disk. Use a managed database, or networked `ReadWriteMany` storage. See [Shared Storage](./shared-storage).
:::

➡️ Where each step fits: [The Scaling Journey](../deployment/scaling-journey) · [DOKS Quickstart](../deployment/doks-quickstart)

---

## 🧭 Where to go next

- New to the terms? → [Glossary](../onboarding/glossary)
- The "why" behind it all → [Core Philosophy](./philosophy)
- Run two apps on one box → [Two Apps, One Server](../deployment/multiple-projects)
- Staging + production on one box → [Two Environments, One Server](../deployment/two-envs-one-server)
- Save RAM by sharing services → [Plex Commons](../deployment/multiple-projects#going-further-plex)

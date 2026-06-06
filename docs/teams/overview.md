---
sidebar_position: 1
title: Team Access
description: Give teammates their own scoped access to your cluster — no SSH, no server logins. A per-person kubeconfig bound to built-in view/edit/admin roles, one identity across many apps, instant upgrade/downgrade and revoke.
---
# 👥 Team Access

Give a teammate access to your cluster **without giving them a login on your server**. Each person gets their own **kubeconfig**, scoped by Kubernetes RBAC to exactly the apps and level of access you choose. No SSH, no `sudo`, no OS user — and you can audit, change, or revoke it in one command.

> This replaces the old SSH-based teammate flow (which created a passwordless-root Linux user). SSH stays only for **you** administering the box.

## The model in one picture

A teammate is **one identity** (a ServiceAccount), with **one kubeconfig**. Access to an app is a binding in that app's namespace:

```
lloyd  (one identity / one kubeconfig)
  ├─ blue-production    → edit
  └─ orange-production  → edit   (added later — same identity, no new file)
```

Because access is granted *per namespace*, a teammate **can't see — or even know about — apps you haven't granted them**.

## A walkthrough

Say you run two apps, **blue** and **orange**, and you're bringing on **lloyd** (a developer) and **alex** (an intern).

### 1. Grant access

```bash
# lloyd can operate blue (the default role is `edit`)
larakube cluster:grant blue-production --name lloyd

# alex is an intern — read-only
larakube cluster:grant blue-production --name alex --read
```

Each produces a kubeconfig file (`lloyd.kubeconfig`, `alex.kubeconfig`) — hand it to them **securely** (a password manager, not a public channel).

**The roles** map to Kubernetes' built-in ClusterRoles:

| Flag | Role | Can do |
|---|---|---|
| `--read` | `view` | see pods, logs, status — **no** exec, **no** secrets, **no** deleting |
| `--edit` *(default)* | `edit` | run `artisan` (`pods/exec`), tail logs, restart/kill pods, deploy — but **can't** manage access |
| `--admin` | `admin` | everything `edit` can, **plus** grant others access to that app |

### 2. They onboard — one command

On their own machine:

```bash
larakube context:import ./lloyd.kubeconfig
```

This merges it into their `~/.kube/config` and switches to it. They can now `kubectl get pods`, tail logs, `kubectl exec` for artisan — **only in `blue-production`**. Try anything in `orange-production` → `403`. They can't even list namespaces, so orange is invisible to them.

### 3. Entrust them with another app — no new file

Later you trust lloyd with orange too:

```bash
larakube cluster:grant orange-production --name lloyd
```

This just adds a binding. **lloyd's kubeconfig doesn't change** — his existing token now works in orange. No re-onboarding, no second context cluttering his `~/.kube/`. He just uses `-n orange-production`.

### 4. Change someone's level — instantly

Promote lloyd to admin on blue, or walk it back:

```bash
larakube cluster:grant blue-production --name lloyd --admin    # upgrade
larakube cluster:grant blue-production --name lloyd --read     # downgrade
```

Re-running `grant` replaces the binding. The change is **instant** — no new file, no re-onboarding.

### 5. See who has what

```bash
larakube cluster:users
```
Shows a **Teammates** table — each person, their identity, and their `namespace:role` across the cluster (read live, so it's always accurate).

### 6. Off-board

```bash
larakube cluster:revoke --name lloyd orange-production   # remove just orange
larakube cluster:revoke --name lloyd                     # remove everything
```
The first drops one app (his blue access still works). The second deletes his identity entirely — his kubeconfig becomes inert immediately.

## Why this is safe

A teammate's kubeconfig is **scoped and revocable** by construction — the worst case is access to the apps you granted, and you can cut it instantly. This is the same least-privilege model LaraKube uses everywhere; see the [Security Model](../security/overview) and [Rotating & Revoking Credentials](../security/rotating-credentials).

A couple of practical notes:
- **Deliver kubeconfig files securely** — they contain a token. Not committed, not pasted in public chat. If one leaks, `cluster:revoke --name <person>` and re-grant.
- **A teammate who deploys needs a registry** — without SSH there's no image side-load, so registry-based deploys (`cloud:configure:registry`) are the path for deploy-capable teammates.

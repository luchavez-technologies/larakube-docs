---
sidebar_position: 3
title: Server Hardening
description: What LaraKube CLI locks down on a self-managed VPS — UFW firewall, fail2ban, automatic updates, key-only SSH, and a guarded disable of remote root login.
---
# 🔒 Server Hardening

When you run `larakube cloud:init` on a fresh VPS, it doesn't just install k3s — it **hardens the box**. The same logic is available on demand for an already-provisioned server via `larakube cloud:harden`.

> Managed clusters (DOKS/EKS/GKE/AKS) don't need this — their nodes are hardened by the provider, and LaraKube CLI reaches them by kube-context, never SSH.

## What it applies

### Firewall (UFW)
- **Default-deny inbound**, allow outbound.
- Opens only what's needed: your **SSH port**, **80/443** (Traefik), and **6443** (the k3s API).
- Allows the **k3s pod (`10.42.0.0/16`) and service (`10.43.0.0/16`) CIDRs** — the gotcha that bites people who enable a firewall on a live cluster and lose CoreDNS→API traffic.
- The SSH port is allowed **before** the firewall is enabled, so there's no lockout window.

### fail2ban
Installed and enabled — bans IPs that brute-force SSH.

### Automatic security updates
`unattended-upgrades` is installed and enabled, so the box keeps itself patched.

### Key-only SSH
`PasswordAuthentication no` — password logins are disabled (safe, because you connect by key). Brute-forcing a password is no longer even possible.

### Guarded: disable remote root login
This is the one that can lock you out if done carelessly, so it's **guarded**:

1. LaraKube CLI first proves the **`larakube`** user can both SSH in (same key) **and** run `sudo`.
2. Only then does it set `PermitRootLogin no`.

If either check fails, it leaves root login **enabled** and warns you. The root **account** is kept (the system, your provider's recovery console, and `sudo` all need it) — only its *network login over SSH* is closed.

## Re-applying to an existing server

```bash
larakube cloud:harden production     # uses the server saved for that env
larakube cloud:harden                # or prompt for IP / SSH details
```

`cloud:harden` is idempotent — safe to run repeatedly. Run it as the `larakube` user to also (optionally) close remote root login on a box you provisioned before this feature existed.

## What's deliberately deferred

These are tracked in the CLI's `plans/active/server-hardening.md`:

- **Restrict the k3s API (6443) to your operator IP** — it's open to the internet by default (you need to reach it for `kubectl`/`cloud:deploy`). Locking it to a single IP is fiddly to automate safely, so it's a documented manual follow-up.
- **Tighten `k3s.yaml` to `600`** — the admin kubeconfig on the node is world-readable (`644`) so the sync step can read it; tightening it needs the sync to use `sudo`.
- **Scope the `larakube` sudo** — it keeps full `NOPASSWD` sudo because, once root login is off, it *is* the box's admin. OS-level deploy isolation, if ever wanted, would be a separate dedicated user — not a narrowing of `larakube`. (The deploy automation's least privilege lives at the [Kubernetes RBAC layer](./overview) instead.)

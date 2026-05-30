---
sidebar_position: 11
title: Declarative Teammate Access
description: Give teammates SSH access to a LaraKube server declaratively — defined per environment in .larakube.json and synced with one command.
---
# 👤 Declarative Teammate Access

LaraKube gives you a declarative way to manage **SSH access** to a server. Instead of hand-editing `authorized_keys` on the box, you list your teammates in the blueprint and sync them with one command — so access lives in version control alongside everything else.

## 🛠 Where teammates live

Teammates are defined **per environment**, inside that environment's `cloud` block in `.larakube.json`. That's deliberate: you can grant someone access to `staging` without giving them `production`.

```json title=".larakube.json"
"environments": {
  "production": {
    "cloud": {
      "ip": "203.0.113.10",
      "user": "deploy",
      "port": 22,
      "key": "~/.ssh/id_rsa",
      "teammates": [
        {
          "username": "alice",
          "name": "Alice Rivera",
          "state": "present",
          "groups": ["sudo"],
          "shell": "/bin/bash",
          "authorized_keys": [
            { "public_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... alice@laptop" }
          ]
        }
      ]
    }
  }
}
```

### Each entry
- **`username`** — the Linux user to create on the server.
- **`name`** — a human label (whose key this is).
- **`state`** — `present` to ensure the user exists, or `absent` to remove them on the next sync.
- **`groups`** — Linux groups to add them to (e.g. `sudo`).
- **`shell`** — their login shell (e.g. `/bin/bash`).
- **`authorized_keys`** — the public SSH keys allowed to log in as that user.

## 🔄 Adding & syncing

You don't usually hand-write these — the CLI does it for you:

```bash
larakube cloud:configure users
```

It asks which environment (server) you're granting access to, collects the teammate's details, writes them into that environment's `cloud.teammates`, and offers to sync to the server immediately.

### What the sync handles
- **User creation** — creates the Linux user if it doesn't exist.
- **Group management** — ensures the user is in the right groups (e.g. `sudo`).
- **SSH key rotation** — writes the `authorized_keys` file to match the blueprint.
- **Permission hardening** — secure ownership and modes (`700` for `.ssh`, `600` for `authorized_keys`).

To **revoke** access, set that teammate's `state` to `absent` and run `larakube cloud:configure users` again.

:::caution Single-server access only
This is **SSH/OS-level access to one server** — it creates a Linux login with `sudo` on the host at `cloud.ip`. It fits the [Single-Node Hero](../architecture/single-node-hero) / VPS setup, where you and your teammates run `larakube` and `kubectl` from the box itself.

It does **not** fit a multi-node or managed cluster (EKS/GKE/AKS/DOKS) — those nodes are disposable and often can't be logged into, and `sudo` is all-or-nothing (no "read-only" or "just this namespace"). Scoped, multi-person access to a real cluster is **Kubernetes RBAC** — a per-person kubeconfig + a defined role — which is on the [roadmap](../community/roadmap).
:::

## 🛡 Security best practices
- Use `sudo` groups sparingly.
- Prefer **ED25519** SSH keys.
- When a teammate leaves, set `state: absent` and re-run the sync to revoke their access immediately.

## 💡 Coming from Spin Pro?
If you're used to maintaining a central list of keys with tools like Spin Pro, this is the same habit — declare the team in one place, sync it to the server. The difference is the list lives in your blueprint, so your server's access always matches your source control.

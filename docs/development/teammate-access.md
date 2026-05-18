---
sidebar_position: 11
title: Declarative Teammate Access
description: Manage your team's SSH access to your Kubernetes fleet using a declarative .larakube.yml configuration.
---
# 👤 Declarative Teammate Access

LaraKube provides a modern, declarative way to manage SSH access for your team. Instead of manually editing `authorized_keys` on every server, you define your teammates in a central configuration file and sync them with one command.

## 🛠 The `.larakube.yml` Configuration
Your team's access is stored in the `.larakube.yml` file in your project root. This allows you to track access changes in your version control system.

```yaml
users:
  - username: carlo
    name: James Carlo Luchavez
    state: present
    groups: [sudo]
    shell: /bin/bash
    authorized_keys:
      - public_key: "ssh-rsa AAAAB3NzaC1yc2EA..."
```

### Configuration Options
-   **`username`**: The Linux username to be created on the VPS.
-   **`state`**: Set to `present` to ensure the user exists, or `absent` to remove them.
-   **`groups`**: A list of groups (e.g., `sudo`) the user should belong to.
-   **`authorized_keys`**: A list of public keys that should be granted access.

## 🔄 Syncing Access
Adding a teammate to your cluster is as simple as:

1.  **Add** their details to `.larakube.yml` (using the CLI or manual edit).
2.  **Run** the sync command:

```bash
larakube cloud:configure users
```

### What the CLI handles:
-   **User Creation**: Automatically creates the Linux user if they don't exist.
-   **Group Management**: Ensures the user has the correct `sudo` permissions.
-   **SSH Key Rotation**: Completely synchronizes the `authorized_keys` file with your YAML configuration.
-   **Permission Hardening**: Sets secure ownership (`700` for `.ssh`, `600` for `authorized_keys`).

## 💡 Standard Habits
If you are coming from **Spin Pro** or other VPS management tools, you can continue your habit of maintaining a central list of keys. LaraKube's declarative approach ensures that your fleet's access state always matches your source code.

## 🛡 Security Best Practice
-   Always use `sudo` groups sparingly.
-   Encourage teammates to use **ED25519** keys for better security.
-   When a teammate leaves, set their state to `absent` and run `larakube cloud:configure users` to immediately revoke access across your fleet.

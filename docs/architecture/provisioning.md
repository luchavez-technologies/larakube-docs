---
sidebar_position: 3
title: Provisioning with OpenTofu & Terraform
description: How LaraKube CLI uses OpenTofu (with a Terraform fallback) to provision real Laravel infrastructure on DigitalOcean — droplets and managed Kubernetes clusters — behind a single cloud:create command.
---
# Provisioning with OpenTofu & Terraform

`cloud:init` and `cloud:init:doks` assume infrastructure already exists — an IP you can SSH into, or a cluster whose kubeconfig you've already downloaded. `cloud:create` fills the gap *before* that: it actually creates the droplet or the managed cluster, using [OpenTofu](https://opentofu.org) (or Terraform as a drop-in fallback) under the hood.

You never write HCL or run `tofu`/`terraform` yourself. LaraKube CLI renders the configuration, applies it, reads the result back, and hands off to the same k3s/hardening pipeline (or `cloud:init:doks`) that a manually-provisioned server would go through. Terraform-the-tool stays an implementation detail — the same way `kubectl` and Kustomize sit behind `larakube deploy`.

## Why OpenTofu, and why Terraform still works

OpenTofu is the open-source fork of Terraform — same HCL language, same provider ecosystem, MPL-licensed. LaraKube CLI prefers it because it has **native state encryption**, but it doesn't require it:

- **`tofu` found →** used, with state encrypted at rest (see below).
- **only `terraform` found →** used instead. The exact same rendered HCL runs on either binary; state is just plaintext, since Terraform has no built-in encryption.
- **neither found →** LaraKube CLI offers to install OpenTofu for you (`brew install opentofu` on macOS, the official `install-opentofu.sh` on Linux/WSL2), rather than silently forcing an install.

Either way it's a **native host binary**, resolved the same way `kubectl` is — not a containerized tool. OpenTofu ships as a single static Go binary, but it's *stateful* (state file + provider-plugin cache), so wrapping it in Docker would mean re-downloading providers on every run for no real benefit.

## The stack model

The unit LaraKube CLI deploys to is an **environment** (`local`, `staging`, `production` — namespace + context + hosts). The unit OpenTofu provisions is a **stack**: one droplet, or one managed cluster. These are deliberately decoupled, because the real-world relationship is **many environments → one stack**:

- Two environments (e.g. `staging` and `production`) can share a single VPS or cluster, isolated by namespace.
- Multiple *projects* can share one stack the same way.
- Each environment can just as easily get its own dedicated stack.

Because a stack can outlive any single project, it's registered **globally** — in `~/.larakube` — not committed into any one repo's blueprint. Running `cloud:create` gives you the choice up front: provision a **new** stack, or **attach** the current environment to an existing one from the registry. `cloud:stacks` lists everything that's been provisioned (name, kind, region, IP/context, bound environments); `cloud:destroy` tears one down and forgets it.

## Where state lives

Each stack's rendered HCL and Tofu state live at `~/.larakube/tofu/<stack>/` — outside any project directory, so there's no `.gitignore` housekeeping and no risk of state leaking into a repo.

- **OpenTofu**: state is **encrypted at rest** using OpenTofu's native `encryption` block (PBKDF2-derived AES-GCM). The passphrase is generated once per stack, stored in the global config, and supplied at runtime via `TF_ENCRYPTION` — it's never written into the HCL itself.
- **Terraform**: no native encryption exists, so state stays plaintext — still machine-local and outside any repo, just not encrypted.
- **Locking**: a stack is provisioned by one operator running one command at a time, so there's no remote backend or state locking in v1 — everything is local to the machine that ran `cloud:create`.

## What actually gets created

Provisioning targets DigitalOcean today (the module contract is written so other providers can slot in later without changing the orchestration):

- **VPS (`--vps`)** — a `digitalocean_droplet`, an SSH key (reused if already uploaded, matched by fingerprint), and a `digitalocean_firewall` opening 22/80/443/6443 (22 and 6443 restrictable to an admin CIDR). Tofu's job stops at the raw IP; the existing k3s-install-and-harden pipeline (UFW, fail2ban, key-only SSH, Traefik) takes it from there — the same pipeline `cloud:init` uses against a manually-created box.
- **Managed (`--managed`)** — a `digitalocean_kubernetes_cluster` with a single node pool, pinned to a resolvable Kubernetes version. Tofu hands the kubeconfig and context back to LaraKube CLI, which merges the kubeconfig locally and runs `cloud:init:doks` to install Traefik + Let's Encrypt — identical to the manual DOKS path.

## What Tofu deliberately doesn't touch

App secrets — `.env` files, scoped kubeconfigs — never enter Tofu or its state. Those continue to flow through the existing `cloud:configure --only=ci` → GitHub Secrets path. Tofu's scope is infrastructure only: the DigitalOcean API token is injected as `TF_VAR_do_token` from the global config and never written into HCL.

## See also

- [`cloud:create`, `cloud:destroy`, `cloud:stacks`](../commands/cloud) — the command reference.
- [Provisioning Infrastructure (cloud:create)](../deployment/cloud-create) — the walkthrough.
- [DigitalOcean Kubernetes (DOKS) Deployment](../deployment/doks-quickstart) — what happens after a managed cluster exists.

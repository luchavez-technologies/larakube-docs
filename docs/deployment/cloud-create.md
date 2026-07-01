---
sidebar_position: 5
title: Provisioning Infrastructure (cloud:create)
description: Provision a DigitalOcean droplet or managed Kubernetes cluster with larakube cloud:create, then attach environments, list stacks, and tear infrastructure down.
---
# Provisioning Infrastructure (`cloud:create`)

`cloud:create` provisions real infrastructure — a droplet or a managed Kubernetes cluster — instead of assuming you already have one. It's the step that now comes *before* `cloud:init` / `cloud:init:doks` in the [deployment journey](./journey): OpenTofu creates the box or the cluster, then LaraKube CLI hands off to the same pipeline a manually-created server would go through.

See [Provisioning with OpenTofu & Terraform](../architecture/provisioning) for how this works under the hood (the stack model, state, encryption). This page is the walkthrough.

:::tip Not required
You can still bring your own droplet or cluster (created by hand, or via `doctl`) and run `cloud:init` / `cloud:init:doks` directly against it — see the [DOKS quickstart](./doks-quickstart) for that path. `cloud:create` is the automated alternative.
:::

## Prerequisites

- A DigitalOcean account with billing enabled, and an [API token](https://cloud.digitalocean.com/account/api/tokens) (read + write) — `cloud:create` prompts for and saves this on first use.
- OpenTofu or Terraform on your PATH — `cloud:create` offers to install OpenTofu for you if neither is found.
- An SSH key pair (for the VPS path).

## Provision a VPS

```bash
larakube cloud:create --provider=do --vps
```

Walks through:
1. **Stack name, region, droplet size** — sensible defaults (`s-1vcpu-1gb`, `nyc1`) you can override.
2. **SSH key** — path to your private key; the matching public key is uploaded (or reused if DigitalOcean already has it).
3. **Admin CIDR (optional)** — restrict SSH and the k3s API (6443) to your IP instead of leaving them open.
4. **Apply** — a final confirmation before anything is created (real resources, real cost).

Once the droplet exists, LaraKube CLI waits for SSH to come up, then runs the same install-and-harden pipeline as `cloud:init`: K3s, UFW/fail2ban, key-only SSH, Traefik. If you ran this from inside a project (and passed/answered an environment), that environment is bound to the new stack automatically — no separate `cloud:configure:base` step needed.

## Provision a managed cluster (DOKS)

```bash
larakube cloud:create --provider=do --managed
```

Prompts for stack name, region, node size, node count, and (optionally) a Kubernetes version prefix. After `tofu apply`, LaraKube CLI merges the cluster's kubeconfig locally and runs `cloud:init:doks` for you — Traefik + Let's Encrypt install, LoadBalancer IP included. Same binding behavior as the VPS path if an environment is attached.

:::tip Node count drives the strategy
A single node pool provisions the `single-node` strategy; 2+ nodes provisions `multi-node-ha` (stateless app pods — see [Going multi-node](./doks-quickstart#going-multi-node)).
:::

## Attaching an environment to an existing stack

If a stack of the requested kind (`vps` or `doks`) is already registered, `cloud:create` asks up front whether to provision a **new** one or **attach** the current environment to an existing one:

```bash
larakube cloud:create staging
# Create a NEW vps stack? (No = attach this env to an existing one)
```

Attaching does no provisioning — it just records the stack's IP/context on the environment (namespace-isolated from anything else already deployed there) and registers the binding. This is how two environments, or two different projects, end up co-tenant on one VPS or cluster. See [Two Apps, One Server](./multiple-projects) and [Two Environments, One Server](./two-envs-one-server).

## Listing and destroying stacks

```bash
larakube cloud:stacks
```

Lists every stack registered on this machine — name, kind, region, IP/context, and which `app/environment` pairs are bound to it.

```bash
larakube cloud:destroy [stack]
```

Runs `tofu destroy` against the chosen stack and removes it from the registry. It warns if any environments are still bound (best-effort — only bindings recorded on this machine show up), requires a typed confirmation, and offers to remove the local kube-context afterward. This is destructive and permanent — it deletes the droplet or cluster and everything on it.

`cloud:destroy` is distinct from [`cloud:nuke`](../commands/cloud), which only wipes an app's namespace/resources and leaves the underlying infrastructure running.

## Next steps

Once a stack exists and an environment is bound to it, the rest of the journey is unchanged:

```bash
larakube cloud:configure:registry <environment>   # container registry
larakube cloud:configure:gha <environment>         # CI secrets
larakube cloud:deploy <environment>
```

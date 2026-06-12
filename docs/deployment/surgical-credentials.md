---
sidebar_position: 6
title: Surgical Credentials
description: How LaraKube CLI hands GitHub Actions a namespace-scoped ServiceAccount token — never your cluster-admin cert — so a leaked secret can touch only one namespace.
---
# 🔐 Surgical Credentials

When you set up CI/CD (`larakube cloud:configure:gha`), GitHub Actions needs credentials to deploy to your cluster. The danger is obvious: a secret sitting in a repo is the single most likely thing to leak. So LaraKube CLI **never** gives the runner your admin cert. It gives it a **namespace-scoped ServiceAccount token** that can touch *one* namespace and nothing else.

## What gets uploaded

`gha:configure` runs **locally, with your admin context**, and does this once:

1. **Bootstrap (admin)** — creates the `{app}-{env}` namespace, plus a `deployer` **ServiceAccount**, a namespaced **Role**, and a **RoleBinding** locked to that namespace.
2. **Mint (admin)** — issues a long-lived, `Secret`-bound token for that ServiceAccount.
3. **Assemble** — builds a standalone kubeconfig from the cluster's server URL + CA + that token.
4. **Upload** — stores it as the `{ENV}_KUBECONFIG` GitHub secret.

The GitHub runner is then a **pure consumer** — it holds only that scoped kubeconfig. It cannot mint credentials, read another namespace, or touch anything cluster-scoped.

## Why this is the real "least privilege"

A namespaced `Role` can only grant **namespaced** resources. So the `deployer` token can manage Deployments, Services, ConfigMaps, Secrets, Ingresses, PVCs, CronJobs, etc. **inside `{app}-{env}` — and is forbidden everywhere else.** You can prove it:

```bash
# yes — inside its own namespace
kubectl auth can-i create deployments -n myapp-production \
  --as=system:serviceaccount:myapp-production:deployer        # → yes

# no — another namespace, or cluster-scoped
kubectl auth can-i get secrets -n default \
  --as=system:serviceaccount:myapp-production:deployer        # → no
kubectl auth can-i '*' '*' \
  --as=system:serviceaccount:myapp-production:deployer        # → no
```

If `App A`'s repo is compromised, the attacker gets deploy access to **`app-a-production` only** — not your other apps, not the shared Commons, not the node. Blast radius = one namespace.

> This is the same credential model the manual `cloud:deploy` dogfoods locally — your admin kubeconfig never leaves your machine; the actual apply runs as `deployer`.

## One operational note

Because the `deployer` token is namespace-scoped, it **cannot apply the cluster-scoped `Namespace` object**. That's by design:
- The namespace is created once, by admin, at `gha:configure` time.
- The generated workflow **strips the `Namespace`** from the manifests before applying, so the scoped runner only ever applies namespaced resources.

And because a namespaced ServiceAccount can't modify its **own** Role, a CLI upgrade that *widens* the Role only takes effect when an admin re-applies it — so after upgrading LaraKube CLI, **re-run `larakube cloud:configure:gha {env}`** to refresh the scoped credential.

*With LaraKube CLI, the credential that leaves your machine is as small as it can possibly be.*

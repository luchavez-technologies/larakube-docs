---
sidebar_position: 4
title: Rotating & Revoking Credentials
description: See, rotate, and revoke the namespace-scoped deploy credentials LaraKube issues — audit with cluster:users, rotate after a leak, revoke for offboarding.
---
# 🔁 Rotating & Revoking Credentials

The [namespace-scoped deploy credentials](./overview#2--namespace-scoped-deploys) LaraKube issues have a lifecycle. This page is the operational side: **see what you've granted, rotate after a leak, and revoke when you're done.**

## See what you have

```bash
larakube cluster:users
```
Lists every LaraKube identity across the cluster — deploy ServiceAccounts (`Namespace · ServiceAccount · App · Env · CI token`) and teammates. Inside a project, name an environment (or omit it to pick one) to list just who has access there. To audit one credential's *actual* permissions (read live, so drift shows), add `--scope`:

```bash
larakube cluster:users myapp-production --scope
```
This prints the live `deployer` Role's rules, confirms the RoleBinding actually binds the SA (flags "no scope!" if not), and shows the CI token state.

## Rotate — after a leak (keep shipping)

If a `{ENV}_KUBECONFIG` secret leaks, you want the leaked token **dead** but CI **still working**. That's a rotate, not a revoke:

```bash
larakube cloud:configure:gha staging --rotate
```
This deletes the current bound-token Secret (the leaked token dies instantly), mints a **fresh** one, and re-uploads the new scoped kubeconfig to GitHub. Your next deploy uses the new token; the leaked copy is worthless.

> Because the token was only ever scoped to one namespace, even *before* you rotate, the blast radius of the leak was already one namespace — rotating just closes it entirely.

## Revoke — offboarding or a hard cut

To remove deploy access entirely (decommissioning an app/env, or a hard kill):

```bash
larakube cluster:revoke myapp-staging
```
This deletes the `deployer` ServiceAccount, Role, RoleBinding, and token in that namespace. Any kubeconfig using its token is immediately dead.

- **Running workloads are untouched.** Revoke removes the *credential*, not the app — the pods keep serving. Use [`cloud:nuke`](../deployment/manual-deploy) to remove the app itself.
- `--with-secret` also deletes the GitHub `{ENV}_KUBECONFIG` secret (best-effort; run inside the repo).
- `--force` skips the confirmation.

To re-grant later, just run `larakube cloud:configure:gha <env>` (or `cloud:deploy` for the manual path) again.

## Which do I use?

| Situation | Command |
|---|---|
| "Who has access?" / "What can a credential do?" | `cluster:users [env]` lists access · add `--scope` to audit a deploy SA's live rules |
| "A CI secret leaked — kill it, keep deploying" | `cloud:configure:gha <env> --rotate` |
| "Decommissioning this app/env" | `cluster:revoke <namespace> --with-secret` |
| "I upgraded the CLI and the Role changed" | `cloud:configure:gha <env>` (re-applies the Role) |

## A note on upgrades

A namespace-scoped ServiceAccount can't modify its **own** Role, so a CLI upgrade that *widens* the Role only takes effect when an admin re-applies it. The manual `cloud:deploy` does this on every run; a pure-CI setup should **re-run `cloud:configure:gha <env>`** after upgrading LaraKube.

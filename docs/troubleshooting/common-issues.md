---
sidebar_position: 1
title: Common Issues
description: Human-friendly solutions for common Kubernetes and LaraKube orchestration hurdles.
---
# 🚑 Common Issues & Fixes

Even the best-orchestrated fleets hit a snag. This guide provides human-friendly solutions for common hurdles you might encounter while using LaraKube.

## 🔒 HTTPS / Trust Issues (Start Here)
**Symptom:** Your browser shows a security warning, a `.kube` domain won't load over HTTPS, or you see certificate errors in the console.

**First diagnostic to run:**
```bash
larakube trust:check
```

`trust:check` probes the entire local HTTPS trust chain — CA files in `~/.larakube/certificates/`, keychain trust, live DNS resolution for `.kube` domains, system cert validity, and per-app cert validity — and tells you exactly which step is broken. It returns exit code `1` if any issues are found.

**Common fixes based on `trust:check` output:**

- **CA not trusted in keychain**: run `larakube trust` to install it.
- **DNS not resolving**: run `larakube hosts` (and ensure dnsmasq is running as a root daemon on macOS — see [macOS setup](../onboarding/operating-systems/macos)).
- **CA files missing or corrupted**: run `larakube trust:reset` to destroy and regenerate the local CA. Per-app certs regenerate automatically on the next `larakube up`.

## 📁 Unreachable Projects
**Symptom:** The LaraKube Console displays a **"Source path unreachable"** warning or fails to sync with a project.

**The Cause:** This usually happens when the LaraKube Console is running in a different environment or context than where the project was created, or if the project's workspace mount has moved on your host machine.

**The Fix:**
1. **Verify Mounts:** Ensure your host machine's code directory is correctly mounted to the LaraKube Docker daemon.
2. **Align Paths:** The Console and CLI must agree on where your projects live. If you've moved your project folder, run `larakube doctor` inside the project directory to re-align the metadata.
3. **Console Refresh:** Click the "Re-scan Projects" button in the Console settings to update its internal path registry.

## 🔌 Traefik Networking Issues
**Symptom:** You can't access `https://traefik.kube` or your project's `.kube` domain.

**The Fix:**
1. **Run trust:check:** `larakube trust:check` identifies whether the problem is the CA, DNS, or the cert itself.
2. **Trust the CA:** Ensure you have run `larakube trust`. This installs the local SSL authority required for valid HTTPS.
3. **Check Traefik Status:** Check the console health or use `larakube about` and verify the `traefik` pod is in a `Running` state.
4. **Restart Traefik:** If networking feels "stuck," run `larakube traefik:restart` to perform a graceful rollout.

## 💾 Volume & Persistence Issues
**Symptom:** A database pod is stuck in a `Pending` state with an error like `FailedScheduling` or volume errors.

**The Fix:**
1. **Recreate Strategy:** LaraKube uses a `Recreate` strategy for databases to prevent volume corruption. Ensure you aren't trying to run multiple instances of the same database on the same volume.
2. **Purge & Heal:** If a volume is truly corrupted, you can run `larakube purge` followed by `larakube heal` to reset the manifests and attempt a fresh mount.

## 🚀 Vite / HMR Issues
**Symptom:** Your frontend changes aren't reflecting, or you see Vite connection errors in the browser console.

**The Fix:**
1. **Harden Config:** Ensure your `vite.config.js` has been "hardened" by LaraKube. You can manually trigger this by running `larakube add vite` (it will detect and fix existing configs).
2. **Port Alignment:** Verify that your `WATCH_PORT` in `.env` matches the port defined in your `larakube-web` service manifests.

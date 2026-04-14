# Introduction

LaraKube is an opinionated CLI application built with Laravel Zero, designed to provide a seamless Kubernetes experience for Laravel developers.

## Why LaraKube?

Traditional Kubernetes setups can be complex and overwhelming. LaraKube simplifies this by:

- **Zero-Host Dependency:** Creating and managing projects inside Docker containers.
- **Opinionated Defaults:** Providing a robust foundation based on best practices.
- **Development to Deployment:** Ensuring a consistent experience from your local machine to the cloud.
- **Lego-like Features:** Add features like Horizon, Reverb, or Scout anytime with a single command.

## Core Mandates

1. **Security First:** No root database access, secure secrets management.
2. **Developer Experience:** Instant updates via Live Mounting, built-in visualization with K9s.
3. **Pure YAML:** Using Kustomize for clean, maintainable manifests.

---
sidebar_position: 1
---
# Tunneling (larakube tunnel)

LaraKube provides an intelligent tunneling command that makes connecting to cluster-internal databases feel like they are running on your own machine.

## How it Works
When you run `larakube tunnel`, the CLI:
1.  **Scans your Namespace:** It identifies which database services are running (MySQL, Postgres, Redis).
2.  **Checks Port Availability:** It verifies if the standard local port (e.g., `5432`) is already in use by another project.
3.  **Auto-Resolves Conflicts:** If a port is occupied, it automatically increments to the next available port (e.g., `5433`).
4.  **Generates Credentials:** It prints the exact connection details you need to copy into your GUI client.

## Usage
Simply run the command in your project root:

```bash
larakube tunnel
```

Select your service, and you're ready to go!

## Why not use Ingress?
For web traffic, Ingress is perfect. But for database traffic, using Ingress is often insecure and complex to configure. **Port Forwarding (Tunneling)** is the industry-standard way to safely access internal databases without exposing them to the public internet.

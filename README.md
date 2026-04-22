# LaraKube Documentation

The official documentation and AI context suite for **LaraKube** — a professional Kubernetes Orchestrator for Laravel.

## 📂 Architecture
Built with [Docusaurus 3.x](https://docusaurus.io/) for high performance, accessibility, and AI discovery.

-   **Frontend**: React (TypeScript) with Vanilla CSS.
-   **AI Native**: Serves `llms.txt` and `llms-full.txt` at the root for instant AI synthesis.
-   **Zero-Host Dependencies**: All development is performed via Docker-based daemon runners.

## 🛠 Development Wrappers

We use standardized Docker-based wrappers to ensure environment parity across all machines.

-   **Node Runtime**: `./node` (Managed by the `larakube-docs` container)
-   **NPM Commands**: `./npm` (Forwards commands to the container)
-   **Cleanup**: Use `./node stop` to gracefully shutdown the development daemon.

### Local Development

To start the documentation server:

```bash
./node start
```

This starts the Docusaurus development server at [http://larakube.dev.test:3000](http://larakube.dev.test:3000) (if mapped in your hosts file).

### AI SEO Standard

LaraKube documentation is designed for instant AI SEO. To regenerate the master context files:

```bash
./npm run build
```

This triggers `sync-ai-context.js` to refresh `llms.txt` and `llms-full.txt`.

## 🤝 Community & Support

-   **Discord**: [Join our community](https://discord.gg/g2pFhpEh9G)
-   **Contributions**: Check our [CONTRIBUTING.md](CONTRIBUTING.md) for standards.
-   **License**: MIT

---
<iframe src="https://github.com/sponsors/luchavez-technologies/button" title="Sponsor luchavez-technologies" height="32" width="114" style="border: 0; border-radius: 6px;"></iframe>

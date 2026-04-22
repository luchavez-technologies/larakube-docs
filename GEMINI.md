# LaraKube Docs Context (GEMINI.md)

This file provides the technical standards and workflows for the LaraKube Documentation.

## 🤖 AI SEO Standard
LaraKube documentation is designed for instant AI synthesis:
1.  **Master Context**: Serves `llms.txt` and `llms-full.txt` at the root.
2.  **Automated Sync**: `sync-ai-context.js` regenerates the master context for AI agents.

## 📂 Content Standards
-   **SEO Optimized**: Frontmatter-driven metadata for high Google and AI search visibility.
-   **RAG Friendly**: Clean Markdown structure for Algolia and LLM ingestion.

## 📦 Development Wrappers
-   **Daemon Runner**: Persistent Docker-based development environment for zero-host dependencies:
    -   **Node**: `./node` (Daemon: `larakube-docs`)
    -   **NPM**: `./npm` (Forwards to `larakube-docs`)
    -   *Note*: Use `./node stop` to cleanup the daemon.

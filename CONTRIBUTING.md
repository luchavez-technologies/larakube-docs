# Contributing to LaraKube Documentation

Thank you for your interest in improving LaraKube! We want to make it as easy as possible for you to contribute.

## 🛠 Local Development (Docker Only)

LaraKube follows a **Zero-Host Dependency** philosophy. You do **not** need Node.js or NPM installed on your machine. We provide containerized development wrappers.

1.  **Navigate to the docs directory:**
    ```bash
    cd docs
    ```
2.  **Start the development server:**
    ```bash
    ./npm start
    ```
3.  **Access the site:** Open your browser to [http://localhost:3000](http://localhost:3000).

Any changes you make to the Markdown files in the `docs/` or `blog/` folders will be reflected instantly in your browser!

## 📂 Project Structure

-   `docs/`: The core documentation pages (Markdown).
-   `blog/`: News, updates, and architectural deep-dives.
-   `src/`: Custom React components and Vanilla CSS styles.
-   `static/`: Images, logos, and AI context files (`llms.txt`).
-   `docusaurus.config.ts`: The main configuration file.

## 🤖 AI SEO Standards

Every contribution should consider AI discovery:
-   **Metadata**: Ensure `frontmatter` includes descriptive titles and descriptions.
-   **Clean Markdown**: Keep structures simple for RAG ingestion.
-   **AI Sync**: If you add new pages, run `./npm run build` locally to ensure they are indexed in the `llms.txt` context files.

## ✍️ Writing Guidelines

-   **Tone**: Professional, technical, yet encouraging for Laravel developers.
-   **Consistency**: Follow the existing architectural naming conventions.
-   **Code Blocks**: Always include the correct language tag (e.g., `bash`, `php`, `yaml`).

## 🧹 Cleanup

When you're done developing, you can stop the background daemon:

```bash
./node stop
```

---
**Happy Orchestrating!** 🚀

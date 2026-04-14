# Contributing to LaraKube Documentation

Thank you for your interest in improving LaraKube! We want to make it as easy as possible for you to contribute.

## Local Development (Docker Only)

You do **not** need Node.js or NPM installed on your computer to work on the docs. We have provided a containerized environment.

1.  **Clone the repository.**
2.  **Navigate to the docs directory:**
    ```bash
    cd docs
    ```
3.  **Run the helper script:**
    ```bash
    ./run-docs.sh
    ```
4.  **Access the site:** Open your browser to `http://localhost:3000`.

Any changes you make to the Markdown files in the `docs/` folder will be reflected instantly in your browser!

## Project Structure

- `docs/`: Contains all the documentation pages (Markdown).
- `src/`: Contains custom React components and styles.
- `static/`: Contains images and other static assets.
- `docusaurus.config.ts`: The main configuration file for the site.

## Writing Guidelines

- Use clear, professional, and helpful language.
- Follow existing formatting and style patterns.
- Ensure all code blocks have the correct language tag (e.g., `bash`, `php`, `yaml`).

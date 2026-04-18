---
sidebar_position: 5
---
# SQLite

SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. It is the zero-configuration choice for Laravel developers.

## 📁 Local Persistence
Unlike standard container storage which is ephemeral, LaraKube ensures your SQLite data survives pod restarts:
- **Persistent Volume:** Your `database/database.sqlite` file is stored on a Persistent Volume Claim (PVC).
- **Host Mounting:** Locally, this maps directly to your project's `database` folder on your Mac or Linux machine.

## 🚀 When to use SQLite
- **Rapid Prototyping:** Start building without needing to wait for a database server to boot.
- **Small Applications:** Perfect for sites with low to medium traffic that don't require the overhead of a full database server.
- **Testing:** Easily reset your state by deleting a single file.

## 🔌 Connection
You don't need a tunnel for SQLite!
1. Open your project folder.
2. Open `database/database.sqlite` directly with your preferred client (like TablePlus).

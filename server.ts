import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database Setup
// We'll try MariaDB first as requested, but fallback to SQLite for the preview environment
// so the user can actually use the app immediately.
let dbType: 'mariadb' | 'sqlite' = 'sqlite';
let mariaPool: mysql.Pool | null = null;
let sqliteDb: any = null;

async function initDb() {
  try {
    // Attempt MariaDB connection if environment variables are provided
    if (process.env.DB_HOST && process.env.DB_USER) {
      mariaPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
      });
      
      // Test connection
      const connection = await mariaPool.getConnection();
      console.log("Connected to MariaDB");
      await connection.query(`
        CREATE TABLE IF NOT EXISTS data_entries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      connection.release();
      dbType = 'mariadb';
    } else {
      throw new Error("MariaDB env vars missing, falling back to SQLite");
    }
  } catch (error) {
    console.log("MariaDB connection failed or not configured. Using SQLite for preview.");
    sqliteDb = new Database("ds_learning.db");
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS data_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    dbType = 'sqlite';
  }
}

// API Routes
app.get("/api/get", async (req, res) => {
  try {
    let rows;
    if (dbType === 'mariadb' && mariaPool) {
      [rows] = await mariaPool.query("SELECT * FROM data_entries ORDER BY created_at DESC");
    } else {
      rows = sqliteDb.prepare("SELECT * FROM data_entries ORDER BY created_at DESC").all();
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/add", async (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: "Value is required" });
  
  try {
    if (dbType === 'mariadb' && mariaPool) {
      await mariaPool.query("INSERT INTO data_entries (value) VALUES (?)", [value]);
    } else {
      sqliteDb.prepare("INSERT INTO data_entries (value) VALUES (?)").run(value);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID is required" });
  
  try {
    if (dbType === 'mariadb' && mariaPool) {
      await mariaPool.query("DELETE FROM data_entries WHERE id = ?", [id]);
    } else {
      sqliteDb.prepare("DELETE FROM data_entries WHERE id = ?").run(id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/reset", async (req, res) => {
  try {
    if (dbType === 'mariadb' && mariaPool) {
      await mariaPool.query("DELETE FROM data_entries");
    } else {
      sqliteDb.prepare("DELETE FROM data_entries").run();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (Mode: ${dbType})`);
  });
}

startServer();

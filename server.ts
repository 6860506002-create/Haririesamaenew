import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MariaDB Setup
let mariaPool: mysql.Pool | null = null;
let dbStatus: 'connected' | 'error' | 'disconnected' = 'disconnected';
let dbErrorMessage: string = "";

async function initDb() {
  try {
    if (process.env.DB_HOST && process.env.DB_USER) {
      mariaPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
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
      dbStatus = 'connected';
    } else {
      dbStatus = 'disconnected';
      dbErrorMessage = "MariaDB environment variables (DB_HOST, DB_USER, etc.) are missing.";
    }
  } catch (error) {
    console.error("MariaDB connection failed:", error);
    dbStatus = 'error';
    dbErrorMessage = (error as Error).message;
  }
}

// API Routes
app.get("/api/status", (req, res) => {
  res.json({ status: dbStatus, error: dbErrorMessage });
});

app.get("/api/get", async (req, res) => {
  try {
    if (!mariaPool) throw new Error("Database not connected");
    const [rows] = await mariaPool.query("SELECT * FROM data_entries ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/add", async (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: "Value is required" });
  
  try {
    if (!mariaPool) throw new Error("Database not connected");
    await mariaPool.query("INSERT INTO data_entries (value) VALUES (?)", [value]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID is required" });
  
  try {
    if (!mariaPool) throw new Error("Database not connected");
    await mariaPool.query("DELETE FROM data_entries WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/reset", async (req, res) => {
  try {
    if (!mariaPool) throw new Error("Database not connected");
    await mariaPool.query("DELETE FROM data_entries");
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (Database: MariaDB)`);
  });
}

startServer();

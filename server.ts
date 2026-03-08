import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database Setup
let mariaPool: mysql.Pool | null = null;
let sqliteDb: Database.Database | null = null;
let supabaseClient: any = null;
let dbStatus: 'connected' | 'error' | 'local' | 'supabase' = 'local';
let dbErrorMessage: string = "";

async function initDb() {
  // Reset status
  dbStatus = 'local';
  dbErrorMessage = "";

  // 1. Try Supabase first (Cloud-friendly)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      // Test connection by fetching one row
      const { error } = await supabaseClient.from('data_entries').select('id').limit(1);
      if (!error || error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log("Connected to Supabase successfully.");
        dbStatus = 'supabase';
        return;
      }
    } catch (e) {
      console.error("Supabase connection failed:", e);
    }
  }

  // 2. Try MariaDB (Traditional Server)
  try {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    
    if (host && host.trim() !== "" && user && user.trim() !== "") {
      mariaPool = mysql.createPool({
        host: host,
        user: user,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000
      });
      
      const connection = await mariaPool.getConnection();
      console.log("Connected to MariaDB successfully.");
      await connection.query(`
        CREATE TABLE IF NOT EXISTS data_entries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      connection.release();
      dbStatus = 'connected';
      return;
    }
  } catch (error) {
    console.error("MariaDB connection failed:", error);
    dbErrorMessage = (error as Error).message;
  }

  // 3. Fallback to SQLite (Local)
  if (!sqliteDb) {
    try {
      const sqlitePath = path.join(process.cwd(), "local_data.db");
      sqliteDb = new Database(sqlitePath);
      sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS data_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Local SQLite initialized as fallback.");
      dbStatus = 'local';
    } catch (err) {
      console.error("Failed to initialize SQLite fallback:", err);
      dbStatus = 'error';
      dbErrorMessage = "All database connections failed (Supabase, MariaDB, SQLite)";
    }
  }
}

// API Routes
app.get("/api/status", (req, res) => {
  res.json({ status: dbStatus, error: dbErrorMessage });
});

app.post("/api/reconnect", async (req, res) => {
  console.log("Retrying database connection...");
  await initDb();
  res.json({ status: dbStatus, error: dbErrorMessage });
});

app.get("/api/get", async (req, res) => {
  try {
    if (dbStatus === 'supabase' && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('data_entries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data);
    } else if (dbStatus === 'connected' && mariaPool) {
      const [rows] = await mariaPool.query("SELECT * FROM data_entries ORDER BY created_at DESC");
      res.json(rows);
    } else if (sqliteDb) {
      const rows = sqliteDb.prepare("SELECT * FROM data_entries ORDER BY created_at DESC").all();
      res.json(rows);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/add", async (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: "Value is required" });
  
  try {
    if (dbStatus === 'supabase' && supabaseClient) {
      const { error } = await supabaseClient
        .from('data_entries')
        .insert([{ value }]);
      if (error) throw error;
    } else if (dbStatus === 'connected' && mariaPool) {
      await mariaPool.query("INSERT INTO data_entries (value) VALUES (?)", [value]);
    } else if (sqliteDb) {
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
    if (dbStatus === 'supabase' && supabaseClient) {
      const { error } = await supabaseClient
        .from('data_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else if (dbStatus === 'connected' && mariaPool) {
      await mariaPool.query("DELETE FROM data_entries WHERE id = ?", [id]);
    } else if (sqliteDb) {
      sqliteDb.prepare("DELETE FROM data_entries WHERE id = ?").run(id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/reset", async (req, res) => {
  try {
    if (dbStatus === 'supabase' && supabaseClient) {
      const { error } = await supabaseClient
        .from('data_entries')
        .delete()
        .neq('id', 0); // Delete all
      if (error) throw error;
    } else if (dbStatus === 'connected' && mariaPool) {
      await mariaPool.query("DELETE FROM data_entries");
    } else if (sqliteDb) {
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

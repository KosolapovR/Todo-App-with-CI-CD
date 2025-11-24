require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const db = new Database("./database.db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5010;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
// Initialize database tables
function initializeDatabase() {
  console.log("Initializing database tables");
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log("Users table created or already exists");
  } catch (err) {
    console.error("Error creating users table:", err.message);
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log("Todos table created or already exists");
  } catch (err) {
    console.error("Error creating todos table:", err.message);
  }
}

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  console.log("authenticateToken");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

initializeDatabase();

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  console.log("api/auth/register called with:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed, inserting into database");
    const stmt = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    stmt.run(username, hashedPassword);
    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Database error:", error.message);
    if (error.message.includes("UNIQUE constraint failed")) {
      console.log("Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    }
    console.log("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    console.log("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Todo routes (protected)
app.get("/api/todos", authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC"
    );
    const rows = stmt.all(req.user.id);
    res.json(rows);
  } catch (error) {
    console.log("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/todos", authenticateToken, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  try {
    const stmt = db.prepare("INSERT INTO todos (user_id, title) VALUES (?, ?)");
    const result = stmt.run(req.user.id, title);
    res
      .status(201)
      .json({ id: result.lastInsertRowid, title, completed: false });
  } catch (error) {
    console.log("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/todos/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (title === undefined && completed === undefined) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    let query = "UPDATE todos SET ";
    const params = [];
    const updates = [];

    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (completed !== undefined) {
      updates.push("completed = ?");
      params.push(completed ? 1 : 0);
    }

    query += updates.join(", ") + " WHERE id = ? AND user_id = ?";
    params.push(id, req.user.id);

    const stmt = db.prepare(query);
    const result = stmt.run(...params);
    if (result.changes === 0)
      return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo updated" });
  } catch (error) {
    console.log("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/todos/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, req.user.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.log("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/health", (req, res) => {
  console.log("Health check called");
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;

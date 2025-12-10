import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import Database, { SqliteError } from 'better-sqlite3';
import cors from 'cors';
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger';

interface AuthenticatedUser {
  id: number;
  username: string;
}

interface User {
  id: number;
  password: string;
  username: string;
}

interface Todo {
  completed: number;
  created_at: string;
  id: number;
  title: string;
  user_id: number;
}

interface CustomRequest extends Request {
  user?: AuthenticatedUser;
}

// Determine database path based on environment
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : './data/database.db';

// Ensure database directory exists (for non-test)
if (!isTest) {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    logger.info('Database directory created:', dbDir);
  }
}

const db = new Database(dbPath);

const app = express();
const PORT = process.env.PORT || 5010;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
// Initialize database tables
export function initializeDatabase() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      logger.error('Error creating users table:', err.message);
    }
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
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      logger.error('Error creating todos table:', err?.message);
    }
  }
}

export function clearTodos() {
  try {
    db.exec('DELETE FROM todos');
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      logger.error('Error clearing todos:', err?.message);
    }
  }
}

export function clearUsers() {
  try {
    db.exec('DELETE FROM users');
  } catch (err: unknown) {
    if (err instanceof SqliteError) {
      logger.error('Error clearing users:', err?.message);
    }
  }
}

// Middleware to verify JWT
function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
}

initializeDatabase();

// Auth routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare(
      'INSERT INTO users (username, password) VALUES (?, ?)'
    );
    stmt.run(username, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Database error:', err.message);
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User | undefined;
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Todo routes (protected)
app.get(
  '/api/todos',
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const stmt = db.prepare(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC'
      );
      const rows = stmt.all(req.user.id) as Todo[];
      res.json(rows);
    } catch (error) {
      logger.error(
        'Database error:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Database error' });
    }
  }
);

app.post(
  '/api/todos',
  authenticateToken,
  (req: CustomRequest, res: Response) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const stmt = db.prepare(
        'INSERT INTO todos (user_id, title) VALUES (?, ?)'
      );
      const result = stmt.run(req.user.id, title);
      res
        .status(201)
        .json({ id: result.lastInsertRowid, title, completed: false });
    } catch (error) {
      logger.error(
        'Database error:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Database error' });
    }
  }
);

app.put(
  '/api/todos/:id',
  authenticateToken,
  (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      let query = 'UPDATE todos SET ';
      const params = [];
      const updates = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (completed !== undefined) {
        updates.push('completed = ?');
        params.push(completed ? 1 : 0);
      }

      query += `${updates.join(', ')} WHERE id = ? AND user_id = ?`;
      params.push(id, req.user.id);

      const stmt = db.prepare(query);
      const result = stmt.run(...params);
      if (result.changes === 0)
        return res.status(404).json({ error: 'Todo not found' });
      res.json({ message: 'Todo updated' });
    } catch (error) {
      logger.error(
        'Database error:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Database error' });
    }
  }
);

app.delete(
  '/api/todos/:id',
  authenticateToken,
  (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
      const result = stmt.run(id, req.user.id);
      if (result.changes === 0)
        return res.status(404).json({ error: 'Todo not found' });
      res.json({ message: 'Todo deleted' });
    } catch (error) {
      logger.error(
        'Database error:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ error: 'Database error' });
    }
  }
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Only start the server if not running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;

const request = require("supertest");
const app = require("../index");
const Database = require("better-sqlite3");

let db;

beforeAll(() => {
  // Use in-memory database for tests
  db = new Database(":memory:", { verbose: console.log });

  // Initialize tables
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  db.exec(`
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
});

afterAll(() => {
  db.close();
});

describe("Auth API", () => {
  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  test("should not register user with existing username", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser2", password: "testpass" });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser2", password: "testpass" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username already exists");
  });

  test("should login with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "loginuser", password: "loginpass" });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "loginuser", password: "loginpass" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("should not login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "nonexistent", password: "wrongpass" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid credentials");
  });
});

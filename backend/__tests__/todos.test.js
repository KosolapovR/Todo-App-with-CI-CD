const request = require("supertest");
const app = require("../index");
const Database = require("better-sqlite3");

let db;
let token;

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

beforeEach(async () => {
  // Register and login a test user
  await request(app)
    .post("/api/auth/register")
    .send({ username: "todouser", password: "todopass" });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ username: "todouser", password: "todopass" });

  token = loginResponse.body.token;
});

describe("Todos API", () => {
  test("should get empty todos list initially", async () => {
    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should create a new todo", async () => {
    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test todo" });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test todo");
    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBeDefined();
  });

  test("should get todos after creating", async () => {
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First todo" });

    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Second todo" });

    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe("Second todo");
    expect(response.body[1].title).toBe("First todo");
  });

  test("should update a todo", async () => {
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Update me" });

    const todoId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated title", completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe("Todo updated");

    const getResponse = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.body[0].title).toBe("Updated title");
    expect(getResponse.body[0].completed).toBe(1);
  });

  test("should delete a todo", async () => {
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete me" });

    const todoId = createResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Todo deleted");

    const getResponse = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.body.length).toBe(0);
  });

  test("should not access todos without token", async () => {
    const response = await request(app).get("/api/todos");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Access token required");
  });

  test("should not access other user's todos", async () => {
    // Create todo for first user
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My todo" });

    // Register second user
    await request(app)
      .post("/api/auth/register")
      .send({ username: "otheruser", password: "otherpass" });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "otheruser", password: "otherpass" });

    const otherToken = loginResponse.body.token;

    // Second user should not see first user's todos
    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${otherToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

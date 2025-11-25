import request from "supertest";
import app, { clearTodos, clearUsers } from "../index.js";

afterEach(() => {
  // Clear all users and todos after each test
  clearTodos();
  clearUsers();
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

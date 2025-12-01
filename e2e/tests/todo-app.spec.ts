import { test, expect } from '@playwright/test';

const uniqueUserLogin = `e2euser${Date.now()}`;
const userPassword = 'e2epass';

test.describe('Todo App E2E', () => {
  test('should register, login, and manage todos', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://194.87.215.192:80';
    await page.goto(baseUrl);

    await page.click('button:has-text("Register")');

    // Register a new user with unique username

    await page.fill('input[type="text"]', uniqueUserLogin);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button:has-text("Register")');

    // Should be logged in and see todo list
    await expect(page.locator('h2')).toHaveText('My Todos');

    // Add a todo
    await page.fill(
      'input[placeholder="Add a new todo"]',
      'Test todo from e2e'
    );
    await page.click('button:has-text("Add")');

    // Check if todo is added
    await expect(page.locator('li')).toContainText('Test todo from e2e');

    // Mark as completed
    await page.click('input[type="checkbox"]');
    await expect(page.locator('li')).toHaveClass(/completed/);

    // Delete the todo
    await page.click('button:has-text("Delete")');
    await expect(page.locator('li')).toHaveCount(0);

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page.locator('h2')).toHaveText('Login');
  });

  test('should login with existing user', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://194.87.215.192:80';
    await page.goto(baseUrl);

    // Login
    await page.fill('input[type="text"]', 'e2euser');
    await page.fill('input[type="password"]', 'e2epass');
    await page.click('button:has-text("Login")');

    // Should be logged in
    await expect(page.locator('h2')).toHaveText('My Todos');
  });
});

import { rest } from 'msw';

// Mock data store
let todos = [
  {
    id: 1,
    title: 'Mock Todo 1',
    completed: false,
  },
  {
    id: 2,
    title: 'Mock Todo 2',
    completed: true,
  },
];

// Mock handlers for API endpoints
export const handlers = [
  // Auth API handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(ctx.status(201));
  }),

  // Todo API handlers
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todos));
  }),

  rest.get('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id as string));
    if (todo) {
      return res(ctx.status(200), ctx.json(todo));
    }
    return res(ctx.status(404));
  }),

  rest.post('/api/todos', async (req, res, ctx) => {
    const body = await req.json();
    const newTodo = {
      id: todos.length + 1,
      title: body.title,
      completed: false,
    };
    todos.push(newTodo);
    return res(ctx.status(201), ctx.json(newTodo));
  }),

  rest.put('/api/todos/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    const index = todos.findIndex((t) => t.id === parseInt(id as string));
    if (index !== -1) {
      todos[index] = { ...todos[index], ...body };
      return res(ctx.status(200), ctx.json(todos[index]));
    }
    return res(ctx.status(404));
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    todos = todos.filter((t) => t.id !== parseInt(id as string));
    return res(ctx.status(204));
  }),
];

import { rest } from 'msw';

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
    return res(
      ctx.status(200),
      ctx.json([
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
      ])
    );
  }),

  rest.get('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id as string),
        title: 'Mock Todo',
        completed: false,
      })
    );
  }),

  rest.post('/api/todos', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title: 'New Mock Todo',
        completed: false,
      })
    );
  }),

  rest.put('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id as string),
        title: 'Updated Mock Todo',
        completed: true,
      })
    );
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];

import { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { setupStore } from '../store';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  test('render title', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  test('login page rendered if token is empty', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('render todoList if token is defined', async () => {
    const store = setupStore({ auth: { token: 'tokenId' } });
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    expect(screen.getByText('My Todos')).toBeInTheDocument();
  });

  test('toggle todo', async () => {
    const store = setupStore({ auth: { token: 'tokenId' } });
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );

    await waitFor(() =>
      expect(screen.getAllByText(/mock todo \d/i)).toHaveLength(2)
    );

    const checkbox = screen.getByLabelText(/mock todo 1/i);

    expect(checkbox).not.toBeChecked();

    await act(async () => {
      userEvent.click(checkbox);
    });
    await waitFor(() => expect(checkbox).toBeChecked());

    await act(async () => {
      userEvent.click(checkbox);
    });

    await waitFor(() => expect(checkbox).not.toBeChecked());
  });

  test('delete todo', async () => {
    const store = setupStore({ auth: { token: 'tokenId' } });
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );

    await waitFor(() =>
      expect(screen.getAllByText(/mock todo \d/i)).toHaveLength(2)
    );

    const firstTodo = screen.getAllByRole('listitem')[0];
    const deleteBtn = within(firstTodo).getByRole('button', {
      name: /delete/i,
    });

    await act(async () => {
      userEvent.click(deleteBtn);
    });
    await waitFor(() => expect(firstTodo).not.toBeInTheDocument());
  });

  test('allow navigate to registration page', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    const registerButton = screen.getByRole('button', { name: 'Register' });
    expect(registerButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(registerButton);
    });
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  test('successful login', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await act(async () => {
      await userEvent.type(usernameInput, 'testuser');
    });
    await act(async () => {
      await userEvent.type(passwordInput, 'testpass');
    });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('successful registration and login', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    // Navigate to register
    const registerButton = screen.getByRole('button', { name: 'Register' });
    await act(async () => {
      await userEvent.click(registerButton);
    });

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const registerSubmitButton = screen.getByRole('button', {
      name: 'Register',
    });

    await act(async () => {
      await userEvent.type(usernameInput, 'newuser');
    });
    await act(async () => {
      await userEvent.type(passwordInput, 'newpass');
    });
    await act(async () => {
      await userEvent.click(registerSubmitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('todoNameInput has requeired attribute', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // login
    await act(async () => {
      await userEvent.type(usernameInput, 'testuser');
    });
    await act(async () => {
      await userEvent.type(passwordInput, 'testpass');
    });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    const todoNameInput = await screen.findByPlaceholderText('Add a new todo');
    expect(todoNameInput).toHaveAttribute('required');
  });

  test('Add button is disabled when todoNameInput is empty', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // login
    await act(async () => {
      await userEvent.type(usernameInput, 'testuser');
    });
    await act(async () => {
      await userEvent.type(passwordInput, 'testpass');
    });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    const todoNameInput = await screen.findByPlaceholderText('Add a new todo');
    await act(async () => {
      await userEvent.clear(todoNameInput);
    });

    const addTodoButton = screen.getByRole('button', { name: 'Add' });
    expect(addTodoButton).toBeDisabled();
  });

  test('Add button is not disabled when todoNameInput has 0 value', async () => {
    const store = setupStore();
    await act(async () =>
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // login
    await act(async () => {
      await userEvent.type(usernameInput, 'testuser');
    });
    await act(async () => {
      await userEvent.type(passwordInput, 'testpass');
    });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    const todoNameInput = await screen.findByPlaceholderText('Add a new todo');
    await act(async () => {
      await userEvent.type(todoNameInput, '0');
    });

    const addTodoButton = screen.getByRole('button', { name: 'Add' });
    expect(addTodoButton).not.toBeDisabled();
  });
});

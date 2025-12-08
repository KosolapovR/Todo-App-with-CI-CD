import { render, screen } from '@testing-library/react';
import { act } from 'react';
import TodoList from '../TodoList';
import { setupStore } from '../../app/store';
import { Provider } from 'react-redux';

describe('TodoList', () => {
  test('render input', async () => {
    const store = setupStore({});
    await act(async () =>
      render(
        <Provider store={store}>
          <TodoList />
        </Provider>
      )
    );
    expect(screen.getByPlaceholderText('Add a new todo')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { setupStore } from '../../app/store';
import { Provider } from 'react-redux';
import Login from '../Login';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  test('render LoginForm', async () => {
    const store = setupStore({});
    await act(async () =>
      render(
        <Provider store={store}>
          <Login setView={() => {}} />
        </Provider>
      )
    );
    expect(screen.queryAllByText(/login/i)[0]).toBeInTheDocument();
  });

  test('triggers callback on click register button', async () => {
    const fn = jest.fn();
    const store = setupStore({});
    await act(async () =>
      render(
        <Provider store={store}>
          <Login setView={fn} />
        </Provider>
      )
    );
    const registerButton = screen.getByRole('button', { name: /register/i });
    await userEvent.click(registerButton);
    expect(fn).toBeCalledTimes(1);
  });
});

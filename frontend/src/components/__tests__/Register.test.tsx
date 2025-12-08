import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { setupStore } from '../../app/store';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import Register from '../Register';

describe('RegisterForm', () => {
  test('render RegisterForm ', async () => {
    const store = setupStore({});
    await act(async () =>
      render(
        <Provider store={store}>
          <Register setView={() => {}} />
        </Provider>
      )
    );
    expect(screen.queryAllByText(/register/i)[0]).toBeInTheDocument();
  });

  test('triggers callback on click register button', async () => {
    const fn = jest.fn();
    const store = setupStore({});
    await act(async () =>
      render(
        <Provider store={store}>
          <Register setView={fn} />
        </Provider>
      )
    );
    const registerButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(registerButton);
    expect(fn).toBeCalledTimes(1);
  });
});

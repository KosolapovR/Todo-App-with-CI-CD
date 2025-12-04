import React, { useState } from 'react';
import { useLoginMutation } from '../app/api';
import { isHttpError } from '../utils';

interface LoginProps {
  setView: (view: 'login' | 'register') => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { error }] = useLoginMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="error">
            {isHttpError(error)
              ? JSON.stringify(error.data)
              : JSON.stringify(error.code)}
          </p>
        )}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={() => setView('register')}>Register</button>
      </p>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../app/api';
import { isHttpError } from '../utils';

interface RegisterProps {
  setView: (view: 'login' | 'register') => void;
}

const Register: React.FC<RegisterProps> = ({ setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [register, { error: registrationError }] = useRegisterMutation();
  const [login] = useLoginMutation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ username, password })
      .unwrap()
      .then(() => {
        login({ username, password });
      })
      .catch(() => {});
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
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
        {registrationError && (
          <p className="error">
            {isHttpError(registrationError)
              ? JSON.stringify(registrationError.data)
              : JSON.stringify(registrationError.code)}
          </p>
        )}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => setView('login')}>Login</button>
      </p>
    </div>
  );
};

export default Register;

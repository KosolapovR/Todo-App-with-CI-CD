import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../app/api';
import { isHttpError } from '../utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {registrationError && (
          <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {isHttpError(registrationError)
              ? JSON.stringify(registrationError.data)
              : JSON.stringify(registrationError.code)}
          </p>
        )}
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => setView('login')}
        >
          Login
        </Button>
      </p>
    </div>
  );
};

export default Register;

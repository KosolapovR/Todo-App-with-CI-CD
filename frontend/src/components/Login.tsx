import React, { useState } from 'react';
import { useLoginMutation } from '../app/api';
import { isHttpError } from '../utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Login
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
        {error && (
          <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {isHttpError(error)
              ? JSON.stringify(error.data)
              : JSON.stringify(error.code)}
          </p>
        )}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="text-center text-sm mt-4">
        Don't have an account?{' '}
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => setView('register')}
        >
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;

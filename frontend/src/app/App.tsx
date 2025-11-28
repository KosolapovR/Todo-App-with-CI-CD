import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import TodoList from '../components/TodoList';
import { useAppDispatch, useAppSelector } from './hooks';
import { logout } from '../features/auth/authSlice';

const App: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    console.log('Application successfuly mounted!');
  }, []);

  if (!token) {
    return (
      <div className="app">
        <h1>Todo App</h1>
        {view === 'login' ? (
          <Login setView={setView} />
        ) : (
          <Register setView={setView} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Todo App</h1>
        <button
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </header>
      <TodoList />
    </div>
  );
};

export default App;

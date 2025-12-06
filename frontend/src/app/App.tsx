import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import TodoList from '../components/TodoList';
import { useAppDispatch, useAppSelector } from './hooks';
import { logout } from '../features/auth/authSlice';
import { Button } from '../components/ui/button';

const App: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (!token) {
      setView('login');
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Todo App</h1>
          {view === 'login' ? (
            <Login setView={setView} />
          ) : (
            <Register setView={setView} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
          <Button
            variant="outline"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="py-8">
        <TodoList />
      </main>
    </div>
  );
};

export default App;

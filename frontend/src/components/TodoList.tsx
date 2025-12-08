import React, { useState } from 'react';
import {
  useDeleteTodoMutation,
  useGetAllTodosQuery,
  usePostTodoMutation,
  useUpdateTodoMutation,
} from '../app/api';
import { IViewTodo } from '../types';
import { isHttpError } from '../utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const { data, error, isLoading } = useGetAllTodosQuery();
  const [postTodo] = usePostTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    postTodo({ title: newTodo });
    setNewTodo('');
  };

  const handleToggleTodo = async (todo: IViewTodo) => {
    updateTodo({ ...todo, completed: Number(!todo.completed) });
  };

  const handleDeleteTodo = async (todo: IViewTodo) => {
    deleteTodo(todo.id);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My Todos
      </h2>
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          required
          className="flex-1"
        />
        <Button variant="outline" type="submit" disabled={!Boolean(newTodo)}>
          Add
        </Button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {isHttpError(error)
            ? JSON.stringify(error.data)
            : JSON.stringify(error.code)}
        </p>
      )}
      <ul className="space-y-2">
        {isLoading ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : (
          (data || []).map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200 ${todo.completed ? 'opacity-60' : ''}`}
            >
              <input
                id={todo.id.toString()}
                type="checkbox"
                checked={!!todo.completed}
                aria-checked={!!todo.completed}
                onChange={() => handleToggleTodo(todo)}
                className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={todo.id.toString()}
                className={`flex-1 text-gray-700 ${todo.completed ? 'line-through text-gray-500' : ''}`}
              >
                {todo.title}
              </label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTodo(todo)}
                className="ml-2"
              >
                Delete
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;

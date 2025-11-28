import React, { useState } from 'react';
import {
  useDeleteTodoMutation,
  useGetAllTodosQuery,
  usePostTodoMutation,
  useUpdateTodoMutation,
} from '../app/api';
import { IViewTodo } from '../types';
import { isHttpError } from '../utils';

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
    <div className="todo-list">
      <h2>My Todos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          required
        />
        <button type="submit">Add</button>
      </form>
      {error && (
        <p className="error">
          {isHttpError(error)
            ? JSON.stringify(error.data)
            : JSON.stringify(error.code)}
        </p>
      )}
      <ul>
        {isLoading ? (
          <>loading...</>
        ) : (
          (data || []).map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={!!todo.completed}
                onChange={() => handleToggleTodo(todo)}
              />
              <span>{todo.title}</span>
              <button onClick={() => handleDeleteTodo(todo)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;

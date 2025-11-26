import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IViewTodo } from "../../types";

export interface ITodoState {
  items: IViewTodo[];
}
const initialState: ITodoState = { items: [] };

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<IViewTodo>) => {
      state.items.push(action.payload);
    },
    setTodos: (state, action: PayloadAction<IViewTodo[]>) => {
      state.items = action.payload;
    },
    toggleTodo: (state, action: PayloadAction<IViewTodo>) => {
      state.items = state.items.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: todo.completed ? 0 : 1 }
          : todo
      );
    },
    deleteTodo: (state, action: PayloadAction<IViewTodo>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload.id);
    },
  },
});

export const { addTodo, setTodos, toggleTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;

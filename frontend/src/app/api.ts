import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IViewTodo } from "../types";
import { RootState } from "./store";

// Define a service using a base URL and expected endpoints
export const todoApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from your Redux store's auth slice
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Todo"],
  endpoints: (build) => ({
    getTodoById: build.query<IViewTodo, number>({
      query: (id) => `todos/${id}`,
    }),
    getAllTodos: build.query<IViewTodo[], void>({
      query: () => "todos",
      providesTags: ["Todo"],
    }),
    postTodo: build.mutation<IViewTodo, { title: string }>({
      query: (body) => ({
        url: "todos",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: build.mutation<void, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodo: build.mutation<void, IViewTodo>({
      query: (body) => ({
        url: `todos/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth/",
    prepareHeaders: (headers) => {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    login: build.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(todoApi.util.invalidateTags(["Todo"]));
        } catch (error) {}
      },
    }),
    register: build.mutation<void, { username: string; password: string }>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTodoByIdQuery,
  useGetAllTodosQuery,
  usePostTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
export const { useLoginMutation, useRegisterMutation } = authApi;

import { configureStore } from '@reduxjs/toolkit';
import { authApi, todoApi } from './api';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';

const storeOptions = {
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware, authApi.middleware),
};

export const store = configureStore({
  ...storeOptions,
  preloadedState: { auth: { token: localStorage.getItem('token') } },
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersStates}
export type AppDispatch = typeof store.dispatch;

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    ...storeOptions,
    preloadedState,
  });
};

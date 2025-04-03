import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './authSlice';
import todoReducer from './todoSlice';

export interface RootState {
  auth: AuthState;
  todos: ReturnType<typeof todoReducer>;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 
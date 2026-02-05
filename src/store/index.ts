import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // RTK Query reducer
    [api.reducerPath]: api.reducer,
    // Feature slices
    auth: authReducer,
    ui: uiReducer,
  },
  // Add RTK Query middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

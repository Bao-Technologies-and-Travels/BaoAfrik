import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// RTK Query base API - centralized API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  // Tag types for cache invalidation
  tagTypes: ['User', 'Listings', 'Requests', 'Messages', 'Notifications'],
  endpoints: () => ({}), // Endpoints will be injected from separate files
});

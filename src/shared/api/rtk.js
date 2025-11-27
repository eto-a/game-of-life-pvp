import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config/api';
import { clearAuth } from '../../features/auth/auth.slice';

const rawBase = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.jwt;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const res = await rawBase(args, api, extraOptions);
  if (res.error && res.error.status === 401) {
    api.dispatch(clearAuth());
  }
  return res;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me','Rooms','Room','Match','Leaderboard'],
  endpoints: () => ({}),
});

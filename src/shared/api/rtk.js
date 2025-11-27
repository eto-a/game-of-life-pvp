import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as Sentry from '@sentry/react';
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
  try {
    const res = await rawBase(args, api, extraOptions);
    if (res.error) {
      if (res.error.status === 401) {
        api.dispatch(clearAuth());
      } else if (res.error.status >= 500) {
        Sentry.captureMessage('api_error', {
          level: 'error',
          extra: { args, status: res.error.status, data: res.error.data },
        });
      }
    }
    return res;
  } catch (err) {
    Sentry.captureException(err, { extra: { args } });
    throw err;
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me','Rooms','Room','Match','Leaderboard'],
  endpoints: () => ({}),
});

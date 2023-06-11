import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BACKEND_API_URL, REQUEST_TIMEOUT} from '../constants';
import {dropTokens, getTokens, saveTokens} from '../services/token';
import {TokensResponse} from '@fit-friends/shared-types';
import queryString from 'query-string';

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_API_URL,
  timeout: REQUEST_TIMEOUT,
  prepareHeaders: (headers) => {
    const tokens = getTokens();
    if (tokens && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }

    return headers;
  },
  paramsSerializer: (params) => {
    return queryString.stringify(params, {arrayFormat: 'bracket', skipNull: true});
  },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  const response = await baseQuery(args, api, extraOptions);

  if (response?.error?.status === 401) {
    const tokens = getTokens();
    if (tokens) {
      const refreshResponse = await baseQuery({
        url: '/auth/refresh',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      }, api, extraOptions);

      if (!refreshResponse.data) {
        dropTokens();
      }

      const newTokens = refreshResponse.data as TokensResponse;
      saveTokens(newTokens);
      return baseQuery(args, api, extraOptions);
    }
  }

  return response;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Users',
    'JWT',
    'Notifications',
    'Friends',
    'Trainings',
    'Reviews',
    'Subscriptions',
    'Gyms',
    'Eatings',
    'Orders',
    'Balance',
    'CompletedTrainings',
  ],
  endpoints: () => ({}),
});

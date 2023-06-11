import {apiSlice} from '../../api-slice';
import {CoachResponse, SportsmanResponse, UserListResponse, UserResponse} from '@fit-friends/shared-types';
import {UsersQuery} from '../../../types/users-query';


export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UsersQuery>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      serializeQueryArgs: ({endpointName, queryArgs}) => {
        if (queryArgs.page) {
          const newQueryArgs = {...queryArgs};
          delete newQueryArgs.page;
          return `${endpointName}(${JSON.stringify(newQueryArgs)})`;
        }

        return `${endpointName}(${JSON.stringify(queryArgs)})`;
      },
      merge: (currentCache, response) => {
        currentCache.totalPages = response.totalPages;
        currentCache.currentPage = response.currentPage;
        currentCache.users = [...currentCache.users, ...response.users];
      },
      forceRefetch: ({previousArg, currentArg}) => {
        return previousArg?.page !== currentArg?.page;
      },
      providesTags: ['Users'],
    }),
    getUser: builder.query<UserResponse, number>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result) => result ? [{type: 'User', id: result.id}] : [],
    }),
    registerSportsman: builder.mutation<SportsmanResponse, FormData>({
      query: (data) => ({
        url: '/sportsmen',
        body: data,
        method: 'POST',
      }),
    }),
    registerCoach: builder.mutation<CoachResponse, FormData>({
      query: (data) => ({
        url: '/coaches',
        body: data,
        method: 'POST',
      }),
    }),
    updateSportsman: builder.mutation<SportsmanResponse, {sportsmanId: number, data: FormData}>({
      query: ({sportsmanId, data}) => ({
        url: `/sportsmen/${sportsmanId}`,
        body: data,
        method: 'PUT',
      }),
    }),
    updateCoach: builder.mutation<CoachResponse, {coachId: number, data: FormData}>({
      query: ({coachId, data}) => ({
        url: `/coaches/${coachId}`,
        body: data,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useLazyGetUsersQuery,
  useGetUserQuery,
  useRegisterCoachMutation,
  useRegisterSportsmanMutation,
  useUpdateCoachMutation,
  useUpdateSportsmanMutation,
} = usersApi;

import {apiSlice} from '../../api-slice';
import {FriendResponse, StatusResponse, UserListResponse} from '@fit-friends/shared-types';


export const friendsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<UserListResponse, number>({
      query: (page) => ({
        url: '/friends',
        params: {
          page,
        },
      }),
      serializeQueryArgs: ({endpointName}) => {
        return endpointName;
      },
      merge: (currentCache, response) => {
        currentCache.currentPage = response.currentPage;
        currentCache.totalPages = response.totalPages;
        currentCache.users = [...currentCache.users, ...response.users];
      },
      forceRefetch: ({previousArg, currentArg}) => {
        return previousArg !== currentArg;
      },
      providesTags: ['Friends'],
    }),
    createFriend: builder.mutation<FriendResponse, number>({
      query: (id) => ({
        url: `/friends/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends'],
    }),
    deleteFriend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/friends/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Friends'],
    }),
    checkFriend: builder.query<StatusResponse, number>({
      query: (id) => `/friends/${id}/check`,
      providesTags: ['Friends'],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useCreateFriendMutation,
  useDeleteFriendMutation,
  useCheckFriendQuery,
} = friendsApi;

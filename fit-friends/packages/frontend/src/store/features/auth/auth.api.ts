import {apiSlice} from '../../api-slice';
import {LoginData, TokensResponse, UserResponse} from '@fit-friends/shared-types';
import {saveTokens} from '../../../services/token';


export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokensResponse, LoginData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {...credentials},
      }),
      transformResponse: (response: TokensResponse) => {
        console.log(response);
        saveTokens(response);

        return response;
      },
      invalidatesTags: ['JWT'],
    }),
    logout: build.mutation({
      query: () => '/auth/logout',
    }),
    getAuthUser: build.query<UserResponse, number>({
      query: (id) => `/users/${id}`,
      providesTags: [{type: 'User' as const, id: 'AUTH'}],
    }),
  }),
});

export const {useLoginMutation, useGetAuthUserQuery, useLogoutMutation} = authApi;

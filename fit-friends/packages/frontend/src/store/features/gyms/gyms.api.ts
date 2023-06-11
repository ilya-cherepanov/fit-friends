import {apiSlice} from '../../api-slice';
import {GymResponse, ListResponse} from '@fit-friends/shared-types';
import {GymsQuery} from '../../../types/gyms-query';


export const gymsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGym: builder.query<GymResponse, number>({
      query: (gymId) => `/gyms/${gymId}`,
      providesTags: ['Gyms'],
    }),
    getGyms: builder.query<ListResponse<GymResponse>, GymsQuery>({
      query: (query) => ({
        url: '/gyms',
        params: query,
      }),
      // serializeQueryArgs: ({endpointName, queryArgs}) => {
      // },
      providesTags: ['Gyms'],
    }),
    setFavoriteGym: builder.mutation<void, {gymId: number, state: boolean}>({
      query: ({gymId, state}) => ({
        url: `/gyms/${gymId}/favorites/${state}`,
        method: 'POST',
      }),
      invalidatesTags: ['Gyms'],
    }),
  }),
});

export const {
  useLazyGetGymsQuery,
  useGetGymsQuery,
  useGetGymQuery,
  useSetFavoriteGymMutation,
} = gymsApi;

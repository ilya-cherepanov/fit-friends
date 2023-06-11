import {apiSlice} from '../../api-slice';
import {CreateEatingListRequest, DateIntervalRequest, EatingResponse, ListResponse} from '@fit-friends/shared-types';


export const EatingsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEatings: builder.query<ListResponse<EatingResponse>, DateIntervalRequest>({
      query: (dateInterval) => ({
        url: '/eatings',
        body: dateInterval,
      }),
      providesTags: ['Eatings'],
    }),
    saveEatings: builder.mutation<EatingResponse[], CreateEatingListRequest>({
      query: (data) => ({
        url: '/eatings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Eatings'],
    }),
  }),
});


export const {
  useGetEatingsQuery,
  useLazyGetEatingsQuery,
  useSaveEatingsMutation,
} = EatingsApi;

import {apiSlice} from '../../api-slice';
import {ListResponse, ReviewRequest, ReviewResponse} from '@fit-friends/shared-types';


export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ListResponse<ReviewResponse>, number>({
      query: (trainingId) => `/trainings/${trainingId}/reviews`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation<ReviewResponse, ReviewRequest>({
      query: (review) => ({
        url: '/reviews',
        body: review,
        method: 'POST',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});


export const {useGetReviewsQuery, useCreateReviewMutation} = reviewsApi;

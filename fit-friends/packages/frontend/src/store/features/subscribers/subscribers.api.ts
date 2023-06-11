import {apiSlice} from '../../api-slice';


export const subscribersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query<boolean, number>({
      query: (coachId) => `/subscribers/${coachId}`,
      transformResponse: (response: {isSubscribed: boolean}) => {
        return response.isSubscribed;
      },
      providesTags: ['Subscriptions'],
    }),
    setSubscriptionStatus: builder.mutation<boolean, {coachId: number, status: boolean}>({
      query: ({coachId, status}) => ({
        url: `/subscribers/${coachId}/${status}`,
        method: 'POST',
      }),
      transformResponse: (response: {isSubscribed: boolean}) => {
        return response.isSubscribed;
      },
      invalidatesTags: ['Subscriptions'],
    }),
  }),
});

export const {
  useGetSubscriptionStatusQuery,
  useSetSubscriptionStatusMutation,
} = subscribersApi;

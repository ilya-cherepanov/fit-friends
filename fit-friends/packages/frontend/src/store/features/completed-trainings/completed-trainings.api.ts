import {apiSlice} from '../../api-slice';
import {CompletedTrainingResponse, DateIntervalRequest, ListResponse} from '@fit-friends/shared-types';


export const completedTrainingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompletedTrainings: builder.query<ListResponse<CompletedTrainingResponse>, DateIntervalRequest>({
      query: (data) => ({
        url: '/training-diary',
        body: data,
      }),
      providesTags: ['CompletedTrainings'],
    }),
    createCompletedTraining: builder.mutation<CompletedTrainingResponse, number>({
      query: (trainingId) => ({
        url: `/training-diary/${trainingId}`,
        method: 'POST',
      }),
      invalidatesTags: ['CompletedTrainings'],
    }),
  }),
});

export const {useGetCompletedTrainingsQuery, useCreateCompletedTrainingMutation} = completedTrainingsApi;

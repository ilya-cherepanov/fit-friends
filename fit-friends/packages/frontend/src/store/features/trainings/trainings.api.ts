import {apiSlice} from '../../api-slice';
import {ListResponse, TrainingData, TrainingResponse} from '@fit-friends/shared-types';
import {TrainingsQuery} from '../../../types/trainings-query';
import {isEqual} from 'lodash';


export const trainingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrainings: builder.query<ListResponse<TrainingResponse>, TrainingsQuery>({
      query: (query) => ({
        url: '/trainings',
        params: query,
      }),
      serializeQueryArgs: ({endpointName, queryArgs}) => {
        if (queryArgs.page) {
          const newQueryArgs = {...queryArgs};
          delete newQueryArgs.page;

          return `${endpointName}(${JSON.stringify(newQueryArgs)})`;
        }

        return `${endpointName}(${JSON.stringify(queryArgs)})`;
      },
      forceRefetch: ({previousArg, currentArg}) => {
        return previousArg?.page !== currentArg?.page;
      },
      merge: (currentCache, response) => {
        currentCache.currentPage = response.currentPage;
        currentCache.totalPages = response.totalPages;
        currentCache.items = [...currentCache.items, ...response.items];
      },
      providesTags: [{type: 'Trainings', id: 'LIST'}],
    }),

    getTraining: builder.query<TrainingResponse, number>({
      query: (id) => `/trainings/${id}`,
      providesTags: (result) => [result ? {type: 'Trainings', id: result.id} : {type: 'Trainings', id: 'LIST'}],
    }),

    getCoachTrainings: builder.query<ListResponse<TrainingResponse>, TrainingsQuery>({
      query: (query) => ({
        url: '/coach-trainings',
        params: query,
      }),
      serializeQueryArgs: ({endpointName, queryArgs}) => {
        if (queryArgs.page) {
          const newQueryArgs = {...queryArgs};
          delete newQueryArgs.page;

          return `${endpointName}${JSON.stringify(newQueryArgs)}`;
        }

        return `${endpointName}${JSON.stringify(queryArgs)}`;
      },
      forceRefetch: ({previousArg, currentArg}) => {
        return previousArg !== currentArg;
      },
      merge: (currentCache, response) => {
        currentCache.currentPage = response.currentPage;
        currentCache.totalPages = response.totalPages;
        currentCache.items = [...currentCache.items, ...response.items];
      },
      providesTags: [{type: 'Trainings', id: 'LIST'}],
    }),

    createTraining: builder.mutation<TrainingResponse, FormData>({
      query: (data) => ({
        url: '/trainings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => [result ? {type: 'Trainings', id: result.id} : {type: 'Trainings', id: 'LIST'}],
    }),

    updateTraining: builder.mutation<TrainingResponse, {id: number, data: FormData}>({
      query: ({id, data}) => ({
        url: `/trainings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result) => [result ? {type: 'Trainings', id: result.id} : {type: 'Trainings', id: 'LIST'}],
    }),
  }),
});

export const {
  useGetTrainingQuery,
  useLazyGetTrainingQuery,
  useGetTrainingsQuery,
  useLazyGetTrainingsQuery,
  useGetCoachTrainingsQuery,
  useCreateTrainingMutation,
  useUpdateTrainingMutation,
} = trainingsApi;

import {apiSlice} from '../../api-slice';
import {BalanceResponse, ListResponse, StatusResponse} from '@fit-friends/shared-types';
import {BalanceQuery} from '../../../types/balance-query';


export const balanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkBalance: builder.query<StatusResponse, number>({
      query: (trainingId) => `/balance/check/${trainingId}`,
      providesTags: ['Balance'],
    }),
    getBalance: builder.query<ListResponse<BalanceResponse>, BalanceQuery>({
      query: (params) => ({
        url: '/balance',
        params,
      }),
      serializeQueryArgs: ({endpointName}) => {
        return endpointName;
      },
      forceRefetch: ({currentArg, previousArg}) => {
        return currentArg?.page !== previousArg?.page;
      },
      merge: (currentCache, response) => {
        currentCache.currentPage = response.currentPage;
        currentCache.totalPages = response.totalPages;
        currentCache.items.concat(response.items);
      },
      providesTags: ['Balance', 'Gyms', 'Trainings'],
    }),
  }),
});

export const {useCheckBalanceQuery, useGetBalanceQuery} = balanceApi;

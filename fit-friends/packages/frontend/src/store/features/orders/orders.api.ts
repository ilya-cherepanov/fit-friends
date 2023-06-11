import {apiSlice} from '../../api-slice';
import {ListResponse, OrderData, OrderItemResponse, OrderResponse} from '@fit-friends/shared-types';
import {OrdersQuery} from '../../../types/orders-query';


export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderData>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders', 'Balance'],
    }),
    getOrders: builder.query<ListResponse<OrderItemResponse>, OrdersQuery>({
      query: (query) => ({
        url: '/orders',
        params: query,
      }),
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
} = ordersApi;

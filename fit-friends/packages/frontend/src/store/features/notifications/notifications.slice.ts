import {apiSlice} from '../../api-slice';
import {ListResponse, NotificationResponse} from '@fit-friends/shared-types';


export const notificationsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ListResponse<NotificationResponse>, void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),
    deleteNotifications: builder.mutation<ListResponse<NotificationResponse>, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useDeleteNotificationsMutation,
} = notificationsSlice;

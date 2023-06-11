import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from './api-slice';
import {SliceNameSpace} from '../constants';
import authReducer from './features/auth/auth.slice';
import {setupListeners} from '@reduxjs/toolkit/query';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [SliceNameSpace.Auth]: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

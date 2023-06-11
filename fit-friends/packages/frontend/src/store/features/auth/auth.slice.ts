import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authApi} from './auth.api';
import {JWTPayload, TokensResponse, UserResponse} from '@fit-friends/shared-types';
import {AuthorizationStatus, SliceNameSpace} from '../../../constants';
import {dropTokens, getTokens} from '../../../services/token';
import {extractJWTPayload} from '../../../utils';
import {RootState} from '../../../types/store';
import jwtDecode from 'jwt-decode';

interface AuthState {
  user: UserResponse | null;
  jwt: TokensResponse | null;
  authorizationStatus: AuthorizationStatus;
}

const initialState: AuthState = {
  user: null,
  jwt: null,
  authorizationStatus: AuthorizationStatus.Unknown,
};

const authSlice = createSlice({
  name: SliceNameSpace.Auth,
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.jwt = null;
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, {payload}) => {
      state.jwt = payload;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.jwt = null;
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    builder.addMatcher(authApi.endpoints.getAuthUser.matchFulfilled, (state, {payload}) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = payload;
    });
    builder.addMatcher(authApi.endpoints.getAuthUser.matchRejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    });
  },
});

export const getAuthUser = createAsyncThunk('auth/getUser', async (_, {dispatch}) => {
  const tokenPair = getTokens();
  if (tokenPair) {
    const jwtPayload = jwtDecode<JWTPayload>(tokenPair.accessToken);
    return await dispatch(authApi.endpoints.getAuthUser.initiate(jwtPayload.sub)).unwrap();
  }

  dispatch(logout());
  dropTokens();
});

export const {logout} = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth.authorizationStatus;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;

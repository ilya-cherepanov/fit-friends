import axios, {HttpStatusCode} from 'axios';
import {dropTokens, getTokens, saveTokens} from './token';
import {TokensResponse} from '@fit-friends/shared-types';
import {BACKEND_API_URL, REQUEST_TIMEOUT} from '../constants';


const updateTokens = async () => {
  const tokenPair = getTokens();

  try {
    const {data: newTokenPair} = await axios.get<TokensResponse>(`${BACKEND_API_URL}/auth/refresh`, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        Authorization: `Bearer ${tokenPair?.refreshToken}`,
      },
    });
    saveTokens(newTokenPair);
    return newTokenPair;
  } catch (err) {
    dropTokens();
    return null;
  }
};

export const createApi = () => {
  const api = axios.create({
    baseURL: BACKEND_API_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const tokenPair = getTokens();

    if (tokenPair) {
      config.headers['Authorization'] = `Bearer ${tokenPair}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === HttpStatusCode.Unauthorized) {
        const tokenPair = getTokens();
        if (tokenPair) {
          const newTokenPair = await updateTokens();
          if (newTokenPair) {
            const config = error.config;
            config.headers.Authorization = `Bearer ${newTokenPair.accessToken}`;
            return api(config);
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApi();

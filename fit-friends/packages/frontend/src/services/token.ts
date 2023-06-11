import {TokenPair} from '../types/token-pair';
import {AUTH_TOKENS_KEY} from '../constants';


export const getTokens = (): TokenPair | null => {
  const tokenPair = localStorage.getItem(AUTH_TOKENS_KEY);
  return tokenPair ? JSON.parse(tokenPair) : tokenPair;
};

export const saveTokens = (tokenPair: TokenPair) => (
  localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokenPair))
);

export const dropTokens = () => (
  localStorage.removeItem(AUTH_TOKENS_KEY)
);

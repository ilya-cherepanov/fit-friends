import {SportsmanResponse} from './user-response';

export interface ReviewResponse {
  id: number;
  rating: number;
  text: string;
  author: SportsmanResponse;
  createdAt: string;
}

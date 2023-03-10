import {UserResponse} from './user-response';

export interface ReviewResponse {
  id: number;
  rating: number;
  text: string;
  user: UserResponse;
  createdAt: string;
}

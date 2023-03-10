import {ReviewResponse} from './review-response';

export interface ReviewListResponse {
  totalPages: number;
  currentPage: number;
  responses: ReviewResponse[];
}

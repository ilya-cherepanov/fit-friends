import {UserResponse} from './user-response';


export interface FriendsListResponse {
  currentPage: number;
  totalPages: number;
  friends: UserResponse[];
}

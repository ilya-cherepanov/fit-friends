import {UserResponse} from './user-response';


export interface UserListResponse {
  currentPage: number;
  totalPages: number;
  users: UserResponse[];
}

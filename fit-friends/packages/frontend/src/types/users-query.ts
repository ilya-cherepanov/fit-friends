import {Level, TrainingType, UserRole} from '@fit-friends/core';


export interface UsersQuery {
  page?: number;
  level?: Level;
  trainingTypes?: TrainingType[];
  locations?: Location[];
  sortBy?: UserRole;
}

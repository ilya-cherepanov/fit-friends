import {Level, Location, TrainingType} from '@fit-friends/core';

export interface UserFilters {
  level?: Level;
  trainingTypes?: TrainingType[];
  locations?: Location[];
}

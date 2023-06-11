import {TrainingOrderBy, TrainingTimeIntervals, TrainingType} from '@fit-friends/core';


export interface TrainingsQuery {
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  minCalories?: number;
  maxCalories?: number;
  minRating?: number;
  maxRating?: number;
  types?: TrainingType[];
  duration?: TrainingTimeIntervals;
  orderBy?: TrainingOrderBy;
  coachId?: number;
}

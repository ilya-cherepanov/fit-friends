import {Level, TrainingTimeIntervals, TrainingType, UserSex} from '@fit-friends/core';
import {CoachResponse} from './user-response';

export interface TrainingResponse {
  id: number;
  title: string;
  image: string;
  level: Level;
  type: TrainingType;
  duration: TrainingTimeIntervals;
  price: number;
  calories: number;
  description: string;
  sex: UserSex;
  video: string;
  rating: number;
  coach: CoachResponse;
  isSpecialOffer: boolean;
}

import {Level, TrainingTimeIntervals, TrainingType, UserSex} from '@fit-friends/core';

export interface Training {
  id?: number;
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
  rating?: number;
  isSpecialOffer: boolean;
}

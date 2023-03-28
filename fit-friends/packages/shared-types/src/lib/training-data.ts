import {TrainingType, UserSex, TrainingTimeIntervals} from '@fit-friends/core';

export interface TrainingData {
  title: string;
  type: TrainingType;
  duration: TrainingTimeIntervals;
  calories: number;
  sex: UserSex;
  description: string;
  video: unknown;
  isSpecialOffer?: boolean;
  price: number;
}

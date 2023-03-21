import {TrainingType, Level, UserSex, TrainingTimeIntervals} from '@fit-friends/core';

export interface TrainingData {
  title: string;
  // level: Level;
  type: TrainingType;
  duration: TrainingTimeIntervals;
  calories: number;
  sex: UserSex;
  description: string;
  video: unknown;
  // image: unknown;
  isSpecialOffer?: boolean;
  price: number;
}

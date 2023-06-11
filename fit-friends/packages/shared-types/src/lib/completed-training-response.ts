import {TrainingTimeIntervals} from '@fit-friends/core';


export interface CompletedTrainingResponse {
  id: number;
  createdAt: string;
  calories: number;
  duration: TrainingTimeIntervals;
  trainingId: number;
}

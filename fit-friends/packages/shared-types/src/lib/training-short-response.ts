import {TrainingResponse} from './training-response';

export type TrainingShortResponse = Pick<
  TrainingResponse,
  'id' | 'title' | 'calories' | 'price' | 'image' | 'rating'
>;

import {TrainingShortResponse} from './training-short-response';

export type OrderItemResponse = TrainingShortResponse & {
  sum: number;
  quantity: number;
};

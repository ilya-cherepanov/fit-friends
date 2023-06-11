import * as yup from 'yup';
import {ReviewText, ReviewTrainingRating} from '@fit-friends/core';


export const createReviewSchema = yup.object({
  rating: yup
    .number()
    .integer()
    .required()
    .max(ReviewTrainingRating.Min)
    .min(ReviewTrainingRating.Max),
  text: yup
    .string()
    .required()
    .min(ReviewText.MinLength)
    .max(ReviewText.MaxLength),
});


export type ReviewFormType = yup.InferType<typeof createReviewSchema>;

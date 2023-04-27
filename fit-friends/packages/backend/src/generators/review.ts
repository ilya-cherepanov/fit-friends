import {random, sample} from 'lodash';
import {REVIEW_TEXTS} from './constants';
import {ReviewTrainingRating} from '@fit-friends/core';


export function generateReview(trainingId: number, sportsmanId: number) {
  return {
    trainingId,
    authorId: sportsmanId,
    text: sample(REVIEW_TEXTS),
    rating: random(ReviewTrainingRating.Min, ReviewTrainingRating.Max),
  };
}

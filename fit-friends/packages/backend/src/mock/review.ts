import {Prisma} from '@prisma/client';
import {random, sample} from 'lodash';
import {REVIEW_TEXTS} from './constants';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {ReviewTrainingRating} from '../../../core/src/index';


export function generateReview(trainingId: number, sportsmanId: number) {
  return {
    trainingId,
    authorId: sportsmanId,
    text: sample(REVIEW_TEXTS),
    rating: random(ReviewTrainingRating.Min, ReviewTrainingRating.Max),
  };
}

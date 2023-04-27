import {generateReverseDaysSequence} from './utils';
import {random} from 'lodash';
import {EatingType} from '@fit-friends/core';


export function generateEatings(userId: number) {
  return [...generateReverseDaysSequence(random(5, 10))].map((generatedDate) => {
    return Object.values(EatingType).map((eatingType) => ({
      userId,
      type: eatingType,
      createdAt: generatedDate,
      calories: random(300, 1200),
    }));
  }).flat();
}

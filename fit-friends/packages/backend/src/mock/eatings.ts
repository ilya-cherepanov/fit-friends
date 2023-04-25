import {generateReverseDaysSequence} from './utils';
import {random} from 'lodash';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {EatingType} from '../../../core/src';


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

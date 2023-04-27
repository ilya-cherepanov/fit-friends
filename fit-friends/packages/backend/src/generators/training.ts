import {getRandomFileName} from '../utils/image';
import {random, sample} from 'lodash';
import {TRAINING_DESCRIPTIONS, TRAINING_TITLES, TRAINING_VIDEO} from './constants';
import {resolve} from 'path';
import {Level, MIN_PRICE, TrainingCalories, TrainingTimeIntervals, TrainingType, UserSex} from '@fit-friends/core';


export async function generateTraining(coachId: number) {
  return {
    title: sample(TRAINING_TITLES),
    image: `photos/trainings/${await getRandomFileName(resolve(__dirname, '../assets/photos/trainings'))}`,
    level: sample(Object.values(Level)),
    type: sample(Object.values(TrainingType)),
    duration: sample(Object.values(TrainingTimeIntervals)),
    description: sample(TRAINING_DESCRIPTIONS),
    video: `videos/${TRAINING_VIDEO}`,
    price: random(MIN_PRICE, 5000),
    calories: random(TrainingCalories.Min, TrainingCalories.Max),
    sex: sample(Object.values(UserSex)),
    isSpecialOffer: Math.random() >= 0.5,
    coachId
  };
}

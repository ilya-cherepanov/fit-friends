import {faker} from '@faker-js/faker/locale/ru';
import {random, sample, sampleSize} from 'lodash';
import {GENERATED_USER_PASSWORD} from './constants';
import {getRandomFileName} from '../utils/image';
import {genSalt, hash} from 'bcrypt';
import {resolve} from 'path';
import {
  Level, SportsmanLoseCalories, SportsmanLoseCaloriesPerDay,
  TrainingTimeIntervals,
  TrainingType,
  USER_MAX_TRAINING_TYPE_COUNT,
  UserRole,
  UserSex,
  Location
} from '@fit-friends/core';


export async function generateUser(role: UserRole) {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: await hash(GENERATED_USER_PASSWORD, await genSalt(10)),
    sex: sample([UserSex.Male, UserSex.Female]),
    birthDate: new Date(),
    role,
    avatar: `avatars/${await getRandomFileName(resolve(__dirname, '../assets/photos/avatars'))}`,
    level: sample(Object.values(Level)),
    trainingTypes: sampleSize(Object.values(TrainingType), random(USER_MAX_TRAINING_TYPE_COUNT)),
    location: sample(Object.values(Location)),
    sportsman: role === UserRole.Sportsman ? {
      create: {
        description: faker.lorem.paragraph(3),
        trainingDuration: sample(Object.values(TrainingTimeIntervals)),
        readyToTraining: Math.random() >= 0.5,
        caloriesToLose: random(SportsmanLoseCalories.Min, SportsmanLoseCalories.Max),
        caloriesPerDay: random(SportsmanLoseCaloriesPerDay.Min, SportsmanLoseCaloriesPerDay.Max),
      },
    } : undefined,
    coach: role === UserRole.Coach ? {
      create: {
        achievements: faker.lorem.paragraph(3),
        hasPersonalTrainings: Math.random() >= 0.5,
        certificate: `certificates/${await getRandomFileName(resolve(__dirname, '../assets/photos/certificates'))}`,
      },
    } : undefined,
  };
}

import {Prisma} from '@prisma/client';
import {faker} from '@faker-js/faker/locale/ru';
import {random, sample, sampleSize} from 'lodash';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Level, SportsmanLoseCalories, SportsmanLoseCaloriesPerDay,
  TrainingTimeIntervals,
  TrainingType,
  USER_MAX_TRAINING_TYPE_COUNT,
  UserRole,
  UserSex,
  Location
} from '../../../core/src/index';
import {GENERATED_USER_PASSWORD} from './constants';
import {getRandomFileName} from '../utils/image';
import {genSalt, hash} from 'bcrypt';
import {resolve} from 'path';


export async function generateUser(role: UserRole): Promise<Prisma.UserCreateArgs['data']> {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: await hash(GENERATED_USER_PASSWORD, await genSalt(10)),
    sex: sample([UserSex.Male, UserSex.Female]),
    role,
    avatar: await getRandomFileName(resolve(__dirname, '../assets/photos/avatars')),
    level: sample(Object.values(Level)),
    trainingTypes: sampleSize(Object.values(TrainingType), random(USER_MAX_TRAINING_TYPE_COUNT)),
    location: sample(Object.values(Location)),
    sportsman: role === UserRole.Sportsman ? {
      create: {
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
        certificate: await getRandomFileName(resolve(__dirname, '../assets/photos/certificates')),
      },
    } : undefined,
  };
}

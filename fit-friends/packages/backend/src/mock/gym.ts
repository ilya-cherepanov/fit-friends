import {Prisma} from '@prisma/client';
import {random, sample, sampleSize} from 'lodash';
import {GYM_DESCRIPTIONS, GYM_NAMES} from './constants';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {GymParameters, GymPhotoCount, GymPrice, Location} from '../../../core/src/index';
import {getRandomFileNames} from '../utils/image';
import {resolve} from 'path';


export async function generateGym(): Promise<Prisma.GymCreateArgs['data']> {
  return {
    title: sample(GYM_NAMES),
    description: sample(GYM_DESCRIPTIONS),
    price: random(GymPrice.Min, GymPrice.Max),
    photos: await getRandomFileNames(
      resolve(__dirname, '../assets/photos/gyms'),
      random(GymPhotoCount.Min, GymPhotoCount.Max),
    ),
    isVerified: Math.random() >= 0.5,
    location: sample(Object.values(Location)),
    parameters: sampleSize(Object.values(GymParameters), random(Object.values(GymParameters).length)),
  };
}

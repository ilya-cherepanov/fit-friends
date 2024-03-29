import {random, sample, sampleSize} from 'lodash';
import {GYM_DESCRIPTIONS, GYM_NAMES} from './constants';
import {getRandomFileNames} from '../utils/image';
import {resolve} from 'path';
import {GymParameters, GymPhotoCount, GymPrice, Location} from '@fit-friends/core';


export async function generateGym() {
  const photos = await getRandomFileNames(
    resolve(__dirname, '../assets/photos/gyms'),
    random(GymPhotoCount.Min, GymPhotoCount.Max),
  );

  return {
    title: sample(GYM_NAMES),
    description: sample(GYM_DESCRIPTIONS),
    price: random(GymPrice.Min, GymPrice.Max),
    photos: photos.map((photo) => `gyms/${photo}`),
    isVerified: Math.random() >= 0.5,
    location: sample(Object.values(Location)),
    parameters: sampleSize(Object.values(GymParameters), random(Object.values(GymParameters).length)),
  };
}

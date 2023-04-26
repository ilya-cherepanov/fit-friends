import {readdir} from 'node:fs/promises';
import {resolve} from 'path';
import {sample, sampleSize} from 'lodash';


export const getRandomFileName = async (dirPath: string): Promise<string> => {
  const files = await readdir(dirPath);

  return sample(files);
};

export const getRandomFileNames = async(dirPath: string, count: number): Promise<string[]> => {
  const files = await readdir(dirPath);

  return sampleSize(files, count);
};

export const getRandomTrainingImage = async (): Promise<string> => {
  return getRandomFileName(resolve(__dirname, 'assets/photos/trainings'));
};

export const getRandomGymImages = async (path: string, count: number): Promise<string[]> => {
  const files = await readdir(resolve(__dirname, 'assets/photos/gyms'));

  return sampleSize(files, count);
};

export const getRandomAvatarImage = async (): Promise<string> => {
  const files = await readdir(resolve(__dirname, 'assets/photos/avatars'));

  return sample(files);
};

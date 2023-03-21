import {readdir} from 'node:fs/promises';
import {resolve} from 'path';
import {sample} from 'lodash';

export const getRandomTrainingImage = async (): Promise<string> => {
  const files = await readdir(resolve(__dirname, 'assets/photos/trainings'));

  return sample(files);
};

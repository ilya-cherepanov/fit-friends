import {readdir} from 'node:fs/promises';
import {resolve} from 'path';
import {sample} from 'lodash';


export const getRandomCertificate = async (): Promise<string> => {
  const files = await readdir(resolve(__dirname, 'assets/photos/certificates'));

  return sample(files);
};

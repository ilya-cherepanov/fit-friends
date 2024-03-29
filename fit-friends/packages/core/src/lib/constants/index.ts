export * from './user';
export * from './gym';
export * from './notification';
export * from './order';
export * from './review';
export * from './training';
export * from './training-request';
export * from './sorting-order';
export * from './eating';
export * from './friend';
export * from './balance';

export const MAX_COLLECTION_LENGTH = 50;

export enum Location {
  Pionerskaya = 'pionerskaya',
  Petrogradsraya = 'petrogradskaya',
  Udelnaya = 'udelnaya',
  Zvezdnaya = 'zvezdnaya',
  Sportivnaya = 'sportivnaya',
  Avtovo = 'avtovo',
  Admiralteyskaya = 'admiralteyskaya',
  Academicheskaya = 'academicheskaya',
  Baltiyskaya = 'baltiyskaya',
  Buharestskaya = 'buharestskaya',
}

export enum Level {
  Beginner = 'beginner',
  Amateur = 'amateur',
  Professional = 'professional',
}

export enum TrainingType {
  Yoga = 'yoga',
  Running = 'running',
  Box = 'box',
  Stretching = 'stretching',
  Crossfit = 'crossfit',
  Aerobics = 'aerobics',
  Pilates = 'pilates',
  Strength = 'strength',
}

export enum TrainingTimeIntervals {
  TenToThirtyMinutes = '10-30',
  ThirtyToFiftyMinutes = '30-50',
  FiftyToEightyMinutes = '50-80',
  EightyToOneHundred = '80-100',
  OneHundredToOneHundredTwenty = '100-120',
}

export const NumericalTrainingTimeIntervals: { readonly [key in TrainingTimeIntervals ]: { readonly min: number, readonly max: number } } = {
  [TrainingTimeIntervals.TenToThirtyMinutes]: {
    min: 10,
    max: 30,
  },
  [TrainingTimeIntervals.ThirtyToFiftyMinutes]: {
    min: 30,
    max: 50,
  },
  [TrainingTimeIntervals.FiftyToEightyMinutes]: {
    min: 50,
    max: 80,
  },
  [TrainingTimeIntervals.EightyToOneHundred]: {
    min: 80,
    max: 100,
  },
  [TrainingTimeIntervals.OneHundredToOneHundredTwenty]: {
    min: 100,
    max: 120,
  },
};

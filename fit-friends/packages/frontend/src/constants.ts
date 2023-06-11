import {
  TrainingType,
  Location,
  Level,
  UserSex,
  GymParameters,
  TrainingTimeIntervals,
  EatingType
} from '@fit-friends/core';

export const AUTH_TOKENS_KEY = 'AUTH_TOKENS';
export const BACKEND_API_URL = 'http://localhost:3333/api';
export const BACKEND_STATIC_URL = 'http://localhost:3333/static';
export const REQUEST_TIMEOUT = 5000;
export const MAIN_PAGE_SPECIAL_STEP = 3;
export const POPULAR_TRAININGS_STEP = 4;
export const LOOK_FOR_COMPANY_STEP = 4;
export const TRAINING_MAX_PRICE = 100_000;
export const SLIDER_ELEMENTS_COUNT = 4;
export const MAX_COUNT_NOT_EXPANDED_CONTAINER = 5;
export const USER_LIST_COUNT_STEP = 24;
export const GYMS_LIST_COUNT_STEP = 12;
export const PURCHASES_LIST_COUNT_STEP = 8;
export const MY_GYMS_LIST_COUNT_STEP = 8;

export const enum SliceNameSpace {
  Auth = 'auth',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const UserSexRu: {[key in UserSex]: string} = {
  [UserSex.Any]: 'Неважно',
  [UserSex.Male]: 'Мужской',
  [UserSex.Female]: 'Женский',
} as const;

export const TrainingTypeRu: {[key in TrainingType]: string} = {
  [TrainingType.Box]: 'Бокс',
  [TrainingType.Yoga]: 'Йога',
  [TrainingType.Running]: 'Бег',
  [TrainingType.Stretching]: 'Стретчинг',
  [TrainingType.Crossfit]: 'Кроссфит',
  [TrainingType.Aerobics]: 'Аэробика',
  [TrainingType.Pilates]: 'Пилатес',
  [TrainingType.Strength]: 'Силовые',
} as const;

export const LocationRu: {[key in Location]: string} = {
  [Location.Zvezdnaya]: 'Звёздная',
  [Location.Sportivnaya]: 'Спортивная',
  [Location.Petrogradsraya]: 'Петроградская',
  [Location.Udelnaya]: 'Удельная',
  [Location.Pionerskaya]: 'Пионерская',
  [Location.Avtovo]: 'Автово',
  [Location.Admiralteyskaya]: 'Адмиралтейская',
  [Location.Academicheskaya]: 'Академическая',
  [Location.Baltiyskaya]: 'Балтийская',
  [Location.Buharestskaya]: 'Бухарестская',
};

export const LocationCoords: {[key in Location]: readonly [number, number]} = {
  [Location.Zvezdnaya]: [59.83336500, 30.34904500],
  [Location.Sportivnaya]: [59.95193800, 30.29113100],
  [Location.Petrogradsraya]: [59.96665400, 30.31127900],
  [Location.Udelnaya]: [60.01665200, 30.31510900],
  [Location.Pionerskaya]: [60.00259100, 30.29720300],
  [Location.Avtovo]: [59.86722800, 30.26083200],
  [Location.Admiralteyskaya]: [59.935999415704266, 30.314686734185308],
  [Location.Academicheskaya]: [60.01289900, 30.39642300],
  [Location.Baltiyskaya]: [59.90740400, 30.29982100],
  [Location.Buharestskaya]: [59.88450100, 30.36745500],
} as const;

export const LevelRu: {[key in Level]: string} = {
  [Level.Amateur]: 'Любитель',
  [Level.Beginner]: 'Новичок',
  [Level.Professional]: 'Профессионал',
} as const;

export const GymParameterRu: {[key in GymParameters]: string} = {
  [GymParameters.Pool]: 'Бассейн',
  [GymParameters.Massage]: 'Массаж',
  [GymParameters.FreeParking]: 'Парковка',
  [GymParameters.KidsRoom]: 'Детская комната',
  [GymParameters.Sauna]: 'Сауна',
} as const;

export const TrainingTimeIntervalsRu: {[key in TrainingTimeIntervals]: string} = {
  [TrainingTimeIntervals.TenToThirtyMinutes]: '10-30 мин',
  [TrainingTimeIntervals.ThirtyToFiftyMinutes]: '30-50 мин',
  [TrainingTimeIntervals.FiftyToEightyMinutes]: '50-80 мин',
  [TrainingTimeIntervals.EightyToOneHundred]: '80-100 мин',
  [TrainingTimeIntervals.OneHundredToOneHundredTwenty]: '100-120 мин',
} as const;

export const EatingTypeIndex: {[key in EatingType]: number} = {
  [EatingType.Breakfast]: 0,
  [EatingType.Lunch]: 1,
  [EatingType.Dinner]: 2,
  [EatingType.Snack]: 3,
} as const;

import {atob} from 'buffer';
import {CompletedTrainingResponse, CreateEatingRequest, EatingResponse, JWTPayload} from '@fit-friends/shared-types';
import * as dayjs from 'dayjs';
import {EatingTypeIndex} from './constants';
import {add, forEach, groupBy, maxBy} from 'lodash';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query'


export function extractJWTPayload(jwtToken: string) {
  return JSON.parse(atob(jwtToken.split('.')[1])) as JWTPayload;
}

type TransformedEatingResponse = [
    CreateEatingRequest | null,
    CreateEatingRequest | null,
    CreateEatingRequest | null,
    CreateEatingRequest | null,
    CreateEatingRequest | null,
    CreateEatingRequest | null,
    CreateEatingRequest | null,
][];

export function transformEatingsArray(eatings: EatingResponse[]) {
  const initialArray: TransformedEatingResponse = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ];

  eatings.forEach((eating) => {
    const eatingDate = dayjs(eating.createdAt);
    initialArray[EatingTypeIndex[eating.type]][eatingDate.day()] = {
      ...eating,
      createdAt: eatingDate.toDate(),
    };
  });

  return initialArray;
}

interface ProgressStatistics {
  received: [number, number, number, number],
  spent: [number, number, number, number],
  total: [number, number, number, number],
}

// export function calculateProgressStatistics(
//   eatings: EatingResponse[],
//   completedTrainigs: CompletedTrainingResponse[],
// ): ProgressStatistics {
//   const groupedEatings = groupBy(eatings, (eating) => dayjs(eating.createdAt).format('DD-MM-YYYY'));
//   const groupedEatingsSum = Object.entries(groupedEatings).map(([key, values]) => [
//     key,
//     values.reduce((sum, eating) => eating.calories + sum, 0),
//   ]);
// }

type TransformedCompletedTrainings = (CompletedTrainingResponse[] | null)[];

export function transformCompletedTrainingArray(completedTrainings: CompletedTrainingResponse[]): (CompletedTrainingResponse | null)[][]{
  const result: (CompletedTrainingResponse[] | null)[] = Array(7).fill(null);
  completedTrainings.forEach((completedTraining) => {
    const index = dayjs(completedTraining.createdAt).day();
    if (!result[index]) {
      result[index]?.push(completedTraining);
      return;
    }

    result[index] = [completedTraining];
  });

  result.forEach((resultSubArray) => {
    resultSubArray?.sort(
      (lhs, rhs) => dayjs(lhs.createdAt).diff(dayjs(rhs.createdAt))
    );
  });

  const maxSubArray = maxBy(result, (value) => value?.length ?? 0);
  const maxLength = maxSubArray?.length ?? 0;
  if (maxLength === 0) {
    return [];
  }

  const resultResult = Array.from({length: maxLength}, () => Array(7).fill(null));
  for (let i = 0; i < maxLength; ++i) {
    for (let j = 0; i < 7; ++j) {
      if (result[j]?.[i]) {
        resultResult[i][j] = result[j]?.[i];
      }
    }
  }

  return resultResult;
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

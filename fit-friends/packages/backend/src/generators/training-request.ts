import {sample} from 'lodash';
import {TrainingRequestStatus} from '@fit-friends/core';


export function generateTrainingRequest(initiatorId: number, targetId: number) {
  return {
    initiatorId,
    targetUserId: targetId,
    status: sample(Object.values(TrainingRequestStatus)) as string,
  };
}

import {sample} from 'lodash';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {TrainingRequestStatus} from '../../../core/src';


export function generateTrainingRequest(initiatorId: number, targetId: number) {
  return {
    initiatorId,
    targetUserId: targetId,
    status: sample(Object.values(TrainingRequestStatus)) as string,
  };
}

import {Gym, Training} from '@prisma/client';
import {random, sample} from 'lodash';
import {OrderPaymentMethod, OrderType} from '@fit-friends/core';


export function generateOrder(sportsmanId: number, trainings: Training[], gyms: Gym[]) {
  const quantity = random(1, 20);

  const isTraining = Math.random() >= 0.5;
  const trainingOrGym = isTraining ? sample(trainings) : sample(gyms);

  return {
    userId: sportsmanId,
    paymentMethod: sample(Object.values(OrderPaymentMethod)),
    price: trainingOrGym.price,
    quantity,
    type: isTraining ? OrderType.Training : OrderType.Subscription,
    sum: quantity * trainingOrGym.price,
    trainingId: isTraining ? trainingOrGym.id : undefined,
    gymId: !isTraining ? trainingOrGym.id : undefined,
  };
}

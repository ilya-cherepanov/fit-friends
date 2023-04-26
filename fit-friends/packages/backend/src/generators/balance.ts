import {generateOrder} from './order';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {OrderType} from '../../../core/src';


export function generateBalance(orders: ReturnType<typeof generateOrder>[]) {
  type BalanceType = Pick<ReturnType<typeof generateOrder>, 'userId' | 'type' | 'trainingId' | 'gymId'>
    & {remains: number};
  const balance = new Map<string, BalanceType>();

  orders.forEach((order) => {
    const key = `${order.userId}${order.type}${order.type === OrderType.Training ? order.trainingId : order.gymId}`;
    if (balance.has(key)) {
      balance.get(key).remains += order.quantity;
      return;
    }

    balance.set(key, {
      type: order.type,
      userId: order.userId,
      gymId: order.gymId,
      trainingId: order.trainingId,
      remains: order.quantity,
    });
  });

  return Array.from(balance, (value) => value[1]);
}

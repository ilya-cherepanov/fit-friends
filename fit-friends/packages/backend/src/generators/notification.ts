import {sample} from 'lodash';


export function generateNotification(targetUserId: number, anotherUserName: string) {
  const notifications = [
    `Пользователь ${anotherUserName} отправил вам запрос на тренировку`,
    `Пользователь ${anotherUserName} принял ваше приглашение на тренировку`,
    `Пользователь ${anotherUserName} отклонил ваше приглашение на тренировку`,
    `Пользователь ${anotherUserName} добавил вас в друзья`,
  ];

  return {
    userId: targetUserId,
    text: sample(notifications),
  };
}

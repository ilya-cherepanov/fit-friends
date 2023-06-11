import * as yup from 'yup';
import {
  COACH_CERTIFICATE_MIME_TYPES, CoachAccomplishments,
  Level,
  Location,
  SportsmanLoseCalories,
  SportsmanLoseCaloriesPerDay, TrainingTimeIntervals,
  TrainingType,
  USER_MAX_TRAINING_TYPE_COUNT,
  UserName,
  UserPassword,
  UserRole,
  UserSex
} from '@fit-friends/core';


export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Обязательное поле')
    .min(UserName.MinLength, `Минимальная длинна поля ${UserName.MinLength}`)
    .max(UserName.MaxLength, `Максимальная длинна поля ${UserName.MaxLength}`),
  email: yup
    .string()
    .required('Обязательное поле')
    .email('Должен быть валидный email'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(UserPassword.MinLength, `Минимальная длинна поля ${UserPassword.MinLength}`)
    .max(UserPassword.MaxLength, `Максимальная длинна поля ${UserPassword.MaxLength}`),
  avatar: yup
    .mixed<File>()
    .required(),
  sex: yup
    .string<UserSex>()
    .required('Пол - обязательное поле')
    .oneOf(Object.values(UserSex)),
  location: yup
    .string<Location>()
    .required('Локация - обязательное поле')
    .oneOf(Object.values(Location)),
  role: yup
    .string<UserRole>()
    .required('Роль пользователя - обязательное поле')
    .oneOf(Object.values(UserRole)),
  birthDate: yup
    .date()
    .required()
    .max(new Date(), 'Дата рождения не может превышать текущую дату'),
  trainingTypes: yup
    .array()
    .required('Специализация - обязательное поле')
    .of(yup.string<TrainingType>().required().oneOf<TrainingType>(Object.values(TrainingType)))
    .min(1)
    .max(USER_MAX_TRAINING_TYPE_COUNT),
  trainingDuration: yup
    .string()
    .when('role', (role, schema) => {
      return role[0] === UserRole.Sportsman ? schema.required('Длительность тренировки - обязательное поле') : schema.optional();
    })
    .oneOf(Object.values(TrainingTimeIntervals)),
  level: yup
    .string<Level>()
    .required('Уровень - обязательное поле')
    .oneOf(Object.values(Level)),
  caloriesToLose: yup
    .number()
    .integer('Должно быть целое число')
    .when('role', (role, schema) => {
      return role[0] === UserRole.Sportsman ? schema.required('Обязательное поле') : schema.optional();
    })
    .min(SportsmanLoseCalories.Min, `Не меньше ${SportsmanLoseCalories.Min}`)
    .max(SportsmanLoseCalories.Max, `Не больше ${SportsmanLoseCalories.Max}`),
  caloriesPerDay: yup
    .number()
    .integer('Должно быть целое число')
    .when('role', (role, schema) => {
      return role[0] === UserRole.Sportsman ? schema.required('Обязательное поле') : schema.optional();
    })
    .min(SportsmanLoseCaloriesPerDay.Min, `Не меньше ${SportsmanLoseCalories.Min}`)
    .max(SportsmanLoseCaloriesPerDay.Max, `Не больше ${SportsmanLoseCalories.Max}`),
  hasPersonalTrainings: yup
    .boolean()
    .when('role', (role, schema) => {
      return role[0] === UserRole.Coach ? schema.required() : schema.optional();
    }),
  certificate: yup
    .mixed<File>()
    .when('role', (role, schema) => {
      return role[0] === UserRole.Coach ? schema.required('Дипломы и сертификаты - обязательное поле') : schema.optional();
    })
    .test(
      'certificateType',
      'Сертификат должен быть в pdf формате',
      (value) => value ? COACH_CERTIFICATE_MIME_TYPES.includes(value.type) : true,
    ),
  achievements: yup
    .string()
    .when('role', (role, schema) => {
      return role[0] === UserRole.Coach ? schema.required('Обязательное поле') : schema.optional();
    })
    .min(CoachAccomplishments.MinLength, `Минимальная длинна поля ${CoachAccomplishments.MinLength}`)
    .max(CoachAccomplishments.MaxLength, `Максимальная длинна поля ${CoachAccomplishments.MaxLength}`),
});

export type RegisterFormType = yup.InferType<typeof registerSchema>;

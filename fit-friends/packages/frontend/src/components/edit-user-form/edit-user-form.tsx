import {useAppSelector} from '../../hooks';
import {selectAuthUser} from '../../store/features/auth/auth.slice';
import {Controller, useForm} from 'react-hook-form';
import {Specialization} from '../specialization/specialization';
import {AvatarInput} from '../avatar-input/avatar-input';
import {UserResponse} from '@fit-friends/shared-types';
import {TextField} from '../text-field/text-field';
import {TextareaField} from '../textarea-field/textarea-field';
import {Selector} from '../selector/selector';
import {LevelRu, LocationRu, UserSexRu} from '../../constants';
import {
  CoachAccomplishments,
  Level,
  Location,
  USER_AVATAR_MAX_SIZE,
  USER_AVATAR_MIME_TYPES, USER_MAX_TRAINING_TYPE_COUNT,
  UserName,
  UserSex
} from '@fit-friends/core';
import * as yup from 'yup';

interface EditUserFormProps {
  user: UserResponse;
}

const schema = yup.object({
  avatar: yup
    .mixed<File>()
    .required('Обязательное поле')
    .test('fileSize', 'Аватар слишком большой', (value) => value.size > USER_AVATAR_MAX_SIZE)
    .test('fileType', 'Тип файла не поддерживается', (value) => USER_AVATAR_MIME_TYPES.includes(value.type)),
  name: yup
    .string()
    .min(UserName.MinLength, `Не короче ${UserName.MinLength} символов`)
    .max(UserName.MaxLength, `Не длиннее ${UserName.MaxLength} символов`)
    .required('Обязательное поле'),
  achievements: yup
    .string()
    .min(CoachAccomplishments.MinLength, `Не короче ${UserName.MinLength} символов`)
    .max(CoachAccomplishments.MaxLength, `Не длиннее ${UserName.MaxLength} символов`)
    .required('Обязательное поле'),
  hasPersonalTrainings: yup
    .boolean()
    .required(),
  trainingTypes: yup
    .array()
    .max(USER_MAX_TRAINING_TYPE_COUNT, `Не больше ${USER_MAX_TRAINING_TYPE_COUNT} специализаций`)
    .required(),
  location: yup
    .string<Location>()
    .required(),
  sex: yup
    .string<UserSex>()
    .required(),
  level: yup
    .string<Level>()
    .required(),
});
type FormType = yup.InferType<typeof schema>;

export function EditUserForm({user}: EditUserFormProps) {
  const {control, register} = useForm<FormType>();

  return (
    <section className="user-info-edit">
      <div className="user-info-edit__header">
        <Controller control={control} name="avatar" render={({field}) => <AvatarInput
          preview={user.avatar} {...field} />}/>
        <div className="user-info-edit__controls">
          <button className="user-info-edit__control-btn" aria-label="обновить">
            <svg width="16" height="16" aria-hidden="true">
              <use xlinkHref="#icon-change"></use>
            </svg>
          </button>
          <button className="user-info-edit__control-btn" aria-label="удалить">
            <svg width="14" height="16" aria-hidden="true">
              <use xlinkHref="#icon-trash"></use>
            </svg>
          </button>
        </div>
      </div>
      <form className="user-info-edit__form" action="#" method="post">
        <button className="btn-flat btn-flat--underlined user-info-edit__save-button" type="submit"
                aria-label="Сохранить">
          <svg width="12" height="12" aria-hidden="true">
            <use xlinkHref="#icon-edit"></use>
          </svg>
          <span>Сохранить</span>
        </button>
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title">Обо мне</h2>
          <Controller control={control} name="name" render={({field}) => <TextField {...field} type="text" label="Имя" />}/>
          {/*<div className="custom-input user-info-edit__input">*/}
          {/*  <label><span className="custom-input__label">Имя</span><span className="custom-input__wrapper">*/}
          {/*                <input type="text" name="name" value="Валерия"/></span>*/}
          {/*  </label>*/}
          {/*</div>*/}
          <Controller control={control} name="achievements" render={({field}) => <TextareaField {...field} label="Описание" />} />
          {/*<div className="custom-textarea user-info-edit__textarea">*/}
          {/*  <label><span className="custom-textarea__label">Описание</span>*/}
          {/*    <textarea name="description" placeholder=" ">Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.</textarea>*/}
          {/*  </label>*/}
          {/*</div>*/}
        </div>
        <div className="user-info-edit__section user-info-edit__section--status">
          <h2 className="user-info-edit__title user-info-edit__title--status">Статус</h2>
          <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
            <label>
              <input type="checkbox" {...register('hasPersonalTrainings')}/><span className="custom-toggle__icon">
                          <svg width="9" height="6" aria-hidden="true">
                            <use xlinkHref="#arrow-check"></use>
                          </svg></span><span className="custom-toggle__label">Готов тренировать</span>
            </label>
          </div>
        </div>
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title user-info-edit__title--specialization">Специализация</h2>
          <Controller control={control} name="trainingTypes" render={({field}) => (
            <Specialization additionalClass="user-info-edit__specialization" {...field} />
          )} />
        </div>
        {/*<div className="custom-select user-info-edit__select"><span*/}
        {/*  className="custom-select__label">Локация</span>*/}
        {/*  <div className="custom-select__placeholder">ст. м. Адмиралтейская</div>*/}
        {/*  <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span*/}
        {/*    className="custom-select__text"></span><span className="custom-select__icon">*/}
        {/*                <svg width="15" height="6" aria-hidden="true">*/}
        {/*                  <use xlinkHref="#arrow-down"></use>*/}
        {/*                </svg></span></button>*/}
        {/*  <ul className="custom-select__list" role="listbox">*/}
        {/*  </ul>*/}
        {/*</div>*/}
        <Controller control={control} name="location" render={({field}) => (
          <Selector {...field} options={Object.values(Location)} dictionary={LocationRu} title="Локация" additionalClass="user-info-edit__select" />
        )} />
        <Controller control={control} name="sex" render={({field}) => (
          <Selector {...field} options={Object.values(UserSex)} dictionary={UserSexRu} title="Пол" additionalClass="user-info-edit__select" />
        )} />
        {/*<div className="custom-select user-info-edit__select"><span*/}
        {/*  className="custom-select__label">Пол</span>*/}
        {/*  <div className="custom-select__placeholder">Женский</div>*/}
        {/*  <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span*/}
        {/*    className="custom-select__text"></span><span className="custom-select__icon">*/}
        {/*                <svg width="15" height="6" aria-hidden="true">*/}
        {/*                  <use xlinkHref="#arrow-down"></use>*/}
        {/*                </svg></span></button>*/}
        {/*  <ul className="custom-select__list" role="listbox">*/}
        {/*  </ul>*/}
        {/*</div>*/}
        <Controller control={control} name="level" render={({field}) => (
          <Selector {...field} options={Object.values(Level)} dictionary={LevelRu} title="Уровень" additionalClass="user-info-edit__select" />
        )} />
        {/*<div className="custom-select user-info-edit__select"><span*/}
        {/*  className="custom-select__label">Уровень</span>*/}
        {/*  <div className="custom-select__placeholder">Профессионал</div>*/}
        {/*  <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span*/}
        {/*    className="custom-select__text"></span><span className="custom-select__icon">*/}
        {/*                <svg width="15" height="6" aria-hidden="true">*/}
        {/*                  <use xlinkHref="#arrow-down"></use>*/}
        {/*                </svg></span></button>*/}
        {/*  <ul className="custom-select__list" role="listbox">*/}
        {/*  </ul>*/}
        {/*</div>*/}
      </form>
    </section>
  );
}

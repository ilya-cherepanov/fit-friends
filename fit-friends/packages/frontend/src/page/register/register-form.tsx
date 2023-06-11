import {Controller, useFormContext} from 'react-hook-form';
import {RegisterFormType} from './register-schema';
import {Location, UserRole, UserSex} from '@fit-friends/core';
import {AvatarInput} from '../../components/avatar-input/avatar-input';
import {TextField} from '../../components/text-field/text-field';
import {Selector} from '../../components/selector/selector';
import {LocationRu} from '../../constants';
import {FormEventHandler, useEffect, useState} from 'react';
import classNames from 'classnames';
import {toast} from 'react-toastify';

interface RegisterFormProps {
  onSubmit: () => void;
}

export function RegisterForm({onSubmit}: RegisterFormProps) {
  const {register, control, trigger, formState: {errors}} = useFormContext<RegisterFormType>();
  const [isAccepted, setIsAccepted] = useState(true);

  useEffect(() => {
    if (errors.avatar) {
      toast.error(errors.avatar.message);
    }
  }, [errors]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();

    const noErrors = await trigger([
      'avatar',
      'name',
      'email',
      'birthDate',
      'location',
      'password',
      'sex',
      'role',
    ]);

    if (noErrors) {
      onSubmit();
    }
  };

  return (
    <>
      <div className="popup-form__title-wrapper">
        <h1 className="popup-form__title">Регистрация</h1>
      </div>
      <div className="popup-form__form">
        <form method="GET" onSubmit={handleSubmit}>
          <div className="sign-up">
            <div className="sign-up__load-photo">
              <Controller control={control} name="avatar" render={({field}) => (
                <AvatarInput name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
              )} />
              <div className="sign-up__description">
                <h2 className="sign-up__legend">Загрузите фото профиля</h2><span className="sign-up__text">JPG, PNG, оптимальный размер 100&times;100&nbsp;px</span>
              </div>
            </div>
            <div className="sign-up__data">
              <Controller name="name" render={({field}) => (
                <TextField type="text" {...field} label="Имя" error={errors?.name?.message} />
              )} />
              <Controller name="email" render={({field}) => (
                <TextField type="email" {...field} label="E-mail" error={errors?.email?.message} />
              )} />
              <div className={classNames('custom-input', {'custom-input--error': !!errors.birthDate})}>
                <label><span className="custom-input__label">Дата рождения</span><span
                  className="custom-input__wrapper">
                            <input type="date" {...register('birthDate')}/></span>
                  {errors.birthDate && <span className="custom-input__error">{errors.birthDate.message}</span>}
                </label>
              </div>
              <Controller control={control} name="location" render={({field}) => (
                <Selector {...field} options={Object.values(Location)} dictionary={LocationRu} title="Ваша локация" />
              )} />
              <Controller name="password" render={({field}) => (
                <TextField type="password" {...field} label="Пароль" error={errors?.password?.message} />
              )} />
              <div className="sign-up__radio"><span className="sign-up__label">Пол</span>
                <div className="custom-toggle-radio custom-toggle-radio--big">
                  <div className="custom-toggle-radio__block">
                    <label>
                      <input type="radio" {...register('sex')} value={UserSex.Male} /><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Мужской</span>
                    </label>
                  </div>
                  <div className="custom-toggle-radio__block">
                    <label>
                      <input type="radio" {...register('sex')} value={UserSex.Female} /><span
                      className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Женский</span>
                    </label>
                  </div>
                  <div className="custom-toggle-radio__block">
                    <label>
                      <input type="radio" {...register('sex')} value={UserSex.Any} /><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Неважно</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sign-up__role">
              <h2 className="sign-up__legend">Выберите роль</h2>
              <div className="role-selector sign-up__role-selector">
                <div className="role-btn">
                  <label>
                    <input className="visually-hidden" type="radio" {...register('role')} value={UserRole.Coach} /><span className="role-btn__icon">
                              <svg width="12" height="13" aria-hidden="true">
                                <use xlinkHref="#icon-cup"></use>
                              </svg></span><span className="role-btn__btn">Я хочу тренировать</span>
                  </label>
                </div>
                <div className="role-btn">
                  <label>
                    <input className="visually-hidden" type="radio" {...register('role')} value={UserRole.Sportsman}/><span
                    className="role-btn__icon">
                              <svg width="12" height="13" aria-hidden="true">
                                <use xlinkHref="#icon-weight"></use>
                              </svg></span><span className="role-btn__btn">Я хочу тренироваться</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="sign-up__checkbox">
              <label>
                <input type="checkbox" value="user-agreement" name="user-agreement" onChange={() => setIsAccepted(!isAccepted)} checked={isAccepted}/><span
                className="sign-up__checkbox-icon">
                          <svg width="9" height="6" aria-hidden="true">
                            <use xlinkHref="#arrow-check"></use>
                          </svg></span><span className="sign-up__checkbox-label">Я соглашаюсь с <span>политикой конфиденциальности</span> компании</span>
              </label>
            </div>
            <button className="btn sign-up__button" type="submit" disabled={!isAccepted}>Продолжить</button>
          </div>
        </form>
      </div>
    </>
  );
}

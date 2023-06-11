import {SubmitHandler, useForm} from 'react-hook-form';
import {UserPassword, UserRole} from '@fit-friends/core';
import classNames from 'classnames';
import {useLoginMutation} from '../../store/features/auth/auth.api';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../../hooks';
import {getAuthUser} from '../../store/features/auth/auth.slice';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .required('Обязательное поле')
    .email('Должен быть валидный email'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(UserPassword.MinLength, `Не короче ${UserPassword.MinLength} символов`)
    .max(UserPassword.MaxLength, `Не длиннее ${UserPassword.MaxLength} символов`),
});
type FormInput = yup.InferType<typeof schema>;

export function LoginPage() {
  const {handleSubmit: handleSubmitHook, register, setError, formState: {errors}} = useForm<FormInput>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });
  const [login, {isLoading}] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = handleSubmitHook(async (data) => {
    console.log(data);
    try {
      await login({...data}).unwrap();
    } catch (err) {
      console.log(err);
      const error = err as {status: number};
      if (error.status && error.status === 401) {
        setError('password', {type: 'custom', message: 'Неверный email или пароль'});
      }

      throw err;
    }

    const user = await dispatch(getAuthUser()).unwrap();
    if (user) {
      navigate(user.role === UserRole.Sportsman ? '/' : '/cabinet');
    }
  });

  return (
    <div className="wrapper">
      <main>
        <div className="background-logo">
          <svg className="background-logo__logo" width="750" height="284" aria-hidden="true">
            <use xlinkHref="#logo-big"></use>
          </svg>
          <svg className="background-logo__icon" width="343" height="343" aria-hidden="true">
            <use xlinkHref="#icon-logotype"></use>
          </svg>
        </div>
        <div className="popup-form popup-form--sign-in">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__title-wrapper">
                <h1 className="popup-form__title">Вход</h1>
              </div>
              <div className="popup-form__form">
                <form method="POST" onSubmit={handleSubmit}>
                  <div className="sign-in">
                    <div
                      className={classNames('custom-input', 'sign-in__input', {'custom-input--error': !!errors.email})}>
                      <label><span className="custom-input__label">E-mail</span><span className="custom-input__wrapper">
                          <input type="email" {...register('email')} /></span>
                        {errors.email && <span className="custom-input__error">{errors.email.message}</span>}
                      </label>
                    </div>
                    <div
                      className={classNames('custom-input', 'sign-in__input', {'custom-input--error': !!errors.password})}>
                      <label><span className="custom-input__label">Пароль</span><span className="custom-input__wrapper">
                          <input type="password" {...register('password')}/></span>
                        {errors.password && <span className="custom-input__error">{errors.password.message}</span>}
                      </label>
                    </div>
                    <button className="btn sign-in__button" type="submit" disabled={isLoading}>Продолжить</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

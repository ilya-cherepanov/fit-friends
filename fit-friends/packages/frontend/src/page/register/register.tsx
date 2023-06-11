import {RegisterForm} from './register-form';
import {useState} from 'react';
import {RegisterFormType, registerSchema} from './register-schema';
import {FormProvider, useForm} from 'react-hook-form';
import {Location, UserRole, UserSex} from '@fit-friends/core';
import {yupResolver} from '@hookform/resolvers/yup';
import {QuestionnaireUser} from './questionnaire-user';
import {QuestionnaireCoach} from './questionnaire-coach';
import {useRegisterCoachMutation, useRegisterSportsmanMutation} from '../../store/features/users/users.api';
import {isFetchBaseQueryError} from '../../utils';
import {StatusCodes} from 'http-status-codes';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';


export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [registerSportsman] = useRegisterSportsmanMutation();
  const [registerCoach] = useRegisterCoachMutation();
  const navigate = useNavigate();
  const methods = useForm<RegisterFormType>({
    defaultValues: {
      name: '',
      password: '',
      email: '',
      sex: UserSex.Any,
      location: Location.Avtovo,
      role: UserRole.Coach,
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('name', values.name);
    formData.append('birthDate', values.birthDate.toISOString());
    formData.append('avatar', values.avatar);
    formData.append('sex', values.sex);
    formData.append('role', values.role);
    formData.append('location', values.location);
    formData.append('level', values.level);
    values.trainingTypes.forEach((trainingType) => formData.append('trainingTypes', trainingType));

    if (values.role === UserRole.Sportsman) {
      formData.append('caloriesPerDay', String(values.caloriesPerDay));
      formData.append('caloriesToLose', String(values.caloriesToLose));
      formData.append('trainingDuration', String(values.trainingDuration));

      try {
        await registerSportsman(formData).unwrap();
      } catch (err) {
        if (isFetchBaseQueryError(err) && err.status === StatusCodes.CONFLICT) {
          methods.setError('email', {message: 'Пользователь с таким email уже существует'});
          setStep(1);
        } else {
          toast.error('Неизвестная ошибка на сервере');
        }
        return;
      }

      navigate('/', {replace: true});
    }

    if (values.role === UserRole.Coach) {
      formData.append('achievements', String(values.achievements));
      formData.append('hasPersonalTrainings', String(values.hasPersonalTrainings));
      if (values.certificate) {
        formData.append('certificate', values.certificate);
      }

      try {
        await registerCoach(formData).unwrap();
      } catch (err) {
        if (isFetchBaseQueryError(err) && err.status === StatusCodes.CONFLICT) {
          methods.setError('email', {message: 'Пользователь с таким email уже существует'});
          setStep(1);
        } else {
          toast.error('Неизвестная ошибка на сервере');
        }
        return;
      }

      navigate('/cabinet', {replace: true});
    }
  });

  const handleSubmitRegister = () => {
    setStep(2);
  };

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
        <div className="popup-form popup-form--sign-up">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <FormProvider {...methods} >
                {step === 1 && <RegisterForm onSubmit={handleSubmitRegister}/>}
                {step === 2 && methods.getValues('role') === UserRole.Sportsman && <QuestionnaireUser onSubmit={handleSubmit}/>}
                {step === 2 && methods.getValues('role') === UserRole.Coach && <QuestionnaireCoach onSubmit={handleSubmit}/>}
              </FormProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import {Controller, useFormContext} from 'react-hook-form';
import {Level, TrainingTimeIntervals} from '@fit-friends/core';
import {RegisterFormType} from './register-schema';
import {TrainingTimeIntervalsRu} from '../../constants';
import {TextField} from '../../components/text-field/text-field';
import {FormEventHandler, useEffect} from 'react';
import {Specialization} from '../../components/specialization/specialization';
import {toast} from 'react-toastify';

interface QuestionnaireUserProps {
  onSubmit: () => void;
}

export function QuestionnaireUser({onSubmit}: QuestionnaireUserProps) {
  const {register, control, trigger, formState: {errors}} = useFormContext<RegisterFormType>();

  useEffect(() => {
    if (errors.trainingTypes) {
      toast.error(errors.trainingTypes.message);
    }
    if (errors.trainingDuration) {
      toast.error(errors.trainingDuration.message);
    }
    if (errors.level) {
      toast.error(errors.level.message);
    }
  }, [errors]);


  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault()

    const isValid = await trigger([
      'trainingDuration',
      'caloriesPerDay',
      'caloriesToLose',
      'level',
    ]);

    if (isValid) {
      onSubmit();
    }
  };

  return (
    <div className="popup-form__form">
      <form method="POST" onSubmit={handleSubmit}>
        <div className="questionnaire-user">
          <h1 className="visually-hidden">Опросник</h1>
          <div className="questionnaire-user__wrapper">
            <div className="questionnaire-user__block"><span className="questionnaire-user__legend">Ваша специализация (тип) тренировок</span>
              <Controller control={control} name="trainingTypes" render={({field}) => (
                <Specialization value={field.value} onChange={field.onChange} additionalClass="questionnaire-user__specializations" />
              )} />
            </div>
            <div className="questionnaire-user__block"><span className="questionnaire-user__legend">Сколько времени вы готовы уделять на тренировку в день</span>
              <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
                {[
                  TrainingTimeIntervals.TenToThirtyMinutes,
                  TrainingTimeIntervals.ThirtyToFiftyMinutes,
                  TrainingTimeIntervals.FiftyToEightyMinutes,
                  TrainingTimeIntervals.EightyToOneHundred,
                  TrainingTimeIntervals.OneHundredToOneHundredTwenty,
                ].map((timeInterval) => (
                  <div key={timeInterval} className="custom-toggle-radio__block">
                    <label>
                      <input type="radio" {...register('trainingDuration')} value={timeInterval}/><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">{TrainingTimeIntervalsRu[timeInterval]}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="questionnaire-user__block"><span className="questionnaire-user__legend">Ваш уровень</span>
              <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
                <div className="custom-toggle-radio__block">
                  <label>
                    <input type="radio" {...register('level')} value={Level.Beginner} /><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Новичок</span>
                  </label>
                </div>
                <div className="custom-toggle-radio__block">
                  <label>
                    <input type="radio" {...register('level')} value={Level.Amateur} /><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Любитель</span>
                  </label>
                </div>
                <div className="custom-toggle-radio__block">
                  <label>
                    <input type="radio" {...register('level')} value={Level.Professional} /><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Профессионал</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="questionnaire-user__block">
              <div className="questionnaire-user__calories-lose"><span className="questionnaire-user__legend">Сколько калорий хотите сбросить</span>
                <Controller control={control} name="caloriesToLose" render={({field}) => (
                  <TextField type="number" {...field} error={errors.caloriesToLose?.message} additionalClass="questionnaire-user__input" additionalText="ккал" additionalTextRight/>
                )} />
              </div>
              <div className="questionnaire-user__calories-waste"><span className="questionnaire-user__legend">Сколько калорий тратить в день</span>
                <Controller control={control} name="caloriesPerDay" render={({field}) => (
                  <TextField type="number" {...field} error={errors.caloriesPerDay?.message} additionalClass="questionnaire-user__input" additionalText="ккал" additionalTextRight/>
                )} />
              </div>
            </div>
          </div>
          <button className="btn questionnaire-user__button" type="submit">Продолжить</button>
        </div>
      </form>
    </div>
);
}

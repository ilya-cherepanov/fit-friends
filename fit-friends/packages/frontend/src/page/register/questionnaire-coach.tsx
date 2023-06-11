import {Controller, useFormContext} from 'react-hook-form';
import {Specialization} from '../../components/specialization/specialization';
import {RegisterFormType} from './register-schema';
import {Level} from '@fit-friends/core';
import {TextareaField} from '../../components/textarea-field/textarea-field';


interface QuestionnaireCoachProps {
  onSubmit: () => void;
}


export function QuestionnaireCoach({onSubmit}: QuestionnaireCoachProps) {
  const {control, register, formState: {errors}} = useFormContext<RegisterFormType>();

  return (
    <div className="popup-form__form">
      <form method="get">
        <div className="questionnaire-coach">
          <h1 className="visually-hidden">Опросник</h1>
          <div className="questionnaire-coach__wrapper">
            <div className="questionnaire-coach__block"><span className="questionnaire-coach__legend">Ваша специализация (тип) тренировок</span>
              <Controller control={control} name="trainingTypes" render={({field}) => (
                <Specialization value={field.value} onChange={field.onChange} additionalClass="questionnaire-user__specializations" />
              )} />
            </div>
            <div className="questionnaire-coach__block"><span className="questionnaire-coach__legend">Ваш уровень</span>
              <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
                <div className="custom-toggle-radio__block">
                  <label>
                    <input type="radio" {...register('level')} value={Level.Beginner}/><span className="custom-toggle-radio__icon"></span><span
                      className="custom-toggle-radio__label">Новичок</span>
                  </label>
                </div>
                <div className="custom-toggle-radio__block">
                  <label>
                    <input type="radio" {...register('level')} value={Level.Amateur}/><span className="custom-toggle-radio__icon"></span><span
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
            <div className="questionnaire-coach__block"><span className="questionnaire-coach__legend">Ваши дипломы и сертификаты</span>
              <div className="drag-and-drop questionnaire-coach__drag-and-drop">
                <label><span className="drag-and-drop__label" tabIndex={0}>Загрузите сюда файлы формата PDF, JPG или PNG
                      <svg width="20" height="20" aria-hidden="true">
                        <use xlinkHref="#icon-import"></use>
                      </svg></span>
                  <input type="file" {...register('certificate')} tabIndex={-1} accept=".pdf, .jpg, .png" />
                </label>
              </div>
            </div>
            <div className="questionnaire-coach__block"><span className="questionnaire-coach__legend">Расскажите о своём опыте, который мы сможем проверить</span>
              <Controller control={control} name="achievements" render={({field}) => (
                <TextareaField value={field.value} name={field.name} onChange={field.onChange} additionalClass="questionnaire-coach__textarea" error={errors.achievements?.message} />
              )} />
              <div className="questionnaire-coach__checkbox">
                <label>
                  <input type="checkbox" {...register('hasPersonalTrainings')} /><span
                    className="questionnaire-coach__checkbox-icon">
                              <svg width="9" height="6" aria-hidden="true">
                                <use xlinkHref="#arrow-check"></use>
                              </svg></span><span className="questionnaire-coach__checkbox-label">Хочу дополнительно индивидуально тренировать</span>
                </label>
              </div>
            </div>
          </div>
          <button className="btn questionnaire-coach__button" type="submit">Продолжить</button>
        </div>
      </form>
    </div>
);
}

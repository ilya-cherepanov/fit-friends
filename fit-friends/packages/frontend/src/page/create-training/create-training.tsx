import {Header} from '../../components/header/header';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {
  TRAINING_VIDEO_MIME_FORMATS,
  TrainingCalories,
  TrainingDescription, TrainingTimeIntervals,
  TrainingTitle,
  TrainingType,
  UserSex
} from '@fit-friends/core';
import {TRAINING_MAX_PRICE, TrainingTimeIntervalsRu, TrainingTypeRu} from '../../constants';
import {yupResolver} from '@hookform/resolvers/yup';
import {TextareaField} from '../../components/textarea-field/textarea-field';
import {TextField} from '../../components/text-field/text-field';
import {Selector} from '../../components/selector/selector';
import {useCreateTrainingMutation} from '../../store/features/trainings/trainings.api';


const schema = yup.object({
  title: yup
    .string()
    .required()
    .min(TrainingTitle.MinLength)
    .min(TrainingTitle.MaxLength),
  description: yup
    .string()
    .required()
    .min(TrainingDescription.MinLength)
    .min(TrainingDescription.MaxLength),
  type: yup
    .string()
    .required()
    .oneOf<TrainingType>(Object.values(TrainingType)),
  sex: yup
    .string()
    .required()
    .oneOf<UserSex>(Object.values(UserSex)),
  duration: yup
    .string()
    .required()
    .oneOf<TrainingTimeIntervals>(Object.values(TrainingTimeIntervals)),
  price: yup
    .number()
    .required()
    .integer()
    .max(TRAINING_MAX_PRICE)
    .min(0),
  calories: yup
    .number()
    .required()
    .integer()
    .min(TrainingCalories.Min)
    .max(TrainingCalories.Max),
  video: yup
    .mixed<FileList>()
    .required()
    .test('fileType', 'Не верный тип файла', (value) => (
      value && TRAINING_VIDEO_MIME_FORMATS.includes(value.item(0)?.type ?? '')
    )),
});
type FormType = yup.InferType<typeof schema>;


export function CreateTraining() {
  const {control, register, handleSubmit, formState: {errors}} = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const [createTraining, {isLoading}] = useCreateTrainingMutation();

  const handleFormSubmit = handleSubmit(async (data, evt) => {
    if (!evt || !(evt.target instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(evt.target);
    formData.append('duration', data.duration);
    formData.append('type', data.type);

    await createTraining(formData).unwrap();
  });

  return (
    <div className="wrapper">
      <Header />
      <main>
        <div className="popup-form popup-form--create-training">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__title-wrapper">
                <h1 className="popup-form__title">Создание тренировки</h1>
              </div>
              <div className="popup-form__form">
                <form method="POST" onSubmit={handleFormSubmit}>
                  <div className="create-training">
                    <div className="create-training__wrapper">
                      <div className="create-training__block">
                        <h2 className="create-training__legend">Название тренировки</h2>
                        <Controller control={control} name="title" render={({field}) => (
                          <TextField type="text" {...field} error={errors.title?.message} additionalClass="create-training__input"/>
                        )} />
                        {/*<div className="custom-input create-training__input">*/}
                        {/*  <label><span className="custom-input__wrapper">*/}
                        {/*      <input type="text" name="training-name"/></span>*/}
                        {/*  </label>*/}
                        {/*</div>*/}
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">Характеристики тренировки</h2>
                        <div className="create-training__info">
                          <Controller control={control} name="type" render={({field}) => (
                            <Selector {...field} title="Выберите тип тренировки" options={Object.values(TrainingType)} dictionary={TrainingTypeRu} />
                          )} />
                          {/*<div className="custom-select custom-select--not-selected"><span*/}
                          {/*  className="custom-select__label">Выберите тип тренировки</span>*/}
                          {/*  <button className="custom-select__button" type="button" aria-label="Выберите одну из опций">*/}
                          {/*    <span className="custom-select__text"></span><span className="custom-select__icon">*/}
                          {/*      <svg width="15" height="6" aria-hidden="true">*/}
                          {/*        <use xlinkHref="#arrow-down"></use>*/}
                          {/*      </svg></span></button>*/}
                          {/*  <ul className="custom-select__list" role="listbox">*/}
                          {/*  </ul>*/}
                          {/*</div>*/}
                          <Controller control={control} name="calories" render={({field}) => (
                            <TextField type="number" {...field} label="Сколько калорий потратим" error={errors.calories?.message} additionalText="ккал" additionalTextRight/>
                          )} />
                          {/*<div className="custom-input custom-input--with-text-right">*/}
                          {/*  <label><span className="custom-input__label">Сколько калорий потратим</span><span*/}
                          {/*    className="custom-input__wrapper">*/}
                          {/*      <input type="number" name="calories"/><span*/}
                          {/*    className="custom-input__text">ккал</span></span>*/}
                          {/*  </label>*/}
                          {/*</div>*/}
                          <Controller control={control} name="duration" render={({field}) => (
                            <Selector {...field} title="Сколько времени потратим" options={Object.values(TrainingTimeIntervals)} dictionary={TrainingTimeIntervalsRu} />
                          )} />
                          {/*<div className="custom-select custom-select--not-selected"><span*/}
                          {/*  className="custom-select__label">Сколько времени потратим</span>*/}
                          {/*  <button className="custom-select__button" type="button" aria-label="Выберите одну из опций">*/}
                          {/*    <span className="custom-select__text"></span><span className="custom-select__icon">*/}
                          {/*      <svg width="15" height="6" aria-hidden="true">*/}
                          {/*        <use xlinkHref="#arrow-down"></use>*/}
                          {/*      </svg></span></button>*/}
                          {/*  <ul className="custom-select__list" role="listbox">*/}
                          {/*  </ul>*/}
                          {/*</div>*/}
                          <Controller control={control} name="price" render={({field}) => (
                            <TextField {...field} type="number" label="Стоимость тренировки" error={errors.price?.message} additionalText="₽" additionalTextRight/>
                          )}/>
                          {/*<div className="custom-input custom-input--with-text-right">*/}
                          {/*  <label><span className="custom-input__label">Стоимость тренировки</span><span*/}
                          {/*    className="custom-input__wrapper">*/}
                          {/*      <input type="number" name="price"/><span className="custom-input__text">₽</span></span>*/}
                          {/*  </label>*/}
                          {/*</div>*/}
                        </div>
                        <div className="create-training__radio-wrapper"><span className="create-training__label">Кому подойдет тренировка</span>
                          <div className="custom-toggle-radio create-training__radio">
                            <div className="custom-toggle-radio__block">
                              <label>
                                <input type="radio" {...register('sex')} value={UserSex.Male}/><span
                                className="custom-toggle-radio__icon"></span><span
                                className="custom-toggle-radio__label">Мужчинам</span>
                              </label>
                            </div>
                            <div className="custom-toggle-radio__block">
                              <label>
                                <input type="radio" {...register('sex')} value={UserSex.Female}/><span
                                className="custom-toggle-radio__icon"></span><span
                                className="custom-toggle-radio__label">Женщинам</span>
                              </label>
                            </div>
                            <div className="custom-toggle-radio__block">
                              <label>
                                <input type="radio" {...register('sex')} value={UserSex.Any}/><span
                                className="custom-toggle-radio__icon"></span><span
                                className="custom-toggle-radio__label">Всем</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">Описание тренировки</h2>
                        <Controller control={control} name="description" render={({field}) => (
                          <TextareaField {...field} error={errors.description?.message} additionalClass="create-training__textarea"/>
                        )} />
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">Загрузите видео-тренировку</h2>
                        <div className="drag-and-drop create-training__drag-and-drop">
                          <label><span className="drag-and-drop__label" tabIndex={0}>Загрузите сюда файлы формата MOV, AVI или MP4
                              <svg width="20" height="20" aria-hidden="true">
                                <use xlinkHref="#icon-import-video"></use>
                              </svg></span>
                            <input type="file" {...register('video')} tabIndex={-1} accept=".mov, .avi, .mp4"/>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button className="btn create-training__button" type="submit" disabled={isLoading}>Опубликовать</button>
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

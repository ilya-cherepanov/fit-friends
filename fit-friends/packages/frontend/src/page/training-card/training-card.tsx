import {Header} from '../../components/header/header';
import {Reviews} from '../../components/reviews/reviews';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {useGetTrainingQuery, useLazyGetTrainingQuery} from '../../store/features/trainings/trainings.api';
import {Spinner} from '../../components/spinner/spinner';
import {useAppSelector} from '../../hooks';
import {selectAuthUser} from '../../store/features/auth/auth.slice';
import {
  MIN_PRICE,
  NumericalTrainingTimeIntervals,
  TrainingDescription,
  TrainingTitle,
  UserRole
} from '@fit-friends/core';
import {BACKEND_STATIC_URL, TrainingTypeRu, UserSexRu} from '../../constants';
import {TrainingVideo} from '../../components/training-video/training-video';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useCheckBalanceQuery} from '../../store/features/balance/balance.api';
import {BuyTrainingModal} from '../../components/buy-training-modal/buy-training-modal';

const schema = yup.object({
  title: yup
    .string()
    .required('Обязательное поле')
    .min(TrainingTitle.MinLength, `Не короче ${TrainingTitle.MinLength} символов`)
    .max(TrainingTitle.MaxLength, `Не длиннее ${TrainingTitle.MaxLength} символов`),
  description: yup
    .string()
    .required('Обязательное поле')
    .min(TrainingDescription.MinLength, `Не короче ${TrainingTitle.MinLength} символов`)
    .max(TrainingDescription.MaxLength, `Не длиннее ${TrainingTitle.MaxLength} символов`),
  isSpecialOffer: yup
    .boolean(),
  price: yup
    .number()
    .required('Обязательное поле')
    .min(MIN_PRICE, `Цена должна быть не меньше ${MIN_PRICE} ₽`),
});
type TrainingData = yup.InferType<typeof schema>;

export function TrainingCard() {
  const {trainingId = ''} = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const user = useAppSelector(selectAuthUser);
  const [fetchTraining, {data: training, isLoading, isError}] = useLazyGetTrainingQuery();
  const {data: balanceStatus} = useCheckBalanceQuery(parseInt(trainingId));
  const [isShowBuyModal, setIsShowBuyModal] = useState(false);
  const {register, setValue, formState: {errors}, reset} = useForm<TrainingData>({
    defaultValues: async () => {
      const training = await fetchTraining(parseInt(trainingId)).unwrap();
      return {
        title: training.title,
        description: training.description,
        isSpecialOffer: training.isSpecialOffer,
        price: training.price,
      };
    },
  });

  useEffect(() => {
    if (training) {
      // setValue('title', training.title);
    }
  }, [training, setValue])

  if (isLoading) {
    return <Spinner/>
  }

  if (isError) {
    return <Navigate to="/trainings" />
  }

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Карточка тренировки</h1>
              {training && <Reviews trainingId={training.id} readonly={user?.role === UserRole.Coach}/>}
              <div className="training-card">
                <div className="training-info">
                  <h2 className="visually-hidden">Информация о тренировке</h2>
                  <div className="training-info__header">
                    <div className="training-info__coach">
                      <div className="training-info__photo">
                        <picture>
                          <img src={`${BACKEND_STATIC_URL}/${training?.coach.avatar}`}
                               width="64" height="64"
                               alt="Изображение тренера"/>
                        </picture>
                      </div>
                      <div className="training-info__coach-info"><span
                        className="training-info__label">Тренер</span><span
                        className="training-info__name">{training?.coach.name}</span></div>
                    </div>
                    {user && user.role === UserRole.Coach && user.id === training?.coach.id && (
                      <button className="btn-flat btn-flat--light training-info__edit training-info__edit--edit"
                              type="button">
                        <svg width="12" height="12" aria-hidden="true">
                          <use xlinkHref="#icon-edit"></use>
                        </svg>
                        <span>{isEditing ? 'Редактировать' : 'Сохранить'}</span>
                      </button>
                    )}
                  </div>
                  <div className="training-info__main-content">
                    <form action="#" method="get">
                      <div className="training-info__form-wrapper">
                        <div className="training-info__info-wrapper">
                          <div className="training-info__input training-info__input--training">
                            <label><span className="training-info__label">Название тренировки</span>
                              <input type="text" {...register('title')} disabled/>
                            </label>
                            <div className="training-info__error">Обязательное поле</div>
                          </div>
                          <div className="training-info__textarea">
                            <label><span className="training-info__label">Описание тренировки</span>
                              <textarea {...register('description')} disabled></textarea>
                            </label>
                          </div>
                        </div>
                        <div className="training-info__rating-wrapper">
                          <div className="training-info__input training-info__input--rating">
                            <label><span className="training-info__label">Рейтинг</span><span
                              className="training-info__rating-icon">
                                <svg width="18" height="18" aria-hidden="true">
                                  <use xlinkHref="#icon-star"></use>
                                </svg></span>
                              <input type="number" name="rating" value={Math.round(training?.rating ?? 0)} disabled readOnly/>
                            </label>
                          </div>
                          {training && (
                            <ul className="training-info__list">
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white"><span>#{TrainingTypeRu[training.type]}</span></div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white"><span>#{UserSexRu[training.sex].toLowerCase().replace(' ', '_')}</span></div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white"><span>#{training.calories}ккал</span></div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white"><span>#{NumericalTrainingTimeIntervals[training.duration].min}_минут</span></div>
                              </li>
                            </ul>
                          )}
                        </div>
                        <div className="training-info__price-wrapper">
                          <div className="training-info__input training-info__input--price">
                            <label><span className="training-info__label">Стоимость</span>
                              <input type="text" {...register('price')} disabled/>
                            </label>
                            <div className="training-info__error">Введите число</div>
                          </div>
                          <button className="btn training-info__buy" type="button" disabled={balanceStatus?.status ?? true} onClick={() => setIsShowBuyModal(true)}>Купить</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {training && user && <TrainingVideo training={training} user={user} isEditing={isEditing}/>}
              </div>
            </div>
          </div>
        </section>
        {isShowBuyModal && training && <BuyTrainingModal onClose={() => setIsShowBuyModal(false)} training={training} />}
      </main>
    </div>
  );
}

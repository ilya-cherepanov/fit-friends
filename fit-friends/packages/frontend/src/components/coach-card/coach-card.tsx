import {CoachResponse} from '@fit-friends/shared-types';
import {LocationRu, TrainingTypeRu} from '../../constants';
import {CoachTrainingsSlider} from './coach-trainings-slider';
import classNames from 'classnames';
import {
  useGetSubscriptionStatusQuery,
  useSetSubscriptionStatusMutation
} from '../../store/features/subscribers/subscribers.api';
import {ChangeEventHandler, useState} from 'react';
import {MapModal} from '../map-modal/map-modal';
import {CertificateModal} from '../certificate-modal/certificate-modal';


interface CoachCardProps {
  coach: CoachResponse;
}


export function CoachCard({coach}: CoachCardProps) {
  const {data: isSubscribed, isLoading: isLoadingSubscriptionStatus} = useGetSubscriptionStatusQuery(coach.id);
  const [setSubscription, {isLoading: isLoadingSubscriptionChange}] = useSetSubscriptionStatusMutation();
  const [isShowMap, setIsShowMap] = useState(false);
  const [isShowCertificate, setIsShowCertificate] = useState(false);

  const handleChangeSubscription: ChangeEventHandler<HTMLInputElement> = async () => {
    await setSubscription({coachId: coach.id, status: !isSubscribed}).unwrap();
  };

  return (
    <div className="inner-page__content">
      <section className="user-card-coach">
        <h1 className="visually-hidden">Карточка пользователя роль тренер</h1>
        <div className="user-card-coach__wrapper">
          <div className="user-card-coach__card">
            <div className="user-card-coach__content">
              <div className="user-card-coach__head">
                <h2 className="user-card-coach__title">{coach.name}</h2>
              </div>
              <div className="user-card-coach__label" style={{cursor: 'pointer'}} onClick={() => setIsShowMap(true)}>
                <svg className="user-card-coach__icon-location" width="12" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-location"></use>
                </svg>
                <span>{LocationRu[coach.location]}</span>
              </div>
              <div className="user-card-coach__status-container">
                <div className="user-card-coach__status user-card-coach__status--tag">
                  <svg className="user-card-coach__icon-cup" width="12" height="13" aria-hidden="true">
                    <use xlinkHref="#icon-cup"></use>
                  </svg>
                  <span>Тренер</span>
                </div>
                <div className={classNames({
                  'user-card-coach__status': coach.hasPersonalTrainings,
                  'user-card-coach__status--check': coach.hasPersonalTrainings,
                  'user-card-coach-2__status': !coach.hasPersonalTrainings,
                  'user-card-coach-2__status--check': !coach.hasPersonalTrainings,
                })}><span>{coach.hasPersonalTrainings ? 'Готов тренировать' : 'Не готов тренировать'}</span>
                </div>
              </div>
              <div className="user-card-coach__text">
                <p>{coach.achievements}</p>
              </div>
              <button className="btn-flat user-card-coach__sertificate" type="button" onClick={() => setIsShowCertificate(true)}>
                <svg width="12" height="13" aria-hidden="true">
                  <use xlinkHref="#icon-teacher"></use>
                </svg>
                <span>Посмотреть сертификаты</span>
              </button>
              <ul className="user-card-coach__hashtag-list">
                {coach.trainingTypes.map((trainingType) => (
                  <li key={trainingType} className="user-card-coach__hashtag-item">
                    <div className="hashtag"><span>#{TrainingTypeRu[trainingType].toLowerCase()}</span></div>
                  </li>
                ))}
              </ul>
              <button className="btn user-card-coach__btn" type="button">Добавить в друзья</button>
            </div>
            <div className="user-card-coach__gallary">
              <ul className="user-card-coach__gallary-list">
                <li className="user-card-coach__gallary-item"><img src="/img/content/user-coach-photo1.jpg"
                                                                   srcSet="/img/content/user-coach-photo1@2x.jpg 2x"
                                                                   width="334" height="573" alt="photo1"/>
                </li>
                <li className="user-card-coach__gallary-item"><img src="/img/content/user-coach-photo2.jpg"
                                                                   srcSet="/img/content/user-coach-photo2@2x.jpg 2x"
                                                                   width="334" height="573" alt="photo2"/>
                </li>
              </ul>
            </div>
          </div>
          <div className="user-card-coach__training">
            <CoachTrainingsSlider coachId={coach.id}/>
            <form className="user-card-coach__training-form">
              <button className="btn user-card-coach__btn-training" type="button">Хочу персональную тренировку</button>
              <div className="user-card-coach__training-check">
                <div className="custom-toggle custom-toggle--checkbox">
                  <label>
                    <input type="checkbox" value="user-agreement-1" name="user-agreement"
                           readOnly={isLoadingSubscriptionStatus || isLoadingSubscriptionChange} checked={isSubscribed}
                           onChange={handleChangeSubscription}/><span
                    className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span className="custom-toggle__label">Получать уведомление на почту о новой тренировке</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {isShowMap && <MapModal onClose={() => setIsShowMap(false)} location={coach.location} isUserMap/>}
      {isShowCertificate && <CertificateModal onClose={() => setIsShowCertificate(false)} coach={coach} />}
    </div>
  );
}

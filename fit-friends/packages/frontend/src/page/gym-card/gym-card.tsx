import {Header} from '../../components/header/header';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetGymQuery} from '../../store/features/gyms/gyms.api';
import {Spinner} from '../../components/spinner/spinner';
import {BACKEND_STATIC_URL, GymParameterRu, LocationRu} from '../../constants';
import {MouseEventHandler, useState} from 'react';
import classNames from 'classnames';
import {SubscribeGymModal} from '../../components/subscribe-gym-modal/subscribe-gym-modal';


export function GymCard() {
  const {gymId = ''} = useParams();
  const {data: gym, isLoading} = useGetGymQuery(parseInt(gymId), {skip: gymId === undefined});
  const [sliderPage, setSliderPage] = useState(0);
  const navigate = useNavigate();
  const [isShowSubscribeGym, setIsShowSubscribeGym] = useState(false);

  if (isLoading) {
    return <Spinner/>;
  }

  const handleForwardImage: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();

    if (gym && gym.parameters.length > (sliderPage + 1)) {
      setSliderPage(sliderPage + 1);
    }
  };

  const handleBackwardImage: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();

    if (sliderPage > 0) {
      setSliderPage(sliderPage - 1);
    }
  };

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <div className="inner-page inner-page--no-sidebar">
          <div className="container">
            <div className="inner-page__wrapper">
              <button className="btn-flat inner-page__back" type="button" onClick={() => navigate('/gyms')}>
                <svg width="14" height="10" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
                <span>Назад</span>
              </button>
              <div className="inner-page__content">
                <section className="gym-card">
                  <h1 className="visually-hidden">Карточка зала</h1>
                  <div className="gym-card__wrapper">
                    <div className="gym-card__content">
                      <div className="gym-card__head">
                        <h2 className="gym-card__title">{gym?.title}</h2>
                        {gym?.isVerified && (
                          <div className="gym-card__icon">
                            <svg className="gym-card__verify-bold" width="12" height="12" aria-hidden="true">
                              <use xlinkHref="#icon-verify-bold"></use>
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="gym-card__address">
                        <svg className="gym-card__icon-location" width="12" height="14" aria-hidden="true">
                          <use xlinkHref="#icon-location"></use>
                        </svg>
                        <span>{gym && LocationRu[gym.location]}</span>
                      </p>
                      <ul className="gym-card__hashtag-list">
                        {gym?.parameters.map((parameter) => (
                          <li key={parameter} className="gym-card__hashtag-item">
                            <div className="hashtag hashtag--white"><span>#{GymParameterRu[parameter].toLowerCase()}</span></div>
                          </li>
                        ))}
                      </ul>
                      <div className="gym-card__text">
                        <p>{gym?.description}</p>
                      </div>
                      <div className="gym-card__rating-price">
                        <div className="gym-card__price">
                          <div className="price-service">
                            <p className="price-service__price">{gym?.price}₽&nbsp;<span>&#47;</span>&nbsp;занятие</p>
                          </div>
                        </div>
                      </div>
                      <div className="gym-card__button">
                        <button className="btn btn--dark-bg" type="button" onClick={() => setIsShowSubscribeGym(true)}>оформить абонемент</button>
                      </div>
                    </div>
                    <section className="slider-gyms">
                      <h2 className="visually-hidden">Слайдер с фотографиями спортивных залов.</h2>
                      <ul className="slider-gyms__list">
                        <li>
                          <button className="btn-icon slider-gyms__btn slider-gyms__btn--prev" type="button"
                                  aria-label="prev" onClick={handleBackwardImage} disabled={sliderPage === 0}>
                            <svg width="16" height="14" aria-hidden="true">
                              <use xlinkHref="#arrow-left"></use>
                            </svg>
                          </button>
                          <button className="btn-icon slider-gyms__btn slider-gyms__btn--next" type="button"
                                  aria-label="next" onClick={handleForwardImage} disabled={gym?.photos.length === (sliderPage + 1)}>
                            <svg width="16" height="14" aria-hidden="true">
                              <use xlinkHref="#arrow-right"></use>
                            </svg>
                          </button>
                        </li>
                        {gym?.photos.map((photo, index) => (
                          <li key={photo}
                            className={classNames('slider-gyms__slide', 'slider-gyms__slide', {'slider-gyms__slide--current': sliderPage === index})}>
                            <div className="slider-gyms__img">
                              <picture>
                                <img src={`${BACKEND_STATIC_URL}/${photo}`}
                                     width="826" height="773"
                                     alt="Зал"/>
                              </picture>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        {gym && isShowSubscribeGym && <SubscribeGymModal onClose={() => setIsShowSubscribeGym(false)} gym={gym} />}
      </main>
    </div>
  );
}

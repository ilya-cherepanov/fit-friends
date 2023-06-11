import React, {MouseEventHandler, useEffect, useState} from 'react';
import {Header} from '../../components/header/header';
import {FilterRange} from '../../components/filter-range/filter-range';
import {GymParameters, GymPrice, Location} from '@fit-friends/core';
import {ExpandingBox} from '../../components/expanding-box/expanding-box';
import {useForm} from 'react-hook-form';
import {useLazyGetGymsQuery} from '../../store/features/gyms/gyms.api';
import {Spinner} from '../../components/spinner/spinner';
import {useNavigate} from 'react-router-dom';
import {GymParameterRu, GYMS_LIST_COUNT_STEP, LocationRu} from '../../constants';
import {GymThumbnail} from '../../components/gym-thumbnail/gym-thumbnail';

interface GymFiltersForm {
  minPrice: number;
  maxPrice: number;
  location: Location[];
  parameters: GymParameters[];
  isVerified: boolean;
}

export function GymCatalog() {
  const navigate = useNavigate();
  const {register, watch, setValue} = useForm<GymFiltersForm>({
    defaultValues: {
      minPrice: GymPrice.Min,
      maxPrice: GymPrice.Max,
      location: [],
      parameters: [],
      isVerified: false,
    },
  });
  const [fetchGyms, {data: gyms, isLoading, isUninitialized}] = useLazyGetGymsQuery();
  const [page, setPage] = useState(0);

  const {minPrice, maxPrice, isVerified, parameters, location} = watch();

  useEffect(() => {
    if (isUninitialized) {
      fetchGyms({});
    }

    const timeoutId = setTimeout(async () => {
      console.log(location);
      await fetchGyms({
        minPrice,
        maxPrice,
        parameters,
        location,
        isVerified: isVerified ? isVerified : undefined,
      }).unwrap();
    }, 1000);
    return () => {clearTimeout(timeoutId)};
  }, [fetchGyms, isUninitialized, minPrice, maxPrice, isVerified, parameters, location, location.length]);

  if (isLoading) {
    return <Spinner />;
  }

  const handleChangeFilterRange = ([min, max]: [number, number]) => {
    setValue('minPrice', min);
    setValue('maxPrice', max);
  };

  const handleShowMoreClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!gyms) {
      return;
    }

    if ((page + 1) * GYMS_LIST_COUNT_STEP < gyms.items.length) {
      if ((page + 2) * GYMS_LIST_COUNT_STEP >= gyms.items.length && (gyms.currentPage + 1) < gyms.totalPages) {
        fetchGyms({
          location,
          minPrice,
          maxPrice,
          parameters,
          isVerified,
          page: gyms.currentPage + 1,
        });
      }
      setPage(page + 1);
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог залов</h1>
              <div className="gym-hall-form">
                <h2 className="visually-hidden">Каталог залов фильтр</h2>
                <div className="gym-hall-form__wrapper">
                  <button className="btn-flat btn-flat--underlined gym-hall-form__btnback" type="button" onClick={() => navigate('/')}>
                    <svg width="14" height="10" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                    <span>Назад</span>
                  </button>
                  <h3 className="gym-hall-form__title">Фильтры</h3>
                  <form className="gym-hall-form__form">
                    <div className="gym-hall-form__block">
                      <h4 className="gym-hall-form__block-title gym-hall-form__block-title--price">Цена, ₽</h4>
                      <div className="filter-price">
                        <div className="filter-price__input-text filter-price__input-text--min">
                          <input type="number" id="text-min" {...register('minPrice')} min={GymPrice.Min} max={maxPrice}/>
                            <label htmlFor="text-min">от</label>
                        </div>
                        <div className="filter-price__input-text filter-price__input-text--max">
                          <input type="number" id="text-max" {...register('maxPrice')} min={minPrice} max={GymPrice.Max} />
                            <label htmlFor="text-max">до</label>
                        </div>
                      </div>
                      <FilterRange value={[minPrice, maxPrice]} onChange={handleChangeFilterRange} min={GymPrice.Min} max={GymPrice.Max} />
                    </div>
                    <ExpandingBox classPrefix="gym-hall" label="Локация, станция метро">
                      {Object.values(Location).map((locationItem) => (
                        <div key={locationItem} className="custom-toggle custom-toggle--checkbox">
                          <label>
                            <input type="checkbox" {...register('location')} value={locationItem}/><span
                            className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span className="custom-toggle__label">{LocationRu[locationItem]}</span>
                          </label>
                        </div>
                      ))}
                    </ExpandingBox>
                    <ExpandingBox classPrefix="gym-hall" label="Дополнительно">
                      {Object.values(GymParameters).map((gymParameter) => (
                        <div key={gymParameter} className="custom-toggle custom-toggle--checkbox">
                          <label>
                            <input type="checkbox" {...register('parameters')} value={gymParameter} /><span
                            className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span className="custom-toggle__label">{GymParameterRu[gymParameter]}</span>
                          </label>
                        </div>
                      ))}
                    </ExpandingBox>
                    <div className="gym-hall-form__block">
                      <h3 className="gym-hall-form__title gym-hall-form__title--status">Статус</h3>
                      <div className="custom-toggle custom-toggle--switch">
                        <label>
                          <input type="checkbox" {...register('isVerified')} /><span className="custom-toggle__icon">
                            <svg width="9" height="6" aria-hidden="true">
                              <use xlinkHref="#arrow-check"></use>
                            </svg></span><span className="custom-toggle__label">Только проверенные</span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="gyms-catalog">
                <ul className="gyms-catalog__list">
                  {gyms?.items.slice(0, (page + 1) * GYMS_LIST_COUNT_STEP).map((gym) => (
                    <li key={gym.id} className="gyms-catalog__item">
                      <GymThumbnail gym={gym} />
                    </li>
                  ))}
                </ul>
                {gyms && !((page + 1) * GYMS_LIST_COUNT_STEP <= gyms.items.length && (gyms.currentPage + 1) === gyms.totalPages) && (
                  <div className="show-more gyms-catalog__show-more">
                    <button className="btn show-more__button show-more__button--more" type="button" onClick={handleShowMoreClick}>Показать еще</button>
                    <button className="btn show-more__button show-more__button--to-top" type="button">Вернуться в начало
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
);
}

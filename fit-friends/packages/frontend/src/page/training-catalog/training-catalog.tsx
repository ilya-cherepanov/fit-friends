import {Header} from '../../components/header/header';
import {MIN_PRICE, ReviewTrainingRating, TrainingCalories, TrainingOrderBy, TrainingType} from '@fit-friends/core';
import {TRAINING_MAX_PRICE, TrainingTypeRu} from '../../constants';
import {useGetTrainingsQuery} from '../../store/features/trainings/trainings.api';
import {FilterRange} from '../../components/filter-range/filter-range';
import {useNavigate} from 'react-router-dom';
import {TrainingThumbnail} from '../../components/training-thumbnail/training-thumbnail';
import {ChangeEventHandler, useEffect, useState} from 'react';
import {Spinner} from '../../components/spinner/spinner';


export function TrainingCatalog() {
  const navigate = useNavigate();
  const [calories, setCalories] = useState<[number, number]>([TrainingCalories.Min, TrainingCalories.Max]);
  const [price, setPrice] = useState<[number, number]>([MIN_PRICE, TRAINING_MAX_PRICE]);
  const [rating, setRating] = useState<[number, number]>([ReviewTrainingRating.Min, ReviewTrainingRating.Max]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [orderBy, setOrderBy] = useState<TrainingOrderBy>(TrainingOrderBy.Cheap);
  const {data: trainings, isLoading} = useGetTrainingsQuery({
    minCalories: calories[0],
    maxCalories: calories[1],
    minPrice: price[0],
    maxPrice: price[1],
    minRating: rating[0],
    maxRating: rating[1],
    types: [...trainingTypes],
    orderBy: orderBy,
    page: 0,
  });

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     refetch();
  //   }, 1000);
  //
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [calories, price, rating, trainingTypes, orderBy]);

  if (isLoading) {
    return <Spinner />;
  }

  const handleCheck: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const value = evt.target.value as TrainingType;
    if (trainingTypes.includes(value)) {
      setTrainingTypes(trainingTypes.filter((type) => type !== value));
    }

    setTrainingTypes([...trainingTypes, value]);
  };

  return (
    <div className="wrapper">
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог тренировок</h1>
              <div className="gym-catalog-form">
                <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
                <div className="gym-catalog-form__wrapper">
                  <button className="btn-flat btn-flat--underlined gym-catalog-form__btnback" type="button" onClick={() => navigate('/')}>
                    <svg width="14" height="10" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                    <span>Назад</span>
                  </button>
                  <h3 className="gym-catalog-form__title">Фильтры</h3>
                  <form className="gym-catalog-form__form">
                    <div className="gym-catalog-form__block gym-catalog-form__block--price">
                      <h4 className="gym-catalog-form__block-title">Цена, ₽</h4>
                      <div className="filter-price">
                        <div className="filter-price__input-text filter-price__input-text--min">
                          <input type="number" id="text-min" name="minPrice" value={price[0]} onChange={(evt) => setPrice([parseInt(evt.target.value), price[1]])}/>
                            <label htmlFor="text-min">от</label>
                        </div>
                        <div className="filter-price__input-text filter-price__input-text--max">
                          <input type="number" id="text-max" name="maxPrice" value={price[1]} onChange={(evt) => setPrice([price[0], parseInt(evt.target.value)])} />
                            <label htmlFor="text-max">до</label>
                        </div>
                      </div>
                      <FilterRange value={price} onChange={(values) => setPrice(values)} min={MIN_PRICE} max={TRAINING_MAX_PRICE} />
                    </div>
                    <div className="gym-catalog-form__block gym-catalog-form__block--calories">
                      <h4 className="gym-catalog-form__block-title">Калории</h4>
                      <div className="filter-calories">
                        <div className="filter-calories__input-text filter-calories__input-text--min">
                          <input type="number" id="text-min-cal" name="text-min-cal" value={calories[0]} onChange={(evt) => setCalories([parseInt(evt.target.value), calories[1]])}/>
                            <label htmlFor="text-min-cal">от</label>
                        </div>
                        <div className="filter-calories__input-text filter-calories__input-text--max">
                          <input type="number" id="text-max-cal" name="text-max-cal" value={calories[1]} onChange={(evt) => setCalories([calories[0], parseInt(evt.target.value)])} />
                            <label htmlFor="text-max-cal">до</label>
                        </div>
                      </div>
                      <FilterRange value={calories} onChange={(values) => setCalories(values)} min={TrainingCalories.Min} max={TrainingCalories.Max} />
                    </div>
                    <div className="gym-catalog-form__block gym-catalog-form__block--rating">
                      <h4 className="gym-catalog-form__block-title">Рейтинг</h4>
                      <FilterRange value={rating} onChange={(values) => setRating(values)} min={ReviewTrainingRating.Min} max={ReviewTrainingRating.Max} isRating/>
                    </div>
                    <div className="gym-catalog-form__block gym-catalog-form__block--type">
                      <h4 className="gym-catalog-form__block-title">Тип</h4>
                      <ul className="gym-catalog-form__check-list">
                        {Object.values(TrainingType).map((type) => (
                          <li key={type} className="gym-catalog-form__check-list-item">
                            <div className="custom-toggle custom-toggle--checkbox">
                              <label>
                                <input type="checkbox" onChange={handleCheck} value={type} checked={trainingTypes.includes(type)}/><span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span className="custom-toggle__label">{TrainingTypeRu[type]}</span>
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="gym-catalog-form__block gym-catalog-form__block--sort">
                      <h4 className="gym-catalog-form__title gym-catalog-form__title--sort">Сортировка</h4>
                      <div className="btn-radio-sort gym-catalog-form__radio">
                        <label>
                          <input type="radio" name="orderBy" onChange={() => setOrderBy(TrainingOrderBy.Cheap)} checked={orderBy === TrainingOrderBy.Cheap} /><span className="btn-radio-sort__label">Дешевле</span>
                        </label>
                        <label>
                          <input type="radio" name="orderBy" onChange={() => setOrderBy(TrainingOrderBy.Expensive)} checked={orderBy === TrainingOrderBy.Expensive} /><span className="btn-radio-sort__label">Дороже</span>
                        </label>
                        <label>
                          <input type="radio" name="orderBy" onChange={() => setOrderBy(TrainingOrderBy.Free)} checked={orderBy === TrainingOrderBy.Free} /><span className="btn-radio-sort__label">Бесплатные</span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="training-catalog">
                <ul className="training-catalog__list">
                  {trainings?.items.map((training) => (
                    <li key={training.id} className="training-catalog__item">
                      <TrainingThumbnail training={training} />
                    </li>
                  ))}
                </ul>
                <div className="show-more training-catalog__show-more">
                  <button className="btn show-more__button show-more__button--more" type="button">Показать еще</button>
                  <button className="btn show-more__button show-more__button--to-top" type="button">Вернуться в начало
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
);
}

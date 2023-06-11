import React, {MouseEventHandler, useEffect, useState} from 'react';
import {Header} from '../../components/header/header';
import {useGetEatingsQuery, useSaveEatingsMutation} from '../../store/features/eatings/eatings.api';
import * as dayjs from 'dayjs';
import {CreateEatingRequest} from '@fit-friends/shared-types';
import {transformEatingsArray} from '../../utils';
import {Spinner} from '../../components/spinner/spinner';
import {EatingType} from '@fit-friends/core';
import {EatingTypeIndex} from '../../constants';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';


function isValidEatings(eatings: (CreateEatingRequest | null)[][]): eatings is CreateEatingRequest[][] {
  for (const row of eatings) {
    for (const eating of row) {
      if (eating === null) {
        toast.error('Все поля должны быть заполнены хотя бы 0!');
        return false;
      }

      if (eating.calories < 0) {
        toast.error('Значение полей не может быть меньше 0!');
        return false;
      }
    }
  }

  return true;
}

function sumEatings(eatings: (CreateEatingRequest | null)[][]): number {
  return eatings.reduce(
    (rowSum, row) => rowSum + row.reduce(
      (cellSum, eating) => cellSum + (eating?.calories ?? 0),
      0), 0);
}

function sumEatingsCol(eatings: (CreateEatingRequest | null)[][], colIndex: number) {
  return eatings.reduce((rowSum, row) => rowSum + (row[colIndex]?.calories ?? 0), 0);
}

export function FoodDiary() {
  const {data: eatings, isLoading, isSuccess} = useGetEatingsQuery({
    after: dayjs().startOf('week').toDate(),
    before: dayjs().endOf('week').toDate(),
  });
  const [eatingForm, setEatingForm] = useState<(CreateEatingRequest | null)[][]>(
    Array.from({length: 4}, () => [null, null, null, null, null, null, null])
  );
  const [saveEatings, {isLoading: isSaving}] = useSaveEatingsMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && eatings) {
      setEatingForm(transformEatingsArray(eatings.items));
    }
  }, [eatings, isSuccess]);

  if (isLoading) {
    return <Spinner/>;
  }

  const handleChangeField = (value: number, type: EatingType, dayOfWeek: number) => {
    const newDate = dayjs().startOf('week').add(dayOfWeek, 'day').toDate();
    const newEatings = eatingForm.map((eatingRow) => eatingRow.map((eatingItem) => eatingItem ? {...eatingItem} : null));
    const oldEating = newEatings[dayOfWeek][EatingTypeIndex[type]];
    newEatings[dayOfWeek][EatingTypeIndex[type]] = oldEating ? {...oldEating, calories: value} : {
      calories: value,
      type,
      createdAt: newDate,
    };

    setEatingForm(newEatings);
  };

  const handleSubmitForm: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();

    if (!isValidEatings(eatingForm)) {
      return;
    }

    try {
      await saveEatings({items: eatingForm.flat()}).unwrap();
    } catch {
      toast.error('Не удалось сохранить данные');
    }
  };

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <div className="inner-page inner-page--no-sidebar">
          <div className="container">
            <div className="inner-page__wrapper">
              <button className="btn-flat inner-page__back" type="button" onClick={() => navigate('/cabinet')}>
                <svg width="14" height="10" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
                <span>Назад</span>
              </button>
              <div className="inner-page__content">
                <section className="food-diary">
                  <div className="food-diary__wrapper">
                    <h1 className="food-diary__title">Дневник питания</h1>
                    <div className="food-diary__block">
                      <div className="food-diary__sidebar">
                        <svg className="food-diary__icon" width="21" height="18" aria-hidden="true">
                          <use xlinkHref="#icon-book"></use>
                        </svg>
                        <ul className="food-diary__list">
                          <li className="food-diary__item"><span>Завтрак</span></li>
                          <li className="food-diary__item"><span>Обед</span></li>
                          <li className="food-diary__item"><span>Ужин</span></li>
                          <li className="food-diary__item"><span>Перекус</span></li>
                        </ul>
                        <p className="food-diary__total">Итого</p>
                      </div>
                      <div className="food-diary__content">
                        <form action="#" method="get">
                          <table className="food-diary__table">
                            <tr className="food-diary__row food-diary__row--head">
                              <th className="food-diary__cell food-diary__cell--head">пн</th>
                              <th className="food-diary__cell food-diary__cell--head">вт</th>
                              <th className="food-diary__cell food-diary__cell--head">ср</th>
                              <th className="food-diary__cell food-diary__cell--head">чт</th>
                              <th className="food-diary__cell food-diary__cell--head">пт</th>
                              <th className="food-diary__cell food-diary__cell--head">сб</th>
                              <th className="food-diary__cell food-diary__cell--head">вс</th>
                            </tr>
                            {[EatingType.Breakfast, EatingType.Lunch, EatingType.Dinner, EatingType.Snack].map((type) => (
                              <tr key={type} className="food-diary__row">
                                {eatingForm[EatingTypeIndex[type]].map((eating, eatingIndex) => (
                                  <td key={eatingIndex} className="food-diary__cell">
                                    <div className="food-diary__input">
                                      <label>
                                        <input type="number" name="calories" value={eating?.calories}
                                               onChange={(evt) => handleChangeField(parseInt(evt.target.value), type, eatingIndex)}/>
                                      </label>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr className="food-diary__row">
                              {Array.from({length: 7}, (_, index) => (
                                <td className="food-diary__cell">
                                  <div className="food-diary__total-value"><span>{sumEatingsCol(eatingForm, index)}</span></div>
                                </td>
                              ))}
                            </tr>
                          </table>
                        </form>
                      </div>
                    </div>
                    <div className="total food-diary__total-per-week">
                      <div className="total__title-wrapper">
                        <div className="total__title">Итого за неделю</div>
                        <svg className="total__icon" width="30" height="30" aria-hidden="true">
                          <use xlinkHref="#icon-chart-with-arrow"></use>
                        </svg>
                      </div>
                      <p className="total__number">{sumEatings(eatingForm)}</p>
                    </div>
                    <button className="btn food-diary__button" type="button" disabled={isSaving}
                            onClick={handleSubmitForm}>Сохранить
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

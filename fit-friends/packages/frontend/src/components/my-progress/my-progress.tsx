import {SportsmanResponse} from '@fit-friends/shared-types';
import {useGetEatingsQuery} from '../../store/features/eatings/eatings.api';
import {useGetCompletedTrainingsQuery} from '../../store/features/completed-trainings/completed-trainings.api';
import * as dayjs from 'dayjs';
import {Spinner} from '../spinner/spinner';
import {useState} from 'react';

interface MyProgressProps {
  sportsman: SportsmanResponse;
}

export function MyProgress({sportsman}: MyProgressProps) {
  const [page, setPage] = useState(1);
  const after = dayjs().startOf('day').toDate();
  const before = dayjs().startOf('day').add(4, 'day').toDate();
  const {data: eatings, isLoading: isEatingsLoading} = useGetEatingsQuery({
    after,
    before,
  });
  const {data: trainings, isLoading: isTrainingsLoading} = useGetCompletedTrainingsQuery({
    after,
    before,
  });

  if (isEatingsLoading || isTrainingsLoading) {
    return <Spinner />;
  }

  return (
    <section className="my-progress personal-account-user__my-progress">
      <div className="my-progress__sidebar">
        <svg className="my-progress__icon" width="46" height="51" aria-hidden="true">
          <use xlinkHref="#icon-chart-filled"></use>
        </svg>
        <ul className="my-progress__list">
          <li className="my-progress__item"><span>поступило, Ккал</span></li>
          <li className="my-progress__item"><span>ушло,<br/> Ккал</span></li>
          <li className="my-progress__item"><span>Итого за&nbsp;день, Ккал</span></li>
        </ul>
      </div>
      <div className="my-progress__content">
        <div className="my-progress__title-wrapper">
          <h2 className="my-progress__title">Мой прогресс</h2>
          <div className="my-progress__controls">
            <button className="btn-icon btn-icon--outlined my-progress__control" type="button" aria-label="previous">
              <svg width="11" height="8" aria-hidden="true">
                <use xlinkHref="#arrow-left"></use>
              </svg>
            </button>
            <button className="btn-icon btn-icon--outlined my-progress__control" type="button" aria-label="next">
              <svg width="11" height="8" aria-hidden="true">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </button>
          </div>
        </div>
        <table className="my-progress__table">
          <tr className="my-progress__row my-progress__row--head">
            <th className="my-progress__cell my-progress__cell--head">пн</th>
            <th className="my-progress__cell my-progress__cell--head">вт</th>
            <th className="my-progress__cell my-progress__cell--head">ср</th>
            <th className="my-progress__cell my-progress__cell--head">чт</th>
            <th className="my-progress__cell my-progress__cell--head">пт</th>
            <th className="my-progress__cell my-progress__cell--head">сб</th>
            <th className="my-progress__cell my-progress__cell--head">вс</th>
          </tr>
          <tr className="my-progress__row">
            <td className="my-progress__cell">3000</td>
            <td className="my-progress__cell">1000</td>
            <td className="my-progress__cell">3000</td>
            <td className="my-progress__cell">1000</td>
            <td className="my-progress__cell">3000</td>
            <td className="my-progress__cell">1000</td>
            <td className="my-progress__cell">3000</td>
          </tr>
          <tr className="my-progress__row">
            <td className="my-progress__cell">2000</td>
            <td className="my-progress__cell">4500</td>
            <td className="my-progress__cell">2000</td>
            <td className="my-progress__cell">4500</td>
            <td className="my-progress__cell">2000</td>
            <td className="my-progress__cell">4500</td>
            <td className="my-progress__cell">2000</td>
          </tr>
          <tr className="my-progress__row">
            <td className="my-progress__cell my-progress__cell--red">1000</td>
            <td className="my-progress__cell my-progress__cell--green">3500</td>
            <td className="my-progress__cell my-progress__cell--red">1000</td>
            <td className="my-progress__cell my-progress__cell--green">3500</td>
            <td className="my-progress__cell my-progress__cell--red">1000</td>
            <td className="my-progress__cell my-progress__cell--green">3500</td>
            <td className="my-progress__cell my-progress__cell--red">1000</td>
          </tr>
        </table>
      </div>
    </section>
);
}

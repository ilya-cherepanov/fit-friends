import {UserResponse} from '@fit-friends/shared-types';
import {usePager} from '../../hooks/pager';
import {MAIN_PAGE_SPECIAL_STEP} from '../../constants';
import {SpecialTrainingThumbnail} from './special-training-thumbnail';

interface SpecialForYouProps {
  user: UserResponse;
}

export function SpecialForYou({user}: SpecialForYouProps) {
  const step = MAIN_PAGE_SPECIAL_STEP;
  const {page, increment, decrement} = usePager(step, user.trainingTypes.length);

  return (
    <section className="special-for-you">
      <div className="container">
        <div className="special-for-you__wrapper">
          <div className="special-for-you__title-wrapper">
            <h2 className="special-for-you__title">Специально подобрано для вас</h2>
            <div className="special-for-you__controls">
              <button className="btn-icon special-for-you__control" type="button" aria-label="previous" onClick={decrement}>
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
              </button>
              <button className="btn-icon special-for-you__control" type="button" aria-label="next" onClick={increment}>
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul className="special-for-you__list">
            {user.trainingTypes.slice(page * step, page * step + step).map((trainingType) => (
              <li className="special-for-you__item">
                <SpecialTrainingThumbnail trainingType={trainingType} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

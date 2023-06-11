import {useLazyGetTrainingsQuery} from '../../store/features/trainings/trainings.api';
import {MouseEventHandler, useEffect, useState} from 'react';
import {TrainingThumbnail} from '../training-thumbnail/training-thumbnail';
import {SLIDER_ELEMENTS_COUNT} from '../../constants';

interface CoachTrainingsSliderProps {
  coachId: number;
}

export function CoachTrainingsSlider({coachId}: CoachTrainingsSliderProps) {
  const [fetchTrainings, {data: trainings, isLoading}] = useLazyGetTrainingsQuery();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchTrainings({coachId});
  }, [coachId, fetchTrainings])

  const isEnd = !!trainings
    && (trainings.currentPage + 1) === trainings.totalPages
    && trainings.items.length === (offset + SLIDER_ELEMENTS_COUNT);

  const handleBackClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();

    if (offset > 0) {
      setOffset(offset - 1);
    }
  };

  const handleForwardClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();

    if (!trainings) {
      return;
    }

    if (offset + SLIDER_ELEMENTS_COUNT < trainings.items.length) {
      setOffset(offset + 1);
      return;
    }

    if ((offset + SLIDER_ELEMENTS_COUNT) === trainings.items.length && (trainings.currentPage + 1) < trainings.totalPages) {
      await fetchTrainings({coachId, page: trainings.currentPage + 1}).unwrap();
      setOffset(offset + 1);
    }
  };

  return (
    <>
      <div className="user-card-coach__training-head">
        <h2 className="user-card-coach__training-title">Тренировки</h2>
        <div className="user-card-coach__training-bts">
          <button className="btn-icon user-card-coach__training-btn" type="button" aria-label="back"
                  disabled={isLoading || offset === 0} onClick={handleBackClick}>
            <svg width="14" height="10" aria-hidden="true">
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </button>
          <button className="btn-icon user-card-coach__training-btn" type="button" aria-label="next"
                  disabled={isLoading || isEnd} onClick={handleForwardClick}>
            <svg width="14" height="10" aria-hidden="true">
              <use xlinkHref="#arrow-right"></use>
            </svg>
          </button>
        </div>
      </div>
      <ul className="user-card-coach__training-list">
        {trainings?.items.slice(offset, offset + SLIDER_ELEMENTS_COUNT).map((training) => (
          <li key={training.id} className="user-card-coach__training-item">
            <TrainingThumbnail training={training}/>
          </li>
        ))}
      </ul>
    </>
  );
}

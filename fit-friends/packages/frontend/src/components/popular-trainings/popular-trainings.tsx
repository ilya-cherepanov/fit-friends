import {useGetTrainingsQuery} from '../../store/features/trainings/trainings.api';
import {MAX_COLLECTION_LENGTH, TrainingOrderBy} from '@fit-friends/core';
import {Spinner} from '../spinner/spinner';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {POPULAR_TRAININGS_STEP} from '../../constants';
import {TrainingThumbnail} from '../training-thumbnail/training-thumbnail';


export function PopularTrainings() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [dataPage, setDataPage] = useState(0);
  const {data: trainings, isLoading} = useGetTrainingsQuery({page: dataPage});

  if (isLoading) {
    return <Spinner/>;
  }

  const step = POPULAR_TRAININGS_STEP;

  const handlePreviousClick = () => {
    if (page * step - step < 0) {
      return;
    }

    setPage(page - 1);
  };

  const handleForwardClick = () => {
    const trainingsLength = trainings?.items.length ?? 0;

    if (page * step < (trainingsLength - 1)) {
      const currentPage = trainings?.currentPage ?? 0;
      const totalPages = trainings?.totalPages ?? 0;
      if (page * step >= trainingsLength && currentPage < (totalPages - 1)) {
        setDataPage(dataPage + 1);
      }

      setPage(page + 1);
    }
  };

  return (
    <section className="popular-trainings">
      <div className="container">
        <div className="popular-trainings__wrapper">
          <div className="popular-trainings__title-wrapper">
            <h2 className="popular-trainings__title">Популярные тренировки</h2>
            <button className="btn-flat popular-trainings__button" type="button" onClick={() => navigate('/trainings')}>
              <span>Смотреть все</span>
              <svg width="14" height="10" aria-hidden="true">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </button>
            <div className="popular-trainings__controls">
              <button className="btn-icon popular-trainings__control" type="button" aria-label="previous" onClick={handlePreviousClick}>
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
              </button>
              <button className="btn-icon popular-trainings__control" type="button" aria-label="next" onClick={handleForwardClick}>
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul className="popular-trainings__list">
            {trainings?.items.slice(page * step, page * step + step).map((training) => (
              <li className="popular-trainings__item">
                <TrainingThumbnail training={training} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

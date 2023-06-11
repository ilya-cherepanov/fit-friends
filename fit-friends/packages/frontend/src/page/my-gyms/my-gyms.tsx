import {Header} from '../../components/header/header';
import {MouseEventHandler, useState} from 'react';
import {useGetGymsQuery} from '../../store/features/gyms/gyms.api';
import {useAppSelector} from '../../hooks';
import {selectAuthUser} from '../../store/features/auth/auth.slice';
import {Spinner} from '../../components/spinner/spinner';
import {GymThumbnail} from '../../components/gym-thumbnail/gym-thumbnail';
import {useNavigate} from 'react-router-dom';
import {MY_GYMS_LIST_COUNT_STEP} from '../../constants';


export function MyGyms() {
  const authUser = useAppSelector(selectAuthUser);
  const navigate = useNavigate();
  const [near, setNear] = useState(false);
  const [page, setPage] = useState(0);
  const [dataPage, setDataPage] = useState(0);
  const {data: gyms, isLoading, isFetching} = useGetGymsQuery({
    page: dataPage,
    location: near && authUser ? [authUser.location] : undefined,
  });

  if (isLoading) {
    return <Spinner/>;
  }

  const handleShowMoreClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    if (!gyms) {
      return;
    }

    if ((page + 1) * MY_GYMS_LIST_COUNT_STEP < gyms.items.length) {
      if ((page + 2) * MY_GYMS_LIST_COUNT_STEP >= gyms.items.length && (gyms.currentPage + 1) < gyms.totalPages) {
        setDataPage(dataPage + 1);
      }
      setPage(page + 1);
    }
  };

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <section className="my-gyms">
          <div className="container">
            <div className="my-gyms__wrapper">
              <button className="btn-flat my-gyms__back" type="button" onClick={() => navigate('/cabinet')}>
                <svg width="14" height="10" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
                <span>Назад</span>
              </button>
              <div className="my-gyms__title-wrapper">
                <h1 className="my-gyms__title">Мои залы</h1>
                <div className="custom-toggle custom-toggle--switch custom-toggle--switch-right"
                     data-validate-type="checkbox">
                  <label>
                    <input type="checkbox" name="near" checked={near} onChange={() => {
                      setNear(!near);
                      setPage(0);
                    }}/><span className="custom-toggle__icon">
                      <svg width="9" height="6" aria-hidden="true">
                        <use xlinkHref="#arrow-check"></use>
                      </svg></span><span className="custom-toggle__label">Только рядом</span>
                  </label>
                </div>
              </div>
              <ul className="my-gyms__list">
                {gyms && gyms.items.map((gym) => (
                  <li key={gym.id} className="my-gyms__item">
                    <GymThumbnail gym={gym}/>
                  </li>
                ))}
              </ul>
              {gyms && !((page + 1) * MY_GYMS_LIST_COUNT_STEP <= gyms.items.length && (gyms.currentPage + 1) === gyms.totalPages) && (
                <div className="show-more my-gyms__show-more">
                  <button className="btn show-more__button show-more__button--more" type="button"
                          disabled={isFetching} onClick={handleShowMoreClick}>Показать еще
                  </button>
                  <button className="btn show-more__button show-more__button--to-top" type="button">Вернуться в начало
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import {Header} from '../../components/header/header';
import {useNavigate} from 'react-router-dom';
import {OrderType} from '@fit-friends/core';
import {MouseEventHandler, useState} from 'react';
import {useGetBalanceQuery} from '../../store/features/balance/balance.api';
import {Spinner} from '../../components/spinner/spinner';
import {TrainingThumbnail} from '../../components/training-thumbnail/training-thumbnail';
import {GymThumbnail} from '../../components/gym-thumbnail/gym-thumbnail';
import {PURCHASES_LIST_COUNT_STEP} from '../../constants';


export function MyPurchases() {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [page, setPage] = useState(0);
  const [dataPage, setDataPage] = useState(0);
  const {data: balance, isLoading, isFetching} = useGetBalanceQuery({
    page: dataPage,
    types: orderType ?? undefined,
    isActive,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const handleShowMoreClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!balance) {
      return;
    }

    if ((page + 1) * PURCHASES_LIST_COUNT_STEP < balance.items.length) {
      if ((page + 2) * PURCHASES_LIST_COUNT_STEP >= balance.items.length && (balance.currentPage + 1) < balance.totalPages) {
        setDataPage(dataPage + 1);
      }
      setPage(page + 1);
    }
  }

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <section className="my-purchases">
          <div className="container">
            <div className="my-purchases__wrapper">
              <button className="btn-flat my-purchases__back" type="button" onClick={() => navigate('/cabinet')}>
                <svg width="14" height="10" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
                <span>Назад</span>
              </button>
              <div className="my-purchases__title-wrapper">
                <h1 className="my-purchases__title">Мои покупки</h1>
                <div className="my-purchases__controls">
                  <div className="custom-toggle custom-toggle--switch custom-toggle--switch-right my-purchases__switch"
                       data-validate-type="checkbox">
                    <label>
                      <input type="checkbox" name="isActive" checked={isActive} onChange={() => {setIsActive(!isActive); setPage(0);}}/><span
                      className="custom-toggle__icon">
                        <svg width="9" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-check"></use>
                        </svg></span><span className="custom-toggle__label">Только активные</span>
                    </label>
                  </div>
                  <div className="btn-radio-sort">
                    <label>
                      <input type="radio" name="types" checked={orderType === OrderType.Subscription}
                             onChange={() => {setOrderType(OrderType.Subscription); setPage(0);}}/><span
                      className="btn-radio-sort__label">Абонементы</span>
                    </label>
                    <label>
                      <input type="radio" name="types" checked={orderType === OrderType.Training}
                             onChange={() => {setOrderType(OrderType.Training); setPage(0);}}/><span
                      className="btn-radio-sort__label">Тренировки</span>
                    </label>
                  </div>
                </div>
              </div>
              <ul className="my-purchases__list">
                {balance && balance.items.slice(0, (page + 1) * PURCHASES_LIST_COUNT_STEP).map((balanceItem) => (
                  <li key={balanceItem.id} className="my-purchases__item">
                    {balanceItem.type === OrderType.Training && balanceItem.training && (
                      <TrainingThumbnail training={balanceItem.training} />
                    )}
                    {balanceItem.type === OrderType.Subscription && balanceItem.gym && (
                      <GymThumbnail gym={balanceItem.gym} />
                    )}
                  </li>
                ))}
              </ul>
              {balance && !((page + 1) * PURCHASES_LIST_COUNT_STEP <= balance.items.length && (balance.currentPage + 1) === balance.totalPages) && (
                <div className="show-more my-purchases__show-more">
                  <button className="btn show-more__button show-more__button--more" type="button" onClick={handleShowMoreClick} disabled={isFetching}>Показать еще</button>
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

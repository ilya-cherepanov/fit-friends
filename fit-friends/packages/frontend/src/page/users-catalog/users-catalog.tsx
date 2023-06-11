import {Header} from '../../components/header/header';
import {ExpandingBox} from '../../components/expanding-box/expanding-box';
import {Level, Location, TrainingType, UserRole} from '@fit-friends/core';
import {LevelRu, LocationRu, TrainingTypeRu, USER_LIST_COUNT_STEP} from '../../constants';
import {UserThumbnail} from '../../components/user-thumbnail/user-thumbnail';
import {useLazyGetUsersQuery} from '../../store/features/users/users.api';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {Spinner} from '../../components/spinner/spinner';
import {UsersQuery} from '../../types/users-query';
import {MouseEventHandler, useEffect, useState} from 'react';

type FilterForm = Omit<UsersQuery, 'page'>;

export function UsersCatalog() {
  const [getUsers, {data: users, isUninitialized, isLoading}] = useLazyGetUsersQuery();
  const navigate = useNavigate();
  const {register, watch, formState: {isDirty}} = useForm<FilterForm>({
    defaultValues: {
      locations: [],
      trainingTypes: [],
    },
  });
  const [page, setPage] = useState(0);

  const {locations, sortBy, level, trainingTypes} = watch();

  useEffect(() => {
    if (isUninitialized) {
      getUsers({
        locations,
        trainingTypes,
      });
      return;
    }

    if (!isDirty) {
      return;
    }

    const timeoutId = setTimeout(() => {
      getUsers({
        locations,
        trainingTypes,
        level: level ?? undefined,
        sortBy: sortBy ?? undefined,
      });
      setPage(0);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [getUsers, isUninitialized, locations, trainingTypes, level, sortBy, isDirty]);

  if (isUninitialized || isLoading) {
    return <Spinner/>;
  }

  const handleShowMoreClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!users) {
      return;
    }

    if ((page + 1) * USER_LIST_COUNT_STEP < users.users.length) {
      if ((page + 2) * USER_LIST_COUNT_STEP >= users.users.length && (users.currentPage + 1) < users.totalPages) {
        await getUsers({
          locations,
          trainingTypes,
          level: level ?? undefined,
          sortBy: sortBy ?? undefined,
          page: users.currentPage + 1,
        }).unwrap();
      }
      setPage(page + 1);
    }
  };

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог пользователей</h1>
              <div className="user-catalog-form">
                <h2 className="visually-hidden">Каталог пользователя</h2>
                <div className="user-catalog-form__wrapper">
                  <button className="btn-flat btn-flat--underlined user-catalog-form__btnback" type="button"
                          onClick={() => navigate('/')}>
                    <svg width="14" height="10" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                    <span>Назад</span>
                  </button>
                  <h3 className="user-catalog-form__title">Фильтры</h3>
                  <form className="user-catalog-form__form">
                    <ExpandingBox label="Локация, станция метро" classPrefix="user-catalog" additionalClass="user-catalog-form__block--location">
                      {Object.values(Location).map((locationItem) => (
                        <div key={locationItem} className="custom-toggle custom-toggle--checkbox">
                          <label>
                            <input type="checkbox" {...register('locations')} value={locationItem}/><span
                            className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span className="custom-toggle__label">{LocationRu[locationItem]}</span>
                          </label>
                        </div>
                      ))}
                    </ExpandingBox>
                    <ExpandingBox label="Специализация" classPrefix="user-catalo" additionalClass="user-catalog-form__block--spezialization">
                      {Object.values(TrainingType).map((trainingTypeItem) => (
                        <div key={trainingTypeItem} className="custom-toggle custom-toggle--checkbox">
                          <label>
                            <input type="checkbox" {...register('trainingTypes')} value={trainingTypeItem}/><span
                            className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg></span><span
                            className="custom-toggle__label">{TrainingTypeRu[trainingTypeItem]}</span>
                          </label>
                        </div>
                      ))}
                    </ExpandingBox>
                    <div className="user-catalog-form__block user-catalog-form__block--level">
                      <h4 className="user-catalog-form__block-title">Ваш уровень</h4>
                      <div className="custom-toggle-radio">
                        <div className="custom-toggle-radio__block">
                          <label>
                            <input type="radio" {...register('level')} value={Level.Beginner}/><span
                            className="custom-toggle-radio__icon"></span><span
                            className="custom-toggle-radio__label">{LevelRu[Level.Beginner]}</span>
                          </label>
                        </div>
                        <div className="custom-toggle-radio__block">
                          <label>
                            <input type="radio" {...register('level')} value={Level.Amateur}/><span
                            className="custom-toggle-radio__icon"></span><span
                            className="custom-toggle-radio__label">{LevelRu[Level.Amateur]}</span>
                          </label>
                        </div>
                        <div className="custom-toggle-radio__block">
                          <label>
                            <input type="radio" {...register('level')} value={Level.Professional}/><span
                            className="custom-toggle-radio__icon"></span><span
                            className="custom-toggle-radio__label">{LevelRu[Level.Professional]}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="user-catalog-form__block">
                      <h3 className="user-catalog-form__title user-catalog-form__title--sort">Сортировка</h3>
                      <div className="btn-radio-sort">
                        <label>
                          <input type="radio" {...register('sortBy')} value={UserRole.Coach}/><span
                          className="btn-radio-sort__label">Тренеры</span>
                        </label>
                        <label>
                          <input type="radio" {...register('sortBy')} value={UserRole.Sportsman}/><span
                          className="btn-radio-sort__label">Пользователи</span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="inner-page__content">
                <div className="users-catalog">
                  <ul className="users-catalog__list">
                    {users && users.users.slice(0, (page + 1) * USER_LIST_COUNT_STEP).map((user) => (
                      <li key={user.id} className="users-catalog__item">
                        <UserThumbnail user={user}/>
                      </li>
                    ))}
                  </ul>
                  {users && !((page + 1) * USER_LIST_COUNT_STEP <= users.users.length && (users.currentPage + 1) === users.totalPages) && (
                    <div className="show-more users-catalog__show-more">
                      <button className="btn show-more__button show-more__button--more" type="button" onClick={handleShowMoreClick}>Показать еще
                      </button>
                      <button className="btn show-more__button show-more__button--to-top" type="button">Вернуться в
                        начало
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

  );
}

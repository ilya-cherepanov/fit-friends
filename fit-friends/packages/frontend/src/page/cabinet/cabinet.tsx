import {Header} from '../../components/header/header';
import {AvatarInput} from '../../components/avatar-input/avatar-input';
import {Specialization} from '../../components/specialization/specialization';
import {Link} from 'react-router-dom';
import {Controller, useForm} from 'react-hook-form';


export function Cabinet() {
  const {control} = useForm();

  return (
    <div className="wrapper">
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Личный кабинет</h1>
              <section className="user-info-edit">
                <div className="user-info-edit__header">
                  <Controller control={control} render={({field}) => <AvatarInput preview={'160bad22-8689-44fb-84de-b83d1f9e5521.jpg'} {...field} />} name="avatar" />
                  <div className="user-info-edit__controls">
                    <button className="user-info-edit__control-btn" aria-label="обновить">
                      <svg width="16" height="16" aria-hidden="true">
                        <use xlinkHref="#icon-change"></use>
                      </svg>
                    </button>
                    <button className="user-info-edit__control-btn" aria-label="удалить">
                      <svg width="14" height="16" aria-hidden="true">
                        <use xlinkHref="#icon-trash"></use>
                      </svg>
                    </button>
                  </div>
                </div>
                <form className="user-info-edit__form" action="#" method="post">
                  <button className="btn-flat btn-flat--underlined user-info-edit__save-button" type="submit"
                          aria-label="Сохранить">
                    <svg width="12" height="12" aria-hidden="true">
                      <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <span>Сохранить</span>
                  </button>
                  <div className="user-info-edit__section">
                    <h2 className="user-info-edit__title">Обо мне</h2>
                    <div className="custom-input user-info-edit__input">
                      <label><span className="custom-input__label">Имя</span><span className="custom-input__wrapper">
                          <input type="text" name="name" value="Валерия" /></span>
                      </label>
                    </div>
                    <div className="custom-textarea user-info-edit__textarea">
                      <label><span className="custom-textarea__label">Описание</span>
                        <textarea name="description" placeholder=" ">Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.</textarea>
                      </label>
                    </div>
                  </div>
                  <div className="user-info-edit__section user-info-edit__section--status">
                    <h2 className="user-info-edit__title user-info-edit__title--status">Статус</h2>
                    <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
                      <label>
                        <input type="checkbox" name="ready-for-training" checked /><span className="custom-toggle__icon">
                          <svg width="9" height="6" aria-hidden="true">
                            <use xlinkHref="#arrow-check"></use>
                          </svg></span><span className="custom-toggle__label">Готов тренировать</span>
                      </label>
                    </div>
                  </div>
                  <div className="user-info-edit__section">
                    <h2 className="user-info-edit__title user-info-edit__title--specialization">Специализация</h2>
                    <Specialization additionalClass="user-info-edit__specialization" />
                  </div>
                  <div className="custom-select user-info-edit__select"><span
                    className="custom-select__label">Локация</span>
                    <div className="custom-select__placeholder">ст. м. Адмиралтейская</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span
                      className="custom-select__text"></span><span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg></span></button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                  <div className="custom-select user-info-edit__select"><span
                    className="custom-select__label">Пол</span>
                    <div className="custom-select__placeholder">Женский</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span
                      className="custom-select__text"></span><span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg></span></button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                  <div className="custom-select user-info-edit__select"><span
                    className="custom-select__label">Уровень</span>
                    <div className="custom-select__placeholder">Профессионал</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций"><span
                      className="custom-select__text"></span><span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg></span></button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                </form>
              </section>
              <div className="inner-page__content">
                <div className="personal-account-coach">
                  <div className="personal-account-coach__navigation"><Link
                    className="thumbnail-link thumbnail-link--theme-light" to="/my-trainings">
                    <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                      <svg width="30" height="26" aria-hidden="true">
                        <use xlinkHref="#icon-flash"></use>
                      </svg>
                    </div>
                    <span className="thumbnail-link__text">Мои тренировки</span></Link><Link
                    className="thumbnail-link thumbnail-link--theme-light" to="/create-training">
                    <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                      <svg width="30" height="26" aria-hidden="true">
                        <use xlinkHref="#icon-add"></use>
                      </svg>
                    </div>
                    <span className="thumbnail-link__text">Создать тренировку</span></Link><Link
                    className="thumbnail-link thumbnail-link--theme-light" to="/my-friends">
                    <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                      <svg width="30" height="26" aria-hidden="true">
                        <use xlinkHref="#icon-friends"></use>
                      </svg>
                    </div>
                    <span className="thumbnail-link__text">Мои друзья</span></Link><Link
                    className="thumbnail-link thumbnail-link--theme-light" to="/my-orders">
                    <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                      <svg width="30" height="26" aria-hidden="true">
                        <use xlinkHref="#icon-bag"></use>
                      </svg>
                    </div>
                    <span className="thumbnail-link__text">Мои заказы</span></Link>
                    <div className="personal-account-coach__calendar"></div>
                  </div>
                  <div className="personal-account-coach__additional-info">
                    <div className="personal-account-coach__label-wrapper">
                      <h2 className="personal-account-coach__label">Дипломы и сертификаты</h2>
                      <button className="btn-flat btn-flat--underlined personal-account-coach__button" type="button">
                        <svg width="14" height="14" aria-hidden="true">
                          <use xlinkHref="#icon-import"></use>
                        </svg>
                        <span>Загрузить</span>
                      </button>
                      <div className="personal-account-coach__controls">
                        <button className="btn-icon personal-account-coach__control" type="button"
                                aria-label="previous">
                          <svg width="16" height="14" aria-hidden="true">
                            <use xlinkHref="#arrow-left"></use>
                          </svg>
                        </button>
                        <button className="btn-icon personal-account-coach__control" type="button" aria-label="next">
                          <svg width="16" height="14" aria-hidden="true">
                            <use xlinkHref="#arrow-right"></use>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <ul className="personal-account-coach__list">
                      <li className="personal-account-coach__item">
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
);
}

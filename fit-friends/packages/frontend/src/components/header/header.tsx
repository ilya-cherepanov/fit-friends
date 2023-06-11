import {Notifications} from '../notifications/notifications';


export function Header() {
  return (
    <header className="header">
      <div className="container"><a className="header__logo" href="index.html" aria-label="Переход на главную">
        <svg width="187" height="70" aria-hidden="true">
          <use xlinkHref="#logo"></use>
        </svg>
      </a>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item"><a className="main-nav__link is-active" href="#" aria-label="На главную">
              <svg width="18" height="18" aria-hidden="true">
                <use xlinkHref="#icon-home"></use>
              </svg>
            </a></li>
            <li className="main-nav__item"><a className="main-nav__link" href="#" aria-label="Личный кабинет">
              <svg width="16" height="18" aria-hidden="true">
                <use xlinkHref="#icon-user"></use>
              </svg>
            </a></li>
            <li className="main-nav__item"><a className="main-nav__link" href="#" aria-label="Друзья">
              <svg width="22" height="16" aria-hidden="true">
                <use xlinkHref="#icon-friends"></use>
              </svg>
            </a></li>
            <li className="main-nav__item main-nav__item--notifications"><a className="main-nav__link" href="#"
                                                                            aria-label="Уведомления">
              <svg width="14" height="18" aria-hidden="true">
                <use xlinkHref="#icon-notification"></use>
              </svg>
            </a>
              <div className="main-nav__dropdown">
                <Notifications />
              </div>
            </li>
          </ul>
        </nav>
        <div className="search">
          <form action="#" method="get">
            <label><span className="search__label">Поиск</span>
              <input type="search" name="search" />
                <svg className="search__icon" width="20" height="20" aria-hidden="true">
                  <use xlinkHref="#icon-search"></use>
                </svg>
            </label>
            <ul className="search__list">
              <li className="search__item"><a className="search__link" href="#">Бокс</a></li>
              <li className="search__item"><a className="search__link is-active" href="#">Бег</a></li>
              <li className="search__item"><a className="search__link" href="#">Аэробика</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
              <li className="search__item"><a className="search__link" href="#">Text</a></li>
            </ul>
          </form>
        </div>
      </div>
    </header>
);
}

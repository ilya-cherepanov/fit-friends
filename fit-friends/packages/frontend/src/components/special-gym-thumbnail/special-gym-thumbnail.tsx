import {GymResponse} from '@fit-friends/shared-types';
import {BACKEND_STATIC_URL, LocationRu} from '../../constants';
import {Link} from 'react-router-dom';

interface SpecialGymThumbnailProps {
  gym: GymResponse;
}

export function SpecialGymThumbnail({gym}: SpecialGymThumbnailProps) {
  return (
    <div className="thumbnail-spec-gym">
      <div className="thumbnail-spec-gym__image">
        <picture>
          <img src={`${BACKEND_STATIC_URL}/${gym.photos[0]}`} width="330" height="190" alt=""/>
        </picture>
      </div>
      <p className="thumbnail-spec-gym__type">Ближайший зал</p>
      <div className="thumbnail-spec-gym__header">
        <h3 className="thumbnail-spec-gym__title">{gym.title}</h3>
        <div className="thumbnail-spec-gym__location">
          <svg width="14" height="16" aria-hidden="true">
            <use xlinkHref="#icon-location"></use>
          </svg>
          <address className="thumbnail-spec-gym__location-address">{LocationRu[gym.location]}</address>
        </div>
      </div>
      <div className="thumbnail-spec-gym__button-wrapper">
        <Link className="btn btn--small thumbnail-spec-gym__button" to={`/gyms/${gym.id}`}>Подробнее</Link>
        <Link className="btn btn--small btn--outlined thumbnail-spec-gym__button" to="/gyms">Все залы</Link>
      </div>
    </div>
  );
}

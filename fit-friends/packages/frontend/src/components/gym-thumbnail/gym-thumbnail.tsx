import {GymResponse} from '@fit-friends/shared-types';
import {LocationRu} from '../../constants';
import classNames from 'classnames';
import {MouseEventHandler} from 'react';
import {Link} from 'react-router-dom';
import {useSetFavoriteGymMutation} from '../../store/features/gyms/gyms.api';

interface GymThumbnailProps {
  gym: GymResponse;
}

export function GymThumbnail({gym}: GymThumbnailProps) {
  const [setFavoriteGym, {isLoading}] = useSetFavoriteGymMutation();

  const handleClickFavorite: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    await setFavoriteGym({gymId: gym.id, state: !gym.isFavorite}).unwrap();
  };

  return (
    <div className="thumbnail-gym">
      <div className="thumbnail-gym__image">
        <picture>
          <img
            src={gym.photos[0]} width="330"
            height="190" alt=""/>
        </picture>
      </div>
      {gym.isVerified && (
        <div className="thumbnail-gym__verified">
          <svg width="14" height="14" aria-hidden="true">
            <use xlinkHref="#icon-verify"></use>
          </svg>
        </div>
      )}
      <button className={classNames('thumbnail-gym__favourite-button', {'is_active': gym.isFavorite})}
              disabled={isLoading} onClick={handleClickFavorite}><span
        className="visually-hidden">{gym.isFavorite ? 'Удалить из Избранного' : 'Добавить в Избранное'}</span>
        {gym.isFavorite ? (
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-heart-filled"></use>
          </svg>
        ) : (
          <svg width="14" height="13" aria-hidden="true">
            <use xlinkHref="#icon-heart"></use>
          </svg>
        )}
      </button>
      <div className="thumbnail-gym__header">
        <h4 className="thumbnail-gym__title">{gym.title}</h4>
        <div className="thumbnail-gym__location">
          <svg width="14" height="16" aria-hidden="true">
            <use xlinkHref="#icon-location"></use>
          </svg>
          <address className="thumbnail-gym__location-address">{LocationRu[gym.location]}</address>
        </div>
      </div>
      <div className="thumbnail-gym__text-wrapper">
        <p className="thumbnail-gym__text">{gym.description}</p>
      </div>
      <div className="thumbnail-gym__buttons-wrapper">
        <Link className="btn btn--small thumbnail-gym__button" to={`/gyms/${gym.id}`}>Подробнее</Link>
      </div>
    </div>
  );
}

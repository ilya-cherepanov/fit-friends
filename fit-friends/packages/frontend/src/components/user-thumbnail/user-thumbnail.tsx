import {UserResponse} from '@fit-friends/shared-types';
import classNames from 'classnames';
import {UserRole} from '@fit-friends/core';
import {BACKEND_STATIC_URL, LocationRu, TrainingTypeRu} from '../../constants';
import {Link} from 'react-router-dom';


interface UserThumbnailProps {
  user: UserResponse;
  isDark?: boolean;
  isTop?: boolean;
  withDarkButton?: boolean;
}


export function UserThumbnail({isTop = false, isDark = false, withDarkButton = false, ...props}: UserThumbnailProps) {
  const thumbnailClasses = classNames(
    'thumbnail-user',
    {
      'thumbnail-user--role-user': props.user.role === UserRole.Sportsman,
      'thumbnail-user--role-coach': props.user.role === UserRole.Coach,
      'thumbnail-user--dark': isDark,
    },
  );

  return (
    <div className={thumbnailClasses}>
      <div className="thumbnail-user__image">
        <picture>
          <img src={`${BACKEND_STATIC_URL}/${props.user.avatar}`} width="82" height="82" alt="Аватар"/>
        </picture>
      </div>
      {isTop && (
        <div className="thumbnail-user__top-status thumbnail-user__top-status--role-user">
          <svg width="12" height="12" aria-hidden="true">
            <use xlinkHref="#icon-crown"></use>
          </svg>
        </div>
      )}
      <div className="thumbnail-user__header">
        <h3 className="thumbnail-user__name">{props.user.name}</h3>
        <div className="thumbnail-user__location">
          <svg width="14" height="16" aria-hidden="true">
            <use xlinkHref="#icon-location"></use>
          </svg>
          <address className="thumbnail-user__location-address">{LocationRu[props.user.location]}</address>
        </div>
      </div>
      <ul className="thumbnail-user__hashtags-list">
        {props.user.trainingTypes.map((trainingType) => (
          <li className="thumbnail-user__hashtags-item">
            <div className="hashtag thumbnail-user__hashtag"><span>{`#${TrainingTypeRu[trainingType].toLowerCase()}`}</span></div>
          </li>
        ))}
      </ul>
      <Link className={classNames('btn', 'btn--outlined', 'btn--medium', 'thumbnail-user__button', {'btn--dark-bg': withDarkButton})}
         to={`/users/${props.user.id}`}>Подробнее</Link>
    </div>
  );
}

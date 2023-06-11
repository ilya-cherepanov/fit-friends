import {TrainingResponse} from '@fit-friends/shared-types';
import {BACKEND_STATIC_URL, TrainingTypeRu} from '../../constants';
import {Link} from 'react-router-dom';


interface TrainingThumbnailProps {
  training: TrainingResponse;
}

export function TrainingThumbnail({training}: TrainingThumbnailProps) {
  return (
    <div className="thumbnail-training">
      <div className="thumbnail-training__inner">
        <div className="thumbnail-training__image">
          <picture>
              <img src={`${BACKEND_STATIC_URL}/${training.image}`} width="330" height="190" alt="" />
          </picture>
        </div>
        <p className="thumbnail-training__price"><span
          className="thumbnail-training__price-value">{training.price === 0 ? 'Бесплатно' : training.price}</span><span>{training.price !== 0 ? '₽' : ''}</span>
        </p>
        <h3 className="thumbnail-training__title">{training.title}</h3>
        <div className="thumbnail-training__info">
          <ul className="thumbnail-training__hashtags-list">
            <li className="thumbnail-training__hashtags-item">
              <div className="hashtag thumbnail-training__hashtag"><span>#{TrainingTypeRu[training.type].toLowerCase()}</span></div>
            </li>
            <li className="thumbnail-training__hashtags-item">
              <div className="hashtag thumbnail-training__hashtag"><span>#{training.calories}ккал</span></div>
            </li>
          </ul>
          <div className="thumbnail-training__rate">
            <svg width="16" height="16" aria-hidden="true">
              <use xlinkHref="#icon-star"></use>
            </svg>
            <span className="thumbnail-training__rate-value">{Math.round(training.rating)}</span>
          </div>
        </div>
        <div className="thumbnail-training__text-wrapper">
          <p className="thumbnail-training__text">{training.description}</p>
        </div>
        <div className="thumbnail-training__button-wrapper">
          <Link className="btn btn--small thumbnail-training__button-catalog" to={`/trainings/${training.id}`}>Подробнее</Link>
          <Link className="btn btn--small btn--outlined thumbnail-training__button-catalog"
             to={`/trainings/${training.id}`}>Отзывы</Link>
        </div>
      </div>
    </div>
);
}

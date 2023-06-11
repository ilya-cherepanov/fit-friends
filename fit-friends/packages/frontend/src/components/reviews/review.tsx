import {ReviewResponse} from '@fit-friends/shared-types';
import {BACKEND_STATIC_URL} from '../../constants';


interface ReviewProps {
  review: ReviewResponse;
}


export function Review({review}: ReviewProps) {
  return (
    <div className="review">
      <div className="review__user-info">
        <div className="review__user-photo">
          <picture>
            <img src={`${BACKEND_STATIC_URL}/${review.author.avatar}`}
                 width="64" height="64"
                 alt="Изображение пользователя"/>
          </picture>
        </div>
        <span className="review__user-name">{review.author.name}</span>
        <div className="review__rating">
          <svg width="16" height="16" aria-hidden="true">
            <use xlinkHref="#icon-star"></use>
          </svg>
          <span>{review.rating}</span>
        </div>
      </div>
      <p className="review__comment">{review.text}</p>
    </div>
  );
}

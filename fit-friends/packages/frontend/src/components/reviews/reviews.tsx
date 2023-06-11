import {useGetReviewsQuery} from '../../store/features/reviews/reviews.api';
import {Spinner} from '../spinner/spinner';
import {Review} from './review';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {CreateReviewModal} from '../create-review-modal/create-review-modal';


interface ReviewsProps {
  readonly?: boolean;
  trainingId: number;
}


export function Reviews({readonly = false, trainingId}: ReviewsProps) {
  const {data: reviews, isLoading} = useGetReviewsQuery(trainingId);
  const navigate = useNavigate();
  const [showCreateReviewModal, setCreateReviewModal] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <aside className="reviews-side-bar">
      <button className="btn-flat btn-flat--underlined reviews-side-bar__back" type="button" onClick={() => navigate(-1)}>
        <svg width="14" height="10" aria-hidden="true">
          <use xlinkHref="#arrow-left"></use>
        </svg>
        <span>Назад</span>
      </button>
      <h2 className="reviews-side-bar__title">Отзывы</h2>
      <ul className="reviews-side-bar__list">
        {reviews?.items.map((review) => (
          <li className="reviews-side-bar__item" key={review.id}>
            <Review review={review} />
          </li>
        ))}
      </ul>
      <button className="btn btn--medium reviews-side-bar__button" type="button" disabled={readonly} onClick={() => setCreateReviewModal(true)}>Оставить отзыв</button>
      {showCreateReviewModal && <CreateReviewModal onClose={() => setCreateReviewModal(false)} trainingId={trainingId}/>}
    </aside>
  );
}

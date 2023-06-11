import {Modal} from '../modal/modal';
import {Controller, useForm} from 'react-hook-form';
import {ReviewTrainingRating} from '@fit-friends/core';
import {useCreateReviewMutation} from '../../store/features/reviews/reviews.api';
import {MouseEventHandler} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {TextareaField} from '../textarea-field/textarea-field';
import {toast} from 'react-toastify';
import {createReviewSchema, ReviewFormType} from '../../schemas/create-review-schema';


interface CreateReviewModalProps {
  onClose: () => void;
  trainingId: number;
}

export function CreateReviewModal({onClose, trainingId}: CreateReviewModalProps) {
  const {control, register, handleSubmit, formState: {errors}} = useForm<ReviewFormType>({
    resolver: yupResolver(createReviewSchema),
  });
  const [createReview, {isLoading}] = useCreateReviewMutation();

  const submit = handleSubmit(async (values) => {
    await createReview({
      rating: values.rating,
      text: values.text,
      trainingId: trainingId,
    }).unwrap();

    onClose();
  }, (errors) => {
    if (errors.rating) {
      toast.error(errors.rating.message);
    }
  });

  const handleSubmitButton: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    await submit();
  };

  return (
    <Modal title="Оставить отзыв" onClose={onClose} classModifier="feedback">
      <>
        <h3 className="popup__feedback-title">Оцените тренировку</h3>
        <ul className="popup__rate-list">
          {Array.from({length: ReviewTrainingRating.Max}, (_, index) => (
            <li key={index} className="popup__rate-item">
              <div className="popup__rate-item-wrap">
                <label>
                  <input type="radio" {...register('rating')} aria-label={`оценка ${index + 1}.`} value={index + 1} /><span
                  className="popup__rate-number">{index + 1}</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
        <div className="popup__feedback">
          <h3 className="popup__feedback-title popup__feedback-title--text">Поделитесь своими впечатлениями о
            тренировке</h3>
          <div className="popup__feedback-textarea">
            <Controller control={control} name="text" render={({field}) => (
              <TextareaField {...field} error={errors.text?.message} />
            )} />
          </div>
        </div>
        <div className="popup__button">
          <button className="btn" type="button" disabled={isLoading} onClick={handleSubmitButton}>Продолжить</button>
        </div>
      </>
    </Modal>
  );
}

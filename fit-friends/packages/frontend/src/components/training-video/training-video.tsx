import {TrainingResponse, UserResponse} from '@fit-friends/shared-types';
import {MouseEventHandler, useRef, useState} from 'react';
import {useUpdateTrainingMutation} from '../../store/features/trainings/trainings.api';
import {useCreateCompletedTrainingMutation} from '../../store/features/completed-trainings/completed-trainings.api';
import {BACKEND_STATIC_URL} from '../../constants';
import {VideoPlayer} from './video-player';
import {TRAINING_VIDEO_MIME_FORMATS, UserRole} from '@fit-friends/core';
import {useCheckBalanceQuery} from '../../store/features/balance/balance.api';
import classNames from 'classnames';


interface TrainingVideoProps {
  training: TrainingResponse;
  user: UserResponse;
  isEditing: boolean;
}

export function TrainingVideo({training, user, isEditing}: TrainingVideoProps) {
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [updateTraining, {isLoading: isTrainingUpdating}] = useUpdateTrainingMutation();
  const [completeTraining, {isLoading: isTrainingCompeting}] = useCreateCompletedTrainingMutation();
  const {data: balanceStatus, isSuccess: isBalanceLoaded} = useCheckBalanceQuery(training.id, {skip: user.role !== UserRole.Sportsman});
  const video = useRef<HTMLInputElement>(null);

  const handleSaveVideo: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!video.current) {
      return;
    }

    if (!video.current.files || video.current.files.length <= 0) {
      return;
    }

    if (!TRAINING_VIDEO_MIME_FORMATS.includes(video.current.files[0].type)) {
      return;
    }

    const formData = new FormData();
    formData.append('video', video.current.files[0]);
    await updateTraining({id: training.id, data: formData}).unwrap();
    setIsVideoEditing(false);
  }

  const handleStartTraining: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    setIsTrainingStarted(true);
    await completeTraining(training.id).unwrap();
  };

  return (
    <div className={classNames('training-video', {'training-video--stop': isTrainingStarted})}>
      <h2 className="training-video__title">Видео</h2>
      {!isEditing && !isVideoEditing ? (
        <VideoPlayer src={`${BACKEND_STATIC_URL}/${training.video}`} playable={(user.role === UserRole.Coach && training.coach.id === user.id) || (isBalanceLoaded && !!balanceStatus?.status && isTrainingStarted)}/>
      ) : (
        <div className="training-video__drop-files">
          <form action="#" method="post">
            <div className="training-video__form-wrapper">
              <div className="drag-and-drop">
                <label><span className="drag-and-drop__label" tabIndex={0}>Загрузите сюда файлы формата MOV, AVI или MP4
                                <svg width="20" height="20" aria-hidden="true">
                                  <use xlinkHref="#icon-import-video"></use>
                                </svg></span>
                  <input type="file" name="import" ref={video} tabIndex={-1} accept=".mov, .avi, .mp4"/>
                </label>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="training-video__buttons-wrapper">
        {user.role === UserRole.Sportsman ? (
          <>
            <button className="btn training-video__button training-video__button--start" type="button"
                    disabled={!balanceStatus?.status ?? true} onClick={handleStartTraining}>Приступить
            </button>
            <button className="btn training-video__button training-video__button--stop"
                    type="button" disabled={!isTrainingStarted || isTrainingCompeting} onClick={() => setIsTrainingStarted(false)}>Закончить
            </button>
          </>
        ) : user.role === UserRole.Coach && (
          <>
            <div className="training-video__buttons-wrapper">
              <button className="btn training-video__button training-video__button--start" type="button"
                      disabled>Приступить
              </button>
              <div className="training-video__edit-buttons">
                <button className="btn" type="button" onClick={handleSaveVideo} disabled={isTrainingUpdating}>Сохранить</button>
                <button className="btn btn--outlined" type="button" onClick={() => setIsVideoEditing(true)} disabled={isTrainingUpdating}>Удалить</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

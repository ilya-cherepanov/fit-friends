import {SportsmanResponse} from '@fit-friends/shared-types';
import {LocationRu, TrainingTypeRu} from '../../constants';
import {useAppSelector} from '../../hooks';
import {selectAuthUser} from '../../store/features/auth/auth.slice';
import {
  useCheckFriendQuery,
  useCreateFriendMutation,
  useDeleteFriendMutation
} from '../../store/features/friends/friends.api';
import {MouseEventHandler, useState} from 'react';
import classNames from 'classnames';
import {MapModal} from '../map-modal/map-modal';

interface SportsmanCardProps {
  sportsman: SportsmanResponse;
}

export function SportsmanCard({sportsman}: SportsmanCardProps) {
  const authUser = useAppSelector(selectAuthUser);
  const {
    data: friendshipStatus,
    isLoading: isFriendshipStatusLoading,
  } = useCheckFriendQuery(sportsman.id, {skip: !authUser});
  const [createFriend, {isLoading: isFriendCreating}] = useCreateFriendMutation();
  const [deleteFriend, {isLoading: isFriendDeleting}] = useDeleteFriendMutation();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleCreateFriendButton: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    await createFriend(sportsman.id).unwrap();
  }

  const handleDeleteFriendButton: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    await deleteFriend(sportsman.id).unwrap();
  }

  return (
    <div className="inner-page__content">
      <section className="user-card">
        <h1 className="visually-hidden">Карточка пользователя</h1>
        <div className="user-card__wrapper">
          <div className="user-card__content">
            <div className="user-card__head">
              <h2 className="user-card__title">{sportsman.name}</h2>
              {/*<div className="user-card__icon">*/}
              {/*  <svg className="user-card__crown" width="12" height="12" aria-hidden="true">*/}
              {/*    <use xlinkHref="#icon-crown"></use>*/}
              {/*  </svg>*/}
              {/*</div>*/}
            </div>
            <div className="user-card__label" style={{cursor: 'pointer'}} onClick={() => setIsMapOpen(true)}>
              <svg className="user-card__icon-location" width="12" height="14" aria-hidden="true">
                <use xlinkHref="#icon-location"></use>
              </svg>
              <span>{LocationRu[sportsman.location]}</span>
            </div>
            <div className={classNames({
              'user-card__status': sportsman.readyToTraining,
              'user-card-coach-2__status': !sportsman.readyToTraining,
              'user-card-coach-2__status--check': !sportsman.readyToTraining
            })}><span>{sportsman.readyToTraining ? 'Готов к тренировке' : 'Не готов к тренировке'}</span></div>
            <div className="user-card__text">
              <p>{sportsman.description}</p>
            </div>
            <ul className="user-card__hashtag-list">
              {sportsman.trainingTypes.map((trainingType) => (
                <li className="user-card__hashtag-item">
                  <div className="hashtag"><span>#{TrainingTypeRu[trainingType].toLowerCase()}</span></div>
                </li>
              ))}
            </ul>
            {authUser && authUser.id !== sportsman.id && (
              <>
                {!friendshipStatus || !friendshipStatus.status ? (
                  <button className="btn user-card__btn" type="button"
                          disabled={isFriendshipStatusLoading || !friendshipStatus || isFriendCreating}
                          onClick={handleCreateFriendButton}>Добавить в друзья
                  </button>
                ) : null}
                {friendshipStatus && friendshipStatus.status && (
                  <button className="btn btn--outlined user-card__btn" type="button"
                          disabled={isFriendDeleting}
                          onClick={handleDeleteFriendButton}>Удалить из друзей</button>
                )}
              </>
            )}
          </div>
          <div className="user-card__gallary">
            <ul className="user-card__gallary-list">
              <li className="user-card__gallary-item"><img src="/img/content/user-card-photo1.jpg"
                                                           srcSet="/img/content/user-card-photo1@2x.jpg 2x"
                                                           width="334" height="573" alt="photo1"/>
              </li>
              <li className="user-card__gallary-item"><img src="/img/content/user-card-photo2.jpg"
                                                           srcSet="/img/content/user-card-photo2@2x.jpg 2x"
                                                           width="334" height="573" alt="photo2"/>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {isMapOpen && <MapModal isUserMap location={sportsman.location} onClose={() => setIsMapOpen(false)} />}
    </div>
  );
}

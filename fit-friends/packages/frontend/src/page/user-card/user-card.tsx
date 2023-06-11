import {Header} from '../../components/header/header';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetUserQuery} from '../../store/features/users/users.api';
import {isCoachResponse, isSportsmanResponse} from '@fit-friends/shared-types';
import {SportsmanCard} from '../../components/sportsman-card/sportsman-card';
import {Spinner} from '../../components/spinner/spinner';
import {CoachCard} from '../../components/coach-card/coach-card';


export function UserCard() {
  const { userId = '' } = useParams<{userId: string}>();
  const {data: user, isLoading, isError} = useGetUserQuery(parseInt(userId));
  const navigate = useNavigate();

  if (isLoading) {
    return <Spinner />;
  }

  // if (isError) {
  //   navigate(-1);
  // }

  return (
    <div className="wrapper">
      <Header/>
      <main>
        <div className="inner-page inner-page--no-sidebar">
          <div className="container">
            <div className="inner-page__wrapper">
              <button className="btn-flat inner-page__back" type="button" onClick={() => navigate('/users')}>
                <svg width="14" height="10" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
                <span>Назад</span>
              </button>
            </div>
            {user && isSportsmanResponse(user) && <SportsmanCard sportsman={user} />}
            {user && isCoachResponse(user) && <CoachCard coach={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}

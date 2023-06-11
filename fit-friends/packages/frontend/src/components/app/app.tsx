import {Route, Routes} from 'react-router-dom';
import {IntroPage} from '../../page/intro/intro';
import {LoginPage} from '../../page/login/login';
import {RegisterPage} from '../../page/register/register';
import {useAppDispatch} from '../../hooks';
import {useEffect} from 'react';
import {getAuthUser} from '../../store/features/auth/auth.slice';
import {TrainingCatalog} from '../../page/training-catalog/training-catalog';
import {TrainingCard} from '../../page/training-card/training-card';
import {UsersCatalog} from '../../page/users-catalog/users-catalog';
import {UserCard} from '../../page/user-card/user-card';
import {GymCatalog} from '../../page/gym-catalog/gym-catalog';
import {GymCard} from '../../page/gym-card/gym-card';


export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAuthUser());
  });

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/users">
        <Route index element={<UsersCatalog />} />
        <Route path=":userId" element={<UserCard />} />
      </Route>
      <Route path="/gyms">
        <Route index element={<GymCatalog />} />
        <Route path=":gymId" element={<GymCard />} />
      </Route>
      <Route path="/trainings">
        <Route index element={<TrainingCatalog />} />
        <Route path=":trainingId" element={<TrainingCard />} />
      </Route>
    </Routes>
  );
}

export default App;

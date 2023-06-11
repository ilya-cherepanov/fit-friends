import {ReactElement} from 'react';
import {useAppSelector} from '../../hooks';
import {selectAuthState, selectAuthUser} from '../../store/features/auth/auth.slice';
import {UserRole} from '@fit-friends/core';
import {AuthorizationStatus} from '../../constants';
import {Navigate} from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactElement;
  acceptedRoles: UserRole[];
}

export function PrivateRoute({children, acceptedRoles = []}: PrivateRouteProps) {
  const authorizationStatus = useAppSelector(selectAuthState);
  const authUser = useAppSelector(selectAuthUser);

  const isAccepted = authorizationStatus === AuthorizationStatus.Unknown
    || (authorizationStatus === AuthorizationStatus.Auth
      && (acceptedRoles.length <= 0 || (authUser && acceptedRoles.includes(authUser.role))));

  return isAccepted ? {children} : <Navigate to="/login" />;
}

import {UserRole} from '@fit-friends/core';
import {SetMetadata} from '@nestjs/common';
import {ROLES_KEY} from '../../../constants';


export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

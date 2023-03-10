import {Level, Location, TrainingTimeIntervals, TrainingType, UserRole, UserSex} from '@fit-friends/core';

export interface BaseUserResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  sex: UserSex;
  birthDate: string;
  location: Location;
  createdAt: string;
  level: Level;
  trainingTypes: TrainingType[];
  role: UserRole;
}

export interface SportsmanResponse extends BaseUserResponse {
  // role: UserRole.Sportsman;
  caloriesPerDay: number;
  caloriesToLose: number;
  readyToTraining: boolean;
  trainingDuration: TrainingTimeIntervals;
}

export interface CoachResponse extends BaseUserResponse {
  // role: UserRole.Coach;
  certificate: string;
  achievements: string;
  hasPersonalTraining: boolean;
}

export type UserResponse = SportsmanResponse | CoachResponse;

export function isSportsmanResponse(userResponse: UserResponse): userResponse is SportsmanResponse {
  return userResponse.role === UserRole.Sportsman;
}

export function isCoachResponse(userResponse: UserResponse): userResponse is CoachResponse {
  return userResponse.role === UserRole.Coach;
}

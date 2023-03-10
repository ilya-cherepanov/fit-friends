import {Level, Location, TrainingTimeIntervals, TrainingType, UserRole, UserSex} from '@fit-friends/core';

export interface BaseRegisterData {
  name: string;
  email: string;
  password: string;
  sex: UserSex;
  location: Location;
  level: Level;
  trainingTypes: TrainingType[];
  role: UserRole;
}

export interface CoachRegisterData extends BaseRegisterData {
  role: UserRole.Coach;
  achievements: string;
  hasPersonalTraining: boolean;
}

export interface SportsmanRegisterData extends BaseRegisterData {
  role: UserRole.Sportsman;
  caloriesPerDay: number;
  caloriesToLose: number;
  trainingDuration: TrainingTimeIntervals;
}

export type SignUpData = SportsmanRegisterData | CoachRegisterData;

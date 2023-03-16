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
  birthDate?: string;
}

export interface CoachRegisterData extends BaseRegisterData {
  achievements: string;
  hasPersonalTrainings: boolean;
  certificate?: unknown;
}

export interface SportsmanRegisterData extends BaseRegisterData {
  caloriesPerDay: number;
  caloriesToLose: number;
  trainingDuration: TrainingTimeIntervals;
}

export type SignUpData = SportsmanRegisterData | CoachRegisterData;

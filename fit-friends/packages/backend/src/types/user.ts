import {Level, Location, TrainingTimeIntervals, TrainingType, UserRole, UserSex} from '@fit-friends/core';

export interface BaseUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  avatar: string | null;
  sex: UserSex;
  birthDate: Date;
  location: Location;
  createdAt?: Date;
  level: Level;
  trainingTypes: TrainingType[];
  role: UserRole;
}

export interface Sportsman extends BaseUser {
  caloriesPerDay: number;
  caloriesToLose: number;
  readyToTraining: boolean;
  trainingDuration: TrainingTimeIntervals;
  description: string;
}

export interface Coach extends BaseUser {
  certificate: string;
  achievements: string;
  hasPersonalTrainings: boolean;
}


import {Level, Location, TrainingTimeIntervals, TrainingType, UserRole, UserSex} from '@fit-friends/core';
import * as bcrypt from 'bcrypt';
import {SALT_ROUNDS} from '../../constants';
import {BaseUser, Coach, Sportsman} from '../../types/user';
import {User as PrismaUser, Coach as PrismaCoach, Sportsman as PrismaSportsman} from '@prisma/client';


export abstract class BaseUserEntity implements BaseUser {
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

  protected constructor(user: BaseUser) {
    this.fillEntity(user);
  }

  async setPassword(newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(newPassword, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  fillEntity(user: BaseUser) {
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.sex = user.sex;
    this.birthDate = user.birthDate;
    this.location = user.location;
    this.level = user.level;
    this.trainingTypes = user.trainingTypes;
    this.role = user.role;

    if (user.password) {
      this.password = user.password;
    }
    if (user.id) {
      this.id = user.id;
    }
    if (user.createdAt) {
      this.createdAt = user.createdAt;
    }
  }

  static createFromPrisma(user: PrismaUser & {coach?: PrismaCoach, sportsman?: PrismaSportsman}) {
    if (user.coach) {
      return new CoachEntity({
        ...user,
        sex: user.sex as UserSex,
        role: user.role as UserRole,
        level: user.level as Level,
        trainingTypes: user.trainingTypes as TrainingType[],
        location: user.location as Location,
        ...user.coach,
      });
    } else if (user.sportsman) {
      return new SportsmanEntity({
        ...user,
        sex: user.sex as UserSex,
        role: user.role as UserRole,
        level: user.level as Level,
        trainingTypes: user.trainingTypes as TrainingType[],
        location: user.location as Location,
        ...user.sportsman,
        trainingDuration: user.sportsman.trainingDuration as TrainingTimeIntervals,
      });
    }

    return null;
  }
}

export class SportsmanEntity extends BaseUserEntity implements Sportsman {
  role = UserRole.Sportsman;
  caloriesPerDay: number;
  caloriesToLose: number;
  readyToTraining: boolean;
  trainingDuration: TrainingTimeIntervals;

  constructor(sportsman: Sportsman) {
    super(sportsman);
  }

  fillEntity(sportsman: Sportsman) {
    super.fillEntity(sportsman);
    this.caloriesPerDay = sportsman.caloriesPerDay;
    this.caloriesToLose = sportsman.caloriesToLose;
    this.readyToTraining = sportsman.readyToTraining;
    this.trainingDuration = sportsman.trainingDuration;

    this.role = UserRole.Sportsman;
  }
}

export class CoachEntity extends BaseUserEntity implements Coach {
  role = UserRole.Coach;
  certificate: string;
  achievements: string;
  hasPersonalTrainings: boolean;

  constructor(coach: Coach) {
    super(coach);
  }

  fillEntity(coach: Coach) {
    super.fillEntity(coach);
    this.certificate = coach.certificate;
    this.achievements = coach.achievements;
    this.hasPersonalTrainings = coach.hasPersonalTrainings;

    this.role = UserRole.Coach;
  }
}

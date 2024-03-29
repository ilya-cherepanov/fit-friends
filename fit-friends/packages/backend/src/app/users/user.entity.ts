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

  update(user: Partial<BaseUser>) {

    this.name = user.name ?? this.name;
    this.email = user.email ?? this.email;
    this.avatar = user.avatar ?? this.avatar;
    this.sex = user.sex ?? this.sex;
    this.birthDate = user.birthDate ?? this.birthDate;
    this.location = user.location ?? this.location;
    this.level = user.level ?? this.level;
    this.trainingTypes = user.trainingTypes ?? this.trainingTypes;
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
        description: user.sportsman.description,
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
  description: string;

  constructor(sportsman: Sportsman) {
     super(sportsman);
  }

  update(user: Partial<Sportsman>) {
    super.update(user);

    this.caloriesToLose = user.caloriesToLose ?? this.caloriesToLose;
    this.caloriesPerDay = user.caloriesPerDay ?? this.caloriesPerDay;
    this.readyToTraining = user.readyToTraining ?? this.readyToTraining;
    this.trainingDuration = user.trainingDuration ?? this.trainingDuration;
    this.description = user.description ?? this.description;
  }

  fillEntity(sportsman: Sportsman) {
    super.fillEntity(sportsman);
    this.caloriesPerDay = sportsman.caloriesPerDay;
    this.caloriesToLose = sportsman.caloriesToLose;
    this.readyToTraining = sportsman.readyToTraining;
    this.trainingDuration = sportsman.trainingDuration;
    this.description = sportsman.description;

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

  update(user: Partial<Coach>) {
    super.update(user);

    this.certificate = user.certificate ?? this.certificate;
    this.achievements = user.achievements ?? this.achievements;
    this.hasPersonalTrainings = user.hasPersonalTrainings ?? this.hasPersonalTrainings;
  }

  fillEntity(coach: Coach) {
    super.fillEntity(coach);
    this.certificate = coach.certificate;
    this.achievements = coach.achievements;
    this.hasPersonalTrainings = coach.hasPersonalTrainings;

    this.role = UserRole.Coach;
  }
}

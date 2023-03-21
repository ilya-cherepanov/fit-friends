import {Training} from '../../types/training';
import {Level, TrainingTimeIntervals, TrainingType, UserSex} from '@fit-friends/core';


export class TrainingEntity implements Training {
  calories: number;
  description: string;
  duration: TrainingTimeIntervals;
  id?: number;
  image: string;
  isSpecialOffer: boolean;
  level: Level;
  price: number;
  rating?: number;
  sex: UserSex;
  title: string;
  type: TrainingType;
  video: string;

  constructor(training: Training) {
    this.fillEntity(training);
  }

  fillEntity(training: Training) {
    this.calories = training.calories;
    this.description = training.description;
    this.duration = training.duration;
    this.image = training.image;
    this.isSpecialOffer = training.isSpecialOffer;
    this.level = training.level;
    this.price = training.price;
    this.sex = training.sex;
    this.title = training.title;
    this.type = training.type;
    this.video = training.video;

    if (training.id) {
      this.id = training.id;
    }
    if (training.rating) {
      this.rating = training.rating;
    }
  }
}

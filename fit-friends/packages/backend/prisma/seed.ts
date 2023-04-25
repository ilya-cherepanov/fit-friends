import {PrismaClient} from '@prisma/client';
import {generateUser} from '../src/mock/user';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {FriendStatus, UserRole} from '../../core/src';
import {generateGym} from '../src/mock/gym';
import {generateTraining} from '../src/mock/training';
import {random, sample, sampleSize} from 'lodash';
import {generateReview} from '../src/mock/review';
import {generateEatings} from '../src/mock/eatings';
import {generateOrder} from '../src/mock/order';
import {generateBalance} from '../src/mock/balance';

const prisma = new PrismaClient();

async function fillDb() {
  // Create Coaches
  const coaches = await Promise.all(
    Array.from({length: 5}, () => generateUser(UserRole.Coach))
  );
  const createdCoaches = await Promise.all(coaches.map((coach) => prisma.user.create({
    data: coach,
  })));

  // Create Sportsmen
  const sportsmen = await Promise.all(
    Array.from({length: 5}, () => generateUser(UserRole.Sportsman))
  );
  const createdSportsmen = await Promise.all(sportsmen.map((sportsman) => prisma.user.create({
    data: sportsman,
  })))

  // Create Trainings
  const trainings = (await Promise.all(createdCoaches.map(async (createdCoach) => {
    return await Promise.all(
      Array.from({length: random(5, 10)}, () => generateTraining(createdCoach.id))
    );
  }))).flat();
  const createdTrainings = await prisma.$transaction(
    trainings.map((training) => prisma.training.create({data: training}))
  );

  // Create Reviews
  const reviews = createdTrainings.map((createdTraining) => {
    return Array.from(
      {length: random(5, 10)},
      () => generateReview(createdTraining.id, sample(createdSportsmen).id)
    );
  }).flat();
  const createdReviews = await prisma.$transaction(
    reviews.map((review) => prisma.review.create({data: review}))
  );
  const avgReviewsRatings = await prisma.review.groupBy({
    by: ['trainingId'],
    _avg: {
      rating: true,
    },
  });
  await prisma.$transaction(
    avgReviewsRatings.map((avgReviewsRatings) => prisma.training.update({
      where: {id: avgReviewsRatings.trainingId},
      data: {rating: avgReviewsRatings._avg.rating},
    }))
  );

  // Create Subscribers
  const subscribers = await Promise.all(createdSportsmen.map((sportsman) => {
    const randomCoaches = sampleSize(createdCoaches, random(5, 10));

    return prisma.subscriber.createMany({
      data: randomCoaches.map((randomCoach) => ({
        subscriberId: sportsman.id,
        trainerId: randomCoach.id,
      })),
    });
  }));

  // Create Gyms
  const gyms = await Promise.all(
    Array.from({length: 10}, () => generateGym())
  );
  const createdGyms = await Promise.all(gyms.map((gym) => prisma.gym.create({
    data: gym,
  })));

  // Create favorite gyms
  const favoriteGyms = createdSportsmen.map((createdSportsman) => {
    return sampleSize(createdGyms, random(5, 10)).map((createdGym) => ({
      userId: createdSportsman.id,
      gymId: createdGym.id,
    }));
  }).flat();
  const createdFavoriteGyms = await prisma.$transaction(
    favoriteGyms.map((favoriteGym) => prisma.favoriteGym.create({data: favoriteGym}))
  );

  // Create eatings
  const eatings = createdSportsmen.map((createdSportsman) => generateEatings(createdSportsman.id)).flat();
  const createdEatings = await prisma.$transaction(
    eatings.map((eating) => prisma.eating.create({data: eating}))
  );

  // Create friends
  const allUsers = [...createdSportsmen, ...createdCoaches];
  const friends = createdSportsmen.map((createdSportsman, sportsmanIndex) =>
    allUsers.map((user, userIndex) => {
      if (Math.random() >= 0.5 && createdSportsman.id !== user.id && userIndex >= sportsmanIndex) {
        return {
          userId: createdSportsman.id,
          friendId: user.id,
          status: FriendStatus.Accepted,
        };
      }

      return null;
    })
  ).flat().filter((friend) => friend !== null);
  const createdFriends = await prisma.$transaction(
    friends.map((friend) => prisma.friend.create({data: friend}))
  );

  // Create orders
  const orders = createdSportsmen.map((createdSportsman) => {
    return Array.from(
      {length: random(5, 10)},
      () => generateOrder(createdSportsman.id, createdTrainings, createdGyms),
    );
  }).flat();
  const createdOrders = await prisma.$transaction(
    orders.map((order) => prisma.order.create({data: order}))
  );

  // Create balance
  const balance = generateBalance(orders);
  const createdBalance = await prisma.$transaction(
    balance.map((balanceItem) => prisma.balance.create({data: balanceItem}))
  );
}

(async () => {
  try {
    console.log(process.cwd());
    await fillDb();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

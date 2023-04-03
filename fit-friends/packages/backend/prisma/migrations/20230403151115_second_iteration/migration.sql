-- AlterTable
ALTER TABLE "training" ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "eating" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "calories" SMALLINT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(31) NOT NULL,

    CONSTRAINT "eating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_training" (
    "id" SERIAL NOT NULL,
    "traininig_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calories" SMALLINT NOT NULL,
    "duration" VARCHAR(31) NOT NULL,

    CONSTRAINT "completed_training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" VARCHAR(31) NOT NULL,
    "trainingId" INTEGER,
    "gym_id" INTEGER,
    "remains" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriber" (
    "subscriber_id" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "needToClean" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subscriber_pkey" PRIMARY KEY ("subscriber_id","trainer_id")
);

-- AddForeignKey
ALTER TABLE "eating" ADD CONSTRAINT "eating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_training" ADD CONSTRAINT "completed_training_traininig_id_fkey" FOREIGN KEY ("traininig_id") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance" ADD CONSTRAINT "balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance" ADD CONSTRAINT "balance_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance" ADD CONSTRAINT "balance_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriber" ADD CONSTRAINT "subscriber_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriber" ADD CONSTRAINT "subscriber_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

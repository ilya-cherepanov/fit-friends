-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "sex" VARCHAR(31) NOT NULL,
    "role" VARCHAR(31) NOT NULL,
    "birth_date" TIMESTAMP(3),
    "location" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" VARCHAR(31) NOT NULL,
    "training_types" VARCHAR(31)[],
    "refresh_token" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sportsman" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "calories_per_day" SMALLINT NOT NULL,
    "calories_to_lose" SMALLINT NOT NULL,
    "ready_to_training" BOOLEAN NOT NULL,
    "training_duration" VARCHAR(31) NOT NULL,

    CONSTRAINT "sportsman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "certificate" VARCHAR(255) NOT NULL,
    "achievements" VARCHAR(511) NOT NULL,
    "has_personal_trainings" BOOLEAN NOT NULL,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(63) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "level" VARCHAR(31) NOT NULL,
    "types" VARCHAR(31)[],
    "duration" VARCHAR(31) NOT NULL,
    "price" INTEGER NOT NULL,
    "calories" SMALLINT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "sex" VARCHAR(31) NOT NULL,
    "video" VARCHAR(255) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_special_offer" BOOLEAN NOT NULL DEFAULT false,
    "coach_id" INTEGER NOT NULL,

    CONSTRAINT "training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(63) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "parameters" VARCHAR(63)[],
    "photos" VARCHAR(255)[],
    "description" VARCHAR(511) NOT NULL,
    "price" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "training_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(31) NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "sum" INTEGER NOT NULL,
    "payment_method" VARCHAR(31) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_request" (
    "id" SERIAL NOT NULL,
    "initiator_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(31) NOT NULL,

    CONSTRAINT "training_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "text" VARCHAR(511) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sportsman_user_id_key" ON "sportsman"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "coach_user_id_key" ON "coach"("user_id");

-- AddForeignKey
ALTER TABLE "sportsman" ADD CONSTRAINT "sportsman_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_request" ADD CONSTRAINT "training_request_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "sportsman"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_request" ADD CONSTRAINT "training_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

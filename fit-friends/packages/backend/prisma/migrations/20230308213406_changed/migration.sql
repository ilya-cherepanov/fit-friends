/*
  Warnings:

  - You are about to drop the column `user_id` on the `coach` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sportsman` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "coach" DROP CONSTRAINT "coach_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sportsman" DROP CONSTRAINT "sportsman_user_id_fkey";

-- DropIndex
DROP INDEX "coach_user_id_key";

-- DropIndex
DROP INDEX "sportsman_user_id_key";

-- AlterTable
ALTER TABLE "coach" DROP COLUMN "user_id",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "coach_id_seq";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "gym_id" INTEGER,
ADD COLUMN     "training_id" INTEGER;

-- AlterTable
ALTER TABLE "sportsman" DROP COLUMN "user_id",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "sportsman_id_seq";

-- AddForeignKey
ALTER TABLE "sportsman" ADD CONSTRAINT "sportsman_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

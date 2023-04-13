/*
  Warnings:

  - Added the required column `user_id` to the `completed_training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "completed_training" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "completed_training" ADD CONSTRAINT "completed_training_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sportsman"("id") ON DELETE CASCADE ON UPDATE CASCADE;

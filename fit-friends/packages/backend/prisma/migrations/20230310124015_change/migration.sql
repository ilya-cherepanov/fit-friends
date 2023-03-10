/*
  Warnings:

  - You are about to drop the column `types` on the `training` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `training_request` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_user_id` to the `training_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "training_request" DROP CONSTRAINT "training_request_user_id_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training" DROP COLUMN "types",
ADD COLUMN     "type" VARCHAR(31) NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "training_request" DROP COLUMN "user_id",
ADD COLUMN     "target_user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_request" ADD CONSTRAINT "training_request_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[created_at,type,user_id]` on the table `eating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "eating_created_at_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "eating_created_at_type_user_id_key" ON "eating"("created_at", "type", "user_id");

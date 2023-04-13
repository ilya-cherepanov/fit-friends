/*
  Warnings:

  - A unique constraint covering the columns `[created_at,type]` on the table `eating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "eating_created_at_type_key" ON "eating"("created_at", "type");

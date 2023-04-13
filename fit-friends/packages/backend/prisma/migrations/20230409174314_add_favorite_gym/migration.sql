-- CreateTable
CREATE TABLE "favorite_gyms" (
    "user_id" INTEGER NOT NULL,
    "gym_id" INTEGER NOT NULL,

    CONSTRAINT "favorite_gyms_pkey" PRIMARY KEY ("user_id","gym_id")
);

-- AddForeignKey
ALTER TABLE "favorite_gyms" ADD CONSTRAINT "favorite_gyms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_gyms" ADD CONSTRAINT "favorite_gyms_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

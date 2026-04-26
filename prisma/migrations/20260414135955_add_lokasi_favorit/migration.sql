-- CreateTable
CREATE TABLE "lokasi_olahraga" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lokasi_olahraga_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lokasi_olahraga" ADD CONSTRAINT "lokasi_olahraga_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

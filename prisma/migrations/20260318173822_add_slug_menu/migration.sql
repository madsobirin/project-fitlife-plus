-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('Kurus', 'Normal', 'Berlebih', 'Obesitas');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "google_id" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "phone" TEXT,
    "birthdate" TIMESTAMP(3),
    "weight" INTEGER,
    "height" INTEGER,
    "photo" TEXT,
    "google_avatar" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artikels" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "penulis" TEXT NOT NULL DEFAULT 'Admin',
    "isi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "is_featured" BOOLEAN DEFAULT false,
    "dibaca" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "artikels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "makanan" (
    "id" BIGSERIAL NOT NULL,
    "nama_makanan" TEXT NOT NULL,
    "kalori" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "makanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "nama_menu" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kalori" INTEGER NOT NULL,
    "target_status" "TargetStatus" NOT NULL,
    "waktu_memasak" INTEGER NOT NULL,
    "dibaca" INTEGER DEFAULT 0,
    "gambar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perhitungan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tinggi_badan" DOUBLE PRECISION NOT NULL,
    "berat_badan" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "perhitungan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artikels_slug_key" ON "artikels"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "menus_slug_key" ON "menus"("slug");

-- AddForeignKey
ALTER TABLE "perhitungan" ADD CONSTRAINT "perhitungan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

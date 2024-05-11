/*
  Warnings:

  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Standards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Courses";

-- DropTable
DROP TABLE "Standards";

-- CreateTable
CREATE TABLE "courses" (
    "cid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "standards" (
    "cid" INTEGER NOT NULL,
    "god" DECIMAL(10,2) NOT NULL,
    "myth_a" DECIMAL(10,2) NOT NULL,
    "myth_b" DECIMAL(10,2) NOT NULL,
    "myth_c" DECIMAL(10,2) NOT NULL,
    "myth_d" DECIMAL(10,2) NOT NULL,
    "myth_e" DECIMAL(10,2) NOT NULL,
    "titan_a" DECIMAL(10,2) NOT NULL,
    "titan_b" DECIMAL(10,2) NOT NULL,
    "titan_c" DECIMAL(10,2) NOT NULL,
    "titan_d" DECIMAL(10,2) NOT NULL,
    "titan_e" DECIMAL(10,2) NOT NULL,
    "hero_a" DECIMAL(10,2) NOT NULL,
    "hero_b" DECIMAL(10,2) NOT NULL,
    "hero_c" DECIMAL(10,2) NOT NULL,
    "hero_d" DECIMAL(10,2) NOT NULL,
    "hero_e" DECIMAL(10,2) NOT NULL,
    "exp_a" DECIMAL(10,2) NOT NULL,
    "exp_b" DECIMAL(10,2) NOT NULL,
    "exp_c" DECIMAL(10,2) NOT NULL,
    "exp_d" DECIMAL(10,2) NOT NULL,
    "exp_e" DECIMAL(10,2) NOT NULL,
    "adv_a" DECIMAL(10,2) NOT NULL,
    "adv_b" DECIMAL(10,2) NOT NULL,
    "adv_c" DECIMAL(10,2) NOT NULL,
    "adv_d" DECIMAL(10,2) NOT NULL,
    "adv_e" DECIMAL(10,2) NOT NULL,
    "int_a" DECIMAL(10,2) NOT NULL,
    "int_b" DECIMAL(10,2) NOT NULL,
    "int_c" DECIMAL(10,2) NOT NULL,
    "int_d" DECIMAL(10,2) NOT NULL,
    "int_e" DECIMAL(10,2) NOT NULL,
    "beg_a" DECIMAL(10,2) NOT NULL,
    "beg_b" DECIMAL(10,2) NOT NULL,
    "beg_c" DECIMAL(10,2) NOT NULL,
    "beg_d" DECIMAL(10,2) NOT NULL,
    "beg_e" DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE "standards_shortcut" (
    "cid" INTEGER NOT NULL,
    "god" DECIMAL(10,2) NOT NULL,
    "myth_a" DECIMAL(10,2) NOT NULL,
    "myth_b" DECIMAL(10,2) NOT NULL,
    "myth_c" DECIMAL(10,2) NOT NULL,
    "myth_d" DECIMAL(10,2) NOT NULL,
    "myth_e" DECIMAL(10,2) NOT NULL,
    "titan_a" DECIMAL(10,2) NOT NULL,
    "titan_b" DECIMAL(10,2) NOT NULL,
    "titan_c" DECIMAL(10,2) NOT NULL,
    "titan_d" DECIMAL(10,2) NOT NULL,
    "titan_e" DECIMAL(10,2) NOT NULL,
    "hero_a" DECIMAL(10,2) NOT NULL,
    "hero_b" DECIMAL(10,2) NOT NULL,
    "hero_c" DECIMAL(10,2) NOT NULL,
    "hero_d" DECIMAL(10,2) NOT NULL,
    "hero_e" DECIMAL(10,2) NOT NULL,
    "exp_a" DECIMAL(10,2) NOT NULL,
    "exp_b" DECIMAL(10,2) NOT NULL,
    "exp_c" DECIMAL(10,2) NOT NULL,
    "exp_d" DECIMAL(10,2) NOT NULL,
    "exp_e" DECIMAL(10,2) NOT NULL,
    "adv_a" DECIMAL(10,2) NOT NULL,
    "adv_b" DECIMAL(10,2) NOT NULL,
    "adv_c" DECIMAL(10,2) NOT NULL,
    "adv_d" DECIMAL(10,2) NOT NULL,
    "adv_e" DECIMAL(10,2) NOT NULL,
    "int_a" DECIMAL(10,2) NOT NULL,
    "int_b" DECIMAL(10,2) NOT NULL,
    "int_c" DECIMAL(10,2) NOT NULL,
    "int_d" DECIMAL(10,2) NOT NULL,
    "int_e" DECIMAL(10,2) NOT NULL,
    "beg_a" DECIMAL(10,2) NOT NULL,
    "beg_b" DECIMAL(10,2) NOT NULL,
    "beg_c" DECIMAL(10,2) NOT NULL,
    "beg_d" DECIMAL(10,2) NOT NULL,
    "beg_e" DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE "standards_non_zzmt" (
    "cid" INTEGER NOT NULL,
    "god" DECIMAL(10,2) NOT NULL,
    "myth_a" DECIMAL(10,2) NOT NULL,
    "myth_b" DECIMAL(10,2) NOT NULL,
    "myth_c" DECIMAL(10,2) NOT NULL,
    "myth_d" DECIMAL(10,2) NOT NULL,
    "myth_e" DECIMAL(10,2) NOT NULL,
    "titan_a" DECIMAL(10,2) NOT NULL,
    "titan_b" DECIMAL(10,2) NOT NULL,
    "titan_c" DECIMAL(10,2) NOT NULL,
    "titan_d" DECIMAL(10,2) NOT NULL,
    "titan_e" DECIMAL(10,2) NOT NULL,
    "hero_a" DECIMAL(10,2) NOT NULL,
    "hero_b" DECIMAL(10,2) NOT NULL,
    "hero_c" DECIMAL(10,2) NOT NULL,
    "hero_d" DECIMAL(10,2) NOT NULL,
    "hero_e" DECIMAL(10,2) NOT NULL,
    "exp_a" DECIMAL(10,2) NOT NULL,
    "exp_b" DECIMAL(10,2) NOT NULL,
    "exp_c" DECIMAL(10,2) NOT NULL,
    "exp_d" DECIMAL(10,2) NOT NULL,
    "exp_e" DECIMAL(10,2) NOT NULL,
    "adv_a" DECIMAL(10,2) NOT NULL,
    "adv_b" DECIMAL(10,2) NOT NULL,
    "adv_c" DECIMAL(10,2) NOT NULL,
    "adv_d" DECIMAL(10,2) NOT NULL,
    "adv_e" DECIMAL(10,2) NOT NULL,
    "int_a" DECIMAL(10,2) NOT NULL,
    "int_b" DECIMAL(10,2) NOT NULL,
    "int_c" DECIMAL(10,2) NOT NULL,
    "int_d" DECIMAL(10,2) NOT NULL,
    "int_e" DECIMAL(10,2) NOT NULL,
    "beg_a" DECIMAL(10,2) NOT NULL,
    "beg_b" DECIMAL(10,2) NOT NULL,
    "beg_c" DECIMAL(10,2) NOT NULL,
    "beg_d" DECIMAL(10,2) NOT NULL,
    "beg_e" DECIMAL(10,2) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "standards_cid_key" ON "standards"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "standards_shortcut_cid_key" ON "standards_shortcut"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "standards_non_zzmt_cid_key" ON "standards_non_zzmt"("cid");

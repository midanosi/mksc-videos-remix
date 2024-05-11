-- CreateTable
CREATE TABLE "Courses" (
    "cid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "Standards" (
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
CREATE UNIQUE INDEX "Standards_cid_key" ON "Standards"("cid");

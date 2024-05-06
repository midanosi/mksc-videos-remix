-- CreateTable
CREATE TABLE "mkscvids" (
    "id" SERIAL NOT NULL,
    "cid" INTEGER,
    "time" DECIMAL(10,2),
    "link" TEXT,
    "mode" INTEGER,
    "player" TEXT,
    "uploaded_at" DATE,
    "standard" TEXT,

    CONSTRAINT "mkscvids_pkey" PRIMARY KEY ("id")
);


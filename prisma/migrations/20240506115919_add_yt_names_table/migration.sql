-- CreateTable
CREATE TABLE "mkscytnames" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "mkscytnames_id_key" ON "mkscytnames"("id");

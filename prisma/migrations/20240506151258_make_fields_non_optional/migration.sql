/*
  Warnings:

  - Made the column `cid` on table `mkscvids` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `mkscvids` required. This step will fail if there are existing NULL values in that column.
  - Made the column `link` on table `mkscvids` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mode` on table `mkscvids` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "mkscvids" ALTER COLUMN "cid" SET NOT NULL,
ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "link" SET NOT NULL,
ALTER COLUMN "mode" SET NOT NULL;

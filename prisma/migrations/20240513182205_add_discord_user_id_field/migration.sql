-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "discord_user_id" TEXT,
ALTER COLUMN "email_address" DROP NOT NULL;

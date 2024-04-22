/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "OriginSite" ADD VALUE 'RUANYF';

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification_token";

-- DropEnum
DROP TYPE "Role";

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "fullTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

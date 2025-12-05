/*
  Warnings:

  - Added the required column `userEmail` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "userEmail" TEXT NOT NULL;

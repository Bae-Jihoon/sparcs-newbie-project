/*
  Warnings:

  - Added the required column `roadAddress` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Spot` ADD COLUMN `roadAddress` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - Made the column `avgRate` on table `Spot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Spot` MODIFY `avgRate` DOUBLE NOT NULL DEFAULT 0;

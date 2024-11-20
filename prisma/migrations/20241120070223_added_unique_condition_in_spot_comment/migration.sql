/*
  Warnings:

  - A unique constraint covering the columns `[authorId,spotId]` on the table `SpotComment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SpotComment_authorId_spotId_key` ON `SpotComment`(`authorId`, `spotId`);

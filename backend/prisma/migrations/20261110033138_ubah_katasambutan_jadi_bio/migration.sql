/*
  Warnings:

  - You are about to drop the column `kataSambutan` on the `pimpinan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pimpinan` DROP COLUMN `kataSambutan`,
    ADD COLUMN `bio` TEXT NULL;

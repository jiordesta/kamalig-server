/*
  Warnings:

  - Added the required column `quantity` to the `Restock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restock" ADD COLUMN     "quantity" INTEGER NOT NULL;

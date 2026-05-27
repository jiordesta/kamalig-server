/*
  Warnings:

  - You are about to drop the column `quantity` on the `ReportItem` table. All the data in the column will be lost.
  - Added the required column `itemQuantity` to the `ReportItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportQuantity` to the `ReportItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportItem" DROP COLUMN "quantity",
ADD COLUMN     "itemQuantity" INTEGER NOT NULL,
ADD COLUMN     "reportQuantity" INTEGER NOT NULL;

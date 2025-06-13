/*
  Warnings:

  - You are about to drop the column `subtotal` on the `OrderProduct` table. All the data in the column will be lost.
  - Added the required column `subTotal` to the `OrderProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderProduct" DROP COLUMN "subtotal",
ADD COLUMN     "subTotal" INTEGER NOT NULL;

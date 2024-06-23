/*
  Warnings:

  - You are about to drop the column `Street` on the `Address` table. All the data in the column will be lost.
  - Added the required column `street` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "Street",
ADD COLUMN     "street" VARCHAR(100) NOT NULL;

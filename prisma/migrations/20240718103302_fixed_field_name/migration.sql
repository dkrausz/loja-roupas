/*
  Warnings:

  - You are about to drop the column `adressId` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_adressId_fkey";

-- DropIndex
DROP INDEX "Store_adressId_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "adressId",
ADD COLUMN     "addressId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_addressId_key" ON "Store"("addressId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

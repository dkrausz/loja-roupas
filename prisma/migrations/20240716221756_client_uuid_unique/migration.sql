/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_publicId_key" ON "Client"("publicId");

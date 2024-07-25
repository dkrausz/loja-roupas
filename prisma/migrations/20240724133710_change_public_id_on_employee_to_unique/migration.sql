/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Employee_publicId_key" ON "Employee"("publicId");

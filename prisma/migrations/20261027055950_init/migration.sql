/*
  Warnings:

  - A unique constraint covering the columns `[Api_key]` on the table `tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Api_key` to the `tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenant" ADD COLUMN     "Api_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tenant_Api_key_key" ON "tenant"("Api_key");

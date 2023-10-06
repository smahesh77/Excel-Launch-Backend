/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "LauchStatus" (
    "id" INTEGER NOT NULL,
    "logoStatus" BOOLEAN NOT NULL,

    CONSTRAINT "LauchStatus_pkey" PRIMARY KEY ("id")
);

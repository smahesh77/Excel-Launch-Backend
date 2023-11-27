/*
  Warnings:

  - You are about to drop the `LauchStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LauchStatus";

-- CreateTable
CREATE TABLE "LaunchStatus" (
    "id" SERIAL NOT NULL,
    "websiteStatus" BOOLEAN NOT NULL DEFAULT false,
    "mascotStatus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LaunchStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicLink" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,

    CONSTRAINT "DynamicLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DynamicLink_id_key" ON "DynamicLink"("id");

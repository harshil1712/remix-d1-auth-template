-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "providerUserId" TEXT,
    "avatar" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


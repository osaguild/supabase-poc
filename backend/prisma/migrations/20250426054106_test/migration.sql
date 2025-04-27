-- CreateTable
CREATE TABLE "name_entries" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "name_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "full_names" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "full_names_pkey" PRIMARY KEY ("id")
);

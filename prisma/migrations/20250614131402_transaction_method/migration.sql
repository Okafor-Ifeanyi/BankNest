-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('cash', 'transfer', 'cheque');

-- AlterTable
ALTER TABLE "ExternalTransfer" ADD COLUMN     "code" TEXT,
ADD COLUMN     "recipientAddress" TEXT,
ADD COLUMN     "remark" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "method" "TransactionMethod" NOT NULL DEFAULT 'cash';

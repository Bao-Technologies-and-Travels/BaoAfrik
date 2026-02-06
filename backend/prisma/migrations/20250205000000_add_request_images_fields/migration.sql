-- AlterTable: Add new fields to product_requests table
ALTER TABLE "product_requests" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "product_requests" ADD COLUMN IF NOT EXISTS "quantity" TEXT;
ALTER TABLE "product_requests" ADD COLUMN IF NOT EXISTS "quantity_unit" TEXT;
ALTER TABLE "product_requests" ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMP(3);
ALTER TABLE "product_requests" ADD COLUMN IF NOT EXISTS "images" JSONB;

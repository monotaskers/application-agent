-- Migration: Add address fields and title, remove company_email
-- Description: Adds address fields (address_1, address_2, city, state, postal_code, country) and title field to profiles table.
--              Removes company_email column. Country defaults to 'US' if empty.

-- 1. Add address fields to profiles table
ALTER TABLE "public"."profiles" 
  ADD COLUMN "address_1" text,
  ADD COLUMN "address_2" text,
  ADD COLUMN "city" text,
  ADD COLUMN "state" text,
  ADD COLUMN "postal_code" text,
  ADD COLUMN "country" text DEFAULT 'US',
  ADD COLUMN "title" text;

COMMENT ON COLUMN "public"."profiles"."address_1" IS 'Primary address line (street address, PO box, etc.)';
COMMENT ON COLUMN "public"."profiles"."address_2" IS 'Secondary address line (apartment, suite, unit, building, floor, etc.)';
COMMENT ON COLUMN "public"."profiles"."city" IS 'City or locality name';
COMMENT ON COLUMN "public"."profiles"."state" IS 'State, province, or region code';
COMMENT ON COLUMN "public"."profiles"."postal_code" IS 'Postal or ZIP code';
COMMENT ON COLUMN "public"."profiles"."country" IS 'Country code (defaults to US)';
COMMENT ON COLUMN "public"."profiles"."title" IS 'User job title or role';

-- 2. Remove company_email column
ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "company_email";

-- 3. Drop the company_email index if it exists
DROP INDEX IF EXISTS "public"."profiles_company_email_idx";

-- 4. Drop the company_email constraint if it exists
ALTER TABLE "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_company_email_format";


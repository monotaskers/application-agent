-- Migration: Add companies table and company_id to profiles
-- Description: Creates companies table and adds company_id foreign key to profiles table.
--              Automatically assigns users with @ocupop.com email addresses to Ocupop company.

-- 1. Create companies table
CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" NOT NULL DEFAULT gen_random_uuid(),
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "companies_name_key" UNIQUE ("name")
);

ALTER TABLE "public"."companies" OWNER TO "postgres";

COMMENT ON TABLE "public"."companies" IS 'Company/organization entities that users can belong to';

COMMENT ON COLUMN "public"."companies"."id" IS 'Primary key (UUID)';

COMMENT ON COLUMN "public"."companies"."name" IS 'Company name (unique)';

COMMENT ON COLUMN "public"."companies"."created_at" IS 'Timestamp when company was created';

COMMENT ON COLUMN "public"."companies"."updated_at" IS 'Timestamp when company was last updated (automatically maintained)';

COMMENT ON COLUMN "public"."companies"."deleted_at" IS 'Soft delete timestamp (null = active, non-null = deleted)';

-- 2. Create index on deleted_at for filtering active companies
CREATE INDEX "companies_deleted_at_idx" ON "public"."companies" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);

-- 3. Create trigger for updated_at
CREATE OR REPLACE TRIGGER "companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

-- 4. Insert default Ocupop company
INSERT INTO "public"."companies" ("name") VALUES ('Ocupop') 
ON CONFLICT ("name") DO NOTHING;

-- 5. Add company_id column to profiles table
ALTER TABLE "public"."profiles" ADD COLUMN "company_id" "uuid";

COMMENT ON COLUMN "public"."profiles"."company_id" IS 'Foreign key referencing companies.id. Automatically assigned based on email domain.';

-- 6. Create index on company_id for query performance
CREATE INDEX "profiles_company_id_idx" ON "public"."profiles" USING "btree" ("company_id") WHERE ("company_id" IS NOT NULL);

-- 7. Update existing profiles with @ocupop.com email addresses
UPDATE "public"."profiles" 
SET "company_id" = (SELECT "id" FROM "public"."companies" WHERE "name" = 'Ocupop' LIMIT 1)
WHERE "email" LIKE '%@ocupop.com' 
  AND "company_id" IS NULL
  AND "deleted_at" IS NULL;

-- 8. Add foreign key constraint (after data update)
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL;

-- 9. Grant permissions
GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";

-- 10. Enable RLS on companies table
ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for companies
-- Users can view active (non-deleted) companies
CREATE POLICY "Users can view active companies" ON "public"."companies"
    FOR SELECT
    USING ("deleted_at" IS NULL);


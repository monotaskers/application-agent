CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"contact_person" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"address" varchar(500),
	"notes" text,
	"version" integer DEFAULT 1 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"client_id" uuid,
	"status" varchar(50) DEFAULT 'Planning' NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"budget" integer,
	"notes" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_clients_org_id" ON "clients" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_clients_org_deleted" ON "clients" USING btree ("organization_id","deleted_at");--> statement-breakpoint
CREATE INDEX "idx_clients_version" ON "clients" USING btree ("id","version");--> statement-breakpoint
CREATE INDEX "idx_projects_org_id" ON "projects" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_projects_client_id" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_projects_status" ON "projects" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_projects_dates" ON "projects" USING btree ("organization_id","start_date","end_date");--> statement-breakpoint
CREATE INDEX "idx_projects_version" ON "projects" USING btree ("id","version");
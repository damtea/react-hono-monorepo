CREATE TABLE "administrators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	CONSTRAINT "administrators_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"customer_name" text,
	"customer_contact" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "example" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"contact" text,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expense" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"head" text NOT NULL,
	"amount" real DEFAULT 0 NOT NULL,
	"description" text,
	"entry_date" date DEFAULT now() NOT NULL,
	"payment_method" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"sku_code" text,
	"hsn_code" text,
	"batch_number" text,
	"stock_quantity" integer NOT NULL,
	"purchase_price" real NOT NULL,
	"selling_price" real NOT NULL,
	"discount_rate" real DEFAULT 0 NOT NULL,
	"gst_rate" real DEFAULT 0 NOT NULL,
	"gst_type" text NOT NULL,
	"manufacturing_date" date,
	"expiry_date" date,
	"description" text,
	"status" text DEFAULT 'Instock' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_name" text NOT NULL,
	"merchant_email" text NOT NULL,
	"merchant_address" text,
	"merchant_contact" text,
	"merchant_logo" text,
	"merchant_gstin" text,
	"merchant_license_number" text,
	"merchant_registration_number" text,
	"merchant_prefix" text NOT NULL,
	"current_plan" text NOT NULL,
	"valid_till" date NOT NULL,
	"password" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	CONSTRAINT "merchant_merchant_email_unique" UNIQUE("merchant_email")
);
--> statement-breakpoint
CREATE TABLE "merchant_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"paid_amount" real NOT NULL,
	"paid_plan" text NOT NULL,
	"invoice_number" text NOT NULL,
	"payment_date" date DEFAULT now() NOT NULL,
	"payment_method" text NOT NULL,
	"valid_till" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchant_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"user_email" text NOT NULL,
	"user_contact" text NOT NULL,
	"user_name" text,
	"password" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login" timestamp with time zone,
	CONSTRAINT "merchant_users_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"receipt_number" text NOT NULL,
	"customer_name" text,
	"customer_contact" text,
	"item_id" uuid NOT NULL,
	"item_code" text NOT NULL,
	"name" text NOT NULL,
	"sku_code" text,
	"hsn_code" text,
	"batch_number" text,
	"sales_quantity" integer NOT NULL,
	"purchase_price" real NOT NULL,
	"selling_price" real NOT NULL,
	"discount_rate" real DEFAULT 0 NOT NULL,
	"gst_rate" real DEFAULT 0 NOT NULL,
	"gst_type" text NOT NULL,
	"paid_amount" real NOT NULL,
	"payment_method" text NOT NULL,
	"note" text,
	"status" text DEFAULT 'Sold' NOT NULL,
	"sells_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "merchant_subscription" ADD CONSTRAINT "merchant_subscription_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "merchant_users" ADD CONSTRAINT "merchant_users_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_merchant_id_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_item_id_inventory_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "categories_merchant_id_idx" ON "categories" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "customer_id_idx" ON "customer" USING btree ("id");--> statement-breakpoint
CREATE INDEX "customer_merchant_id_idx" ON "customer" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "expense_entry_date_idx" ON "expense" USING btree ("entry_date");--> statement-breakpoint
CREATE INDEX "expense_merchant_id_idx" ON "expense" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "inventory_id_idx" ON "inventory" USING btree ("id");--> statement-breakpoint
CREATE INDEX "inventory_merchant_id_idx" ON "inventory" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "inventory_category_id_idx" ON "inventory" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "inventory_code_idx" ON "inventory" USING btree ("code");--> statement-breakpoint
CREATE INDEX "inventory_name_idx" ON "inventory" USING btree ("name");--> statement-breakpoint
CREATE INDEX "merchant_id_idx" ON "merchant" USING btree ("id");--> statement-breakpoint
CREATE INDEX "merchant_subscription_merchant_id_idx" ON "merchant_subscription" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "merchant_users_merchant_id_idx" ON "merchant_users" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "sales_id_idx" ON "sales" USING btree ("id");--> statement-breakpoint
CREATE INDEX "sales_merchant_id_idx" ON "sales" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "sales_receipt_number_idx" ON "sales" USING btree ("receipt_number");--> statement-breakpoint
CREATE INDEX "sales_code_idx" ON "sales" USING btree ("item_code");--> statement-breakpoint
CREATE INDEX "sales_name_idx" ON "sales" USING btree ("name");
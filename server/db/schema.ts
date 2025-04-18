import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  index,
  integer,
  real,
} from "drizzle-orm/pg-core";

export const example = pgTable("example", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default(""),
  contact: text("contact").default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ================= Administrators Table =================
export const administrators = pgTable("administrators", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text().notNull(),
  username: text().unique().notNull(),
  password: text().notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
});

// ================= Merchant Table =================
export const merchant = pgTable(
  "merchant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_name: text().notNull(),
    merchant_email: text().unique().notNull(),
    merchant_address: text(),
    merchant_contact: text(),
    merchant_logo: text(),
    merchant_gstin: text(),
    merchant_license_number: text(),
    merchant_registration_number: text(),
    merchant_prefix: text().notNull(),
    current_plan: text().notNull(),
    valid_till: date().notNull(),
    password: text().notNull(),
    status: text().default("Active").notNull(),
    created_by: text("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
  },
  (table) => [index("merchant_id_idx").on(table.id)]
);

// ================= Merchant Subscription Table =================
export const merchant_subscription = pgTable(
  "merchant_subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    paid_amount: real().notNull(),
    paid_plan: text().notNull(),
    invoice_number: text().notNull(),
    payment_date: date().defaultNow().notNull(),
    payment_method: text().notNull(),
    valid_till: date().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("merchant_subscription_merchant_id_idx").on(table.merchant_id),
  ]
);

// ================= Merchant Users Table =================
export const merchant_users = pgTable(
  "merchant_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    user_email: text().unique().notNull(),
    user_contact: text().notNull(),
    user_name: text(),
    password: text().notNull(),
    role: text(),
    status: text().default("Active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
  },
  (table) => [index("merchant_users_merchant_id_idx").on(table.merchant_id)]
);

// ================= Customer Table =================
export const customer = pgTable(
  "customer",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    customer_name: text(),
    customer_contact: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("customer_id_idx").on(table.id),
    index("customer_merchant_id_idx").on(table.merchant_id),
  ]
);

// ================= Categories Table =================
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("categories_merchant_id_idx").on(table.merchant_id)]
);

// ================= Inventory Table =================
export const inventory = pgTable(
  "inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    category_id: uuid("category_id")
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    code: text().notNull(),
    name: text().notNull(),
    location: text(),
    sku_code: text(),
    hsn_code: text(),
    batch_number: text(),
    stock_quantity: integer().notNull(),
    purchase_price: real().notNull(),
    selling_price: real().notNull(),
    discount_rate: real().default(0).notNull(),
    gst_rate: real().default(0).notNull(),
    gst_type: text().notNull(),
    manufacturing_date: date(),
    expiry_date: date(),
    description: text(),
    status: text().default("Instock").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("inventory_id_idx").on(table.id),
    index("inventory_merchant_id_idx").on(table.merchant_id),
    index("inventory_category_id_idx").on(table.category_id),
    index("inventory_code_idx").on(table.code),
    index("inventory_name_idx").on(table.name),
  ]
);

// ================= Sales Table =================
export const sales = pgTable(
  "sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    receipt_number: text().unique().notNull(),
    customer_name: text(),
    customer_contact: text(),
    item_id: uuid("item_id")
      .references(() => inventory.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    item_code: text().notNull(),
    name: text().notNull(),
    sku_code: text(),
    hsn_code: text(),
    batch_number: text(),
    sales_quantity: integer().notNull(),
    purchase_price: real().notNull(),
    selling_price: real().notNull(),
    discount_rate: real().default(0).notNull(),
    gst_rate: real().default(0).notNull(),
    gst_type: text().notNull(),
    paid_amount: real().notNull(),
    payment_method: text().notNull(),
    note: text(),
    status: text().default("Sold").notNull(),
    sellsAt: timestamp("sells_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sales_id_idx").on(table.id),
    index("sales_merchant_id_idx").on(table.merchant_id),
    index("sales_receipt_number_idx").on(table.receipt_number),
    index("sales_code_idx").on(table.item_code),
    index("sales_name_idx").on(table.name),
  ]
);

// ================= Expense Table =================
export const expense = pgTable(
  "expense",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    merchant_id: uuid("merchant_id")
      .references(() => merchant.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    head: text().notNull(),
    amount: real().default(0).notNull(),
    description: text(),
    entry_date: date().defaultNow().notNull(),
    payment_method: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("expense_entry_date_idx").on(table.entry_date),
    index("expense_merchant_id_idx").on(table.merchant_id),
  ]
);

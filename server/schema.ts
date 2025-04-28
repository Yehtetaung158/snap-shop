import { randomUUID } from "crypto"; // crypto module မှ import
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { desc, or, relations } from "drizzle-orm";
import { title } from "process";

export const RoleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),

  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  role: RoleEnum("role").default("user"),
  customerId: text("customerId"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailVerificationToken = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const resetPasswordToken = pgTable(
  "reset_password_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (token) => ({
    compoundKey: primaryKey({ columns: [token.id, token.token] }),
  })
);

export const products = pgTable("product", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  price: real("price").notNull(),
  createdAt: timestamp("createAt", { mode: "date" }).defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantImages = pgTable("variant_images", {
  id: serial("id").primaryKey(),
  image_url: text("image_url").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  order: real("order").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const variantsTags = pgTable("variants_tags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const productRelations = relations(products, ({ many, one }) => ({
  productVariants: many(productVariants, {
    relationName: "productVariants",
  }),
}));

export const productVariantRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: "productVariants",
    }),
    variantImages: many(variantImages, {
      relationName: "variantImages",
    }),
    variantsTags: many(variantsTags, {
      relationName: "variantsTags",
    }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
    relationName: "variantImages",
  }),
}));

export const variantsTagsRelations = relations(variantsTags, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantsTags.variantId],
    references: [productVariants.id],
    relationName: "variantsTags",
  }),
}));

//order table
export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders, { relationName: "user_orders" }),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
}));

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantID: serial("productVariantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

// for stripe
// customerID: text("customerID"),

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantID],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));

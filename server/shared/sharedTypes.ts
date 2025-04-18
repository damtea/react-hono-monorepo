import { z } from "zod";
import { example, merchant } from "../db/schema";

export const exampleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "required" }),
  contact: z.string().min(1, { message: "required" }),
});

export type TExampleSchema = z.infer<typeof exampleSchema>;
export type TExample = typeof example.$inferSelect;

//authentication

export const loginSchema = z.object({
  loginId: z.string().min(1, { message: "Email is required" }).nonempty(),
  password: z.string().min(1, { message: "" }).nonempty(),
});
export type TLoginSchema = z.infer<typeof loginSchema>;

//merchant

export type TMerchant = typeof merchant.$inferSelect;

export const merchantSchema = z.object({
  id: z.string().uuid().optional(), // Auto-generated UUID
  merchant_name: z.string().min(1, "Merchant name is required"),
  merchant_email: z.string().email("Invalid email address"),
  merchant_address: z.string().nullable().optional(),
  merchant_contact: z.string().nullable().optional(),
  merchant_logo: z.string().nullable().optional(),
  merchant_gstin: z.string().nullable().optional(),
  merchant_license_number: z.string().nullable().optional(),
  merchant_registration_number: z.string().nullable().optional(),
  merchant_prefix: z.string().min(1, "Merchant prefix is required"),
  current_plan: z.string().min(1, "Current plan is required"),
  valid_till: z.coerce
    .date({
      invalid_type_error: "Invalid date format",
    })
    .optional()
    .default(new Date()),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.string().default("Active"),
});

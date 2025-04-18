import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Use Neon’s HTTP connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema,
});
export default db;

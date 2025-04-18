import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";
import { Hono } from "hono";
import db from "../db";
import { merchant } from "../db/schema";
import { getHashed } from "../lib/bcrypt";
import { merchantSchema } from "../shared/sharedTypes";
import { handleDrizzleError } from "../utils/handleError";
const merchantRoute = new Hono();
export default merchantRoute.post(
  "/",
  zValidator("json", merchantSchema.omit({ id: true })),
  async (c) => {
    try {
      const data = c.req.valid("json");

      const hashed = await getHashed(data.password);
      const values = {
        ...data,
        password: hashed,
        created_by: "damtea",
        valid_till: dayjs(data.valid_till).toISOString(),
      };
      await db.insert(merchant).values(values);
      return c.json({ message: "Created" }, 201);
    } catch (error) {
      return handleDrizzleError(error, c);
    }
  }
);

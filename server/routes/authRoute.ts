import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import db from "../db";
import { merchant, merchant_users } from "../db/schema";
import { comparePassword } from "../lib/bcrypt";
import { createSession, deleteSession } from "../lib/session";
import { loginSchema } from "../shared/sharedTypes";
import { handleDrizzleError } from "../utils/handleError";
import { checkAuth } from "../middleware/checkAuth";

const authRoute = new Hono();

export default authRoute
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const { loginId, password: loginPassword } = c.req.valid("json");
      let queryResult;
      let type;
      const merchantResult = await db.query.merchant.findFirst({
        where: and(
          eq(merchant.merchant_email, loginId),
          eq(merchant.status, "Active")
        ),
      });

      if (merchantResult) {
        queryResult = merchantResult;
        type = "merchant";
      } else {
        const userResult = await db.query.merchant_users.findFirst({
          where: and(
            eq(merchant_users.user_email, loginId),
            eq(merchant_users.status, "Active")
          ),
        });
        queryResult = userResult;
        type = "merchant-user";
      }

      if (queryResult) {
        const { id, password } = queryResult;

        const isPasswordMatch = await comparePassword({
          rawData: loginPassword,
          hashedData: password,
        });
        if (!isPasswordMatch) {
          return c.json(
            {
              message: "Incorrect password",
            },
            401
          );
        }
        await createSession({
          c,
          userId: id,
          type: type,
        });

        return c.json({
          message: "Authentication Success",
        });
      }

      return c.json(
        {
          message: "User not found",
        },
        401
      );
    } catch (error) {
      return handleDrizzleError(error, c);
    }
  })
  .get("/", checkAuth, async (c) => {
    const userId = c.get("userId");
    const userType = c.get("userType");

    return c.json({ userId, userType });
  })
  .get("logout", async (c) => {
    await deleteSession(c);
    return c.json({ message: "Logged out" });
  });

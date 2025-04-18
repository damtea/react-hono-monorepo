import type { Context, Next } from "hono";
import { verifySession } from "../lib/session";
type AuthContextVariables = {
  userId: string;
  userType: string;
};
declare module "hono" {
  interface ContextVariableMap extends AuthContextVariables {}
}

export const checkAuth = async (c: Context, next: Next) => {
  try {
    const payload = await verifySession(c);
    if (!payload?.userId) return c.json({ message: "Unauthorized" }, 401);
    c.set("userId", payload.userId);
    c.set("userType", payload.type);
    await next();
  } catch (error) {
    console.error(error);
    return c.json({ message: "Unauthorized" }, 401);
  }
};

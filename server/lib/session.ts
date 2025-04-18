import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

const secretKey = process.env.JWT_SECRET_KEY?.toString() || "";

export const SESSION_NAME = "auth-token";

export type SessionPayload = {
  userId: string;
  type: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return await sign(payload, secretKey, "HS256");
}

export async function decrypt(token: string | undefined = "") {
  try {
    if (token) {
      const payload = await verify(token, secretKey, "HS256");
      return payload as JWTPayload & SessionPayload;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function verifySession(c: Context) {
  const cookie = getCookie(c, SESSION_NAME);

  const payload = await decrypt(cookie);
  return payload;
}

export async function createSession({
  c,
  userId,
  type,
}: {
  userId: string;
  type: string;
  c: Context;
}) {
  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const token = await encrypt({ userId, type, expiresAt });
  setCookie(c, SESSION_NAME, token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession(c: Context) {
  deleteCookie(c, SESSION_NAME);
}

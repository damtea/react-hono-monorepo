// import { example } from "@/db/schema";
import db from "../db";

import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { example } from "../db/schema";
import { exampleSchema } from "../shared/sharedTypes";
import { checkAuth } from "../middleware/checkAuth";

const exampleRoute = new Hono();

export default exampleRoute
  .get("/", checkAuth, async (c) => {
    const data = await db.query.example.findMany();
    return c.json(data);
  })
  .get(
    "/with-query",
    checkAuth,
    zValidator(
      "query",
      z.object({
        id: z.string().uuid(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("query");
      const data = await db.query.example.findFirst({
        where: eq(example.id, id),
      });
      return c.json(data || null);
    }
  )
  .get(
    "/with-pagination",
    checkAuth,
    zValidator(
      "query",
      z.object({
        page: z.string().default("1"),
        pageSize: z.string().default("10"),
      })
    ),
    async (c) => {
      const { page, pageSize } = c.req.valid("query");
      const offset = (Number(page) - 1) * Number(pageSize);
      const data = await db.query.example.findMany({
        offset,
        limit: Number(pageSize) + 1,
        orderBy: desc(example.createdAt),
      });

      return c.json(data);
    }
  )
  .get("/param/:id", checkAuth, async (c) => {
    const id = c.req.param("id");
    const data = await db.query.example.findFirst({
      where: eq(example.id, id),
    });
    return c.json(data || null);
  })
  .post(
    "/",
    checkAuth,
    zValidator("json", exampleSchema.omit({ id: true })),
    async (c) => {
      const data = c.req.valid("json");
      const result = (await db.insert(example).values(data).returning()).at(0);

      return c.json(result, 201);
    }
  )
  .put(
    "/:id",
    checkAuth,
    zValidator("json", exampleSchema.omit({ id: true })),
    async (c) => {
      const data = c.req.valid("json");
      const id = c.req.param("id");
      const result = (
        await db.update(example).set(data).where(eq(example.id, id)).returning()
      ).at(0);

      return c.json(result);
    }
  )
  .get(
    "/delete/:id",
    checkAuth,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      await db.delete(example).where(eq(example.id, id));
      return c.json("ok");
    }
  );

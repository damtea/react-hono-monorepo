import exampleRoute from "@/server/routes/exampleRoute";
import streamRoute from "@/server/routes/stream";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt, type JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import authRoute from "./routes/authRoute";
import merchantRoute from "./routes/merchantRoute";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();
app.use(prettyJSON());
app.use(
  "/auth/*",
  jwt({
    secret: process.env.JWT_SECRET_KEY!,
  })
);
app.use("/api/*", logger());
app.use(cors());

app.use(csrf());
const apiRoutes = app
  .basePath("/api")
  .route("/example", exampleRoute)
  .route("/auth", authRoute)
  .route("/merchant", merchantRoute)
  .route("/stream", streamRoute);

app.use("/favicon.ico", serveStatic({ path: "./frontend/dist/favicon.ico" }));
app.use("*", serveStatic({ root: "./frontend/dist", precompressed: true }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));
export default app;
export type ApiRoutes = typeof apiRoutes;

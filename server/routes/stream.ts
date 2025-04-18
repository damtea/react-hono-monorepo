import { Hono } from "hono";
import { streamText } from "hono/streaming";

const streamRoute = new Hono();

streamRoute.get("/", (c) => {
  return streamText(c, async (stream) => {
    await stream.writeln("Hello");
    await stream.sleep(1000);
    await stream.writeln(`Hono!`);
    await stream.sleep(1000);
    await stream.write(`How are you!`);
  });
});

export default streamRoute;

import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createWriteStream, existsSync } from "node:fs";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const proxyUrl = process.env.PROXY_URL;

const server = Fastify({
  logger: true,
});

server.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "public"),
  prefix: "/public/",
  list: true,
});

async function getClipFromProxy(
  cam: string,
  start: Date,
  duration: number,
): Promise<{ error: string } | { url: string }> {
  const fileName = `${cam}-${start.getUTCFullYear()}-${start.getUTCMonth()}-${start.getUTCDate()}-${start.getUTCHours()}-${start.getUTCMinutes()}-${start.getUTCSeconds()}-${start.getUTCMilliseconds()}-${duration}.mp4`;
  const filePath = path.join(import.meta.dirname, "public", fileName);
  const publicFileUrl = `/public/${fileName}`;
  const exists = existsSync(filePath);

  if (exists) {
    return { url: publicFileUrl };
  }

  if (!proxyUrl) {
    console.error("PROXY_URL not set!");
    return {
      error: "Could not fetch clip",
    };
  }

  const url = new URL(proxyUrl);
  url.pathname = "/get";
  url.searchParams.set("path", cam);
  url.searchParams.set("start", start.toISOString());
  url.searchParams.set("duration", String(duration));

  const res = await fetch(url);

  if (!res.ok) {
    console.log("Could not fetch clip", res.status, res.statusText);
    return {
      error: "Could not fetch clip",
    };
  }

  if (res.body === null) {
    console.log(
      "Could not fetch clip - empty response",
      res.status,
      res.statusText,
    );
    return {
      error: "Could not fetch clip - empty response",
    };
  }

  try {
    await pipeline(Readable.fromWeb(res.body), createWriteStream(filePath));
  } catch (e) {
    console.error("Error saving clip", e);
    return { error: "Error saving clip" };
  }

  return { url: publicFileUrl };
}

server.get("/", (req, reply) => {
  reply.send("Hello 123");
});

server.get<{
  Params: { cam: string };
  Querystring: {
    start?: string;
    duration?: string;
  };
}>("/get-clip/:cam/", async (req, reply) => {
  const { cam } = req.params;
  const { start, duration } = req.query;

  if (!start || !duration) {
    reply.code(400);
    return;
  }

  const startDate = new Date(start);
  const durationNumber = Number.parseInt(duration, 10);

  const res = await getClipFromProxy(cam, startDate, durationNumber);
  if ("error" in res) {
    reply.send(res.error).code(400);
  } else {
    reply.send(res.url).code(200);
  }
});

const start = async () => {
  try {
    await server.listen({
      port,
      host: "0.0.0.0",
    });
    server.log.info(`Server started on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import pino from "pino";
import { jsonrpcRoutes } from "./transport";
import { cardRoutes } from "./card";
import { healthRoutes } from "./status";

export async function buildServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: pino({ level: process.env.LOG_LEVEL || "info" }) as any,
    trustProxy: true,
  });

  await fastify.register(cors, {
    origin: (origin, cb) => {
      const allowed = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim());
      if (!origin || !allowed || allowed.includes("*")) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      cb(new Error("CORS origin not allowed"), false);
    },
    credentials: true,
  });

  await fastify.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX || 60),
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
    ban: 2,
    keyGenerator: (req) => req.headers["x-forwarded-for"]?.toString() || req.ip,
  });

  fastify.addHook("onRequest", async (req, reply) => {
    // Basic security headers; JSON-RPC/SSE specific
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("Referrer-Policy", "no-referrer");
  });

  await fastify.register(healthRoutes);
  await fastify.register(jsonrpcRoutes, { prefix: "/rpc" });
  await fastify.register(cardRoutes, { prefix: "/.well-known" });

  return fastify;
}

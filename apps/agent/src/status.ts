import { FastifyInstance, FastifyPluginCallback } from "fastify";

export const healthRoutes: FastifyPluginCallback = (fastify: FastifyInstance, _opts, done) => {
  fastify.get("/healthz", async (_req, reply) => {
    return reply.code(200).send({ ok: true, service: "agent", ts: new Date().toISOString() });
  });

  fastify.get("/status", async (_req, reply) => {
    // simple uptime/status for ping
    const up = process.uptime();
    return reply.code(200).send({ ok: true, uptimeSec: Math.round(up) });
  });

  done();
};

import { buildServer } from "./server";

const port = Number(process.env.PORT || process.env.AGENT_PORT || 8787);

async function main() {
  const fastify = await buildServer();
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Agent server listening on :${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();

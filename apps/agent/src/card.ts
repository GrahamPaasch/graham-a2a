import { FastifyInstance, FastifyPluginCallback } from "fastify";

function buildPublicCard(publicBase: string, agentBase: string) {
  const skills = [
    {
      id: "job-lead-triage",
      title: "Job‑lead triage & outreach draft",
      description: "Ingest job leads and draft tailored outreach messages",
      inputs: { leadUrl: { type: "string", required: true }, context: { type: "string" } },
      outputs: { draft: { type: "string" } },
    },
    {
      id: "meetup-aggregator",
      title: "Meetup aggregator & calendar export",
      description: "Aggregate meetups and export .ics calendar",
      inputs: { locations: { type: "string" }, topics: { type: "string" } },
      outputs: { icsUrl: { type: "string" } },
    },
    {
      id: "research-brief",
      title: "Research brief generator",
      description: "Generate concise research briefs with sources",
      inputs: { query: { type: "string", required: true } },
      outputs: { brief: { type: "string" } },
    },
    {
      id: "portfolio-helper",
      title: "Portfolio build helper",
      description: "Bootstrap case notes and assets for portfolio entries",
      inputs: { repo: { type: "string" } },
      outputs: { checklist: { type: "string" } },
    },
  ];
  return {
    protocolVersion: "1.0",
    identity: {
      name: "Graham Paasch",
      provider: "grahampaasch.com",
      url: publicBase,
    },
    capabilities: { streaming: true },
    interfaces: { jsonrpc: { endpoint: `${agentBase}/rpc` } },
    skills,
    securitySchemes: {
      openIdConnect: {
        issuer: "https://accounts.example.com",
        authorizationEndpoint: "https://accounts.example.com/authorize",
        tokenEndpoint: "https://accounts.example.com/token",
        scopes: ["openid", "profile", "email"],
      },
    },
  };
}

export const cardRoutes: FastifyPluginCallback = (fastify: FastifyInstance, _opts, done) => {
  fastify.get("/agent-card.json", async (_req, reply) => {
    const base = buildPublicCard(
      process.env.PUBLIC_BASE_URL || "http://localhost:3000",
      process.env.AGENT_BASE_URL || `http://localhost:${process.env.AGENT_PORT || 8787}`
    );
    return reply.send(base);
  });

  fastify.get("/agent-card.auth.json", async (req, reply) => {
    const auth = req.headers.authorization || "";
    const isAuthed = auth.startsWith("Bearer ") && auth.slice(7).length > 0;
    if (!isAuthed) return reply.code(401).send({ error: "Unauthorized" });
    const base = buildPublicCard(
      process.env.PUBLIC_BASE_URL || "http://localhost:3000",
      process.env.AGENT_BASE_URL || `http://localhost:${process.env.AGENT_PORT || 8787}`
    );
    return reply.send({
      ...base,
      capabilities: { ...base.capabilities, pushNotifications: false },
    });
  });

  done();
};

export default cardRoutes;
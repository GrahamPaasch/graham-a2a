import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  messageSendParamsSchema,
  tasksGetParamsSchema,
  tasksCancelParamsSchema,
  jsonrpcRequestSchema,
  taskStatusSchema,
} from "@graham/shared";

// In-memory task store for demo purposes; replace with a durable store in production
const tasks = new Map<string, { events: any[]; canceled?: boolean }>();

function jsonrpcSuccess(id: any, result: any) {
  return { jsonrpc: "2.0", id, result };
}

function jsonrpcError(id: any, code: number, message: string, data?: unknown) {
  return { jsonrpc: "2.0", id, error: { code, message, data } };
}

async function simulateStreaming(taskId: string, text: string) {
  // Emit a few mock artifacts then complete
  const record = tasks.get(taskId);
  if (!record) return;
  const now = new Date();
  record.events.push({ state: "running", taskId, startedAt: now.toISOString() });

  const chunks = [
    "Analyzing context",
    "Drafting outreach",
    "Polishing tone",
  ];
  for (let i = 0; i < chunks.length; i++) {
    if (record.canceled) return;
    await new Promise((r) => setTimeout(r, 200));
    record.events.push({
      state: "artifact",
      taskId,
      kind: "text",
      contentType: "text/plain",
      data: `${chunks[i]}: ${text}`,
      index: i,
    });
  }
  if (record.canceled) return;
  record.events.push({ state: "completed", taskId, completedAt: new Date().toISOString() });
}

export const jsonrpcRoutes: FastifyPluginCallback = (fastify: FastifyInstance, _opts, done) => {
  // JSON-RPC 2.0 endpoint
  fastify.post("/", async (req, reply) => {
    const parsed = jsonrpcRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send(jsonrpcError(null, -32600, "Invalid Request", parsed.error.flatten()))
    }
    const { id, method, params } = parsed.data as any;

    try {
      switch (method) {
        case "message/send": {
          const vv = messageSendParamsSchema.safeParse(params);
          if (!vv.success) return reply.send(jsonrpcError(id, -32602, "Invalid params", vv.error.flatten()));
          const { recipient, text, stream = true } = vv.data;
          const taskId = randomUUID();
          const queuedAt = new Date().toISOString();
          tasks.set(taskId, { events: [{ state: "queued", taskId, queuedAt }] });
          // Kick off async streaming
          if (stream) simulateStreaming(taskId, text).catch((e) => fastify.log.error(e));
          return reply.send(jsonrpcSuccess(id, { taskId, queuedAt }));
        }
        case "tasks/get": {
          const vv = tasksGetParamsSchema.safeParse(params);
          if (!vv.success) return reply.send(jsonrpcError(id, -32602, "Invalid params", vv.error.flatten()));
          const { taskId } = vv.data;
          const rec = tasks.get(taskId);
          if (!rec) return reply.send(jsonrpcError(id, 404, "Task not found"));
          return reply.send(jsonrpcSuccess(id, { events: rec.events }));
        }
        case "tasks/cancel": {
          const vv = tasksCancelParamsSchema.safeParse(params);
          if (!vv.success) return reply.send(jsonrpcError(id, -32602, "Invalid params", vv.error.flatten()));
          const { taskId } = vv.data;
          const rec = tasks.get(taskId);
          if (!rec) return reply.send(jsonrpcError(id, 404, "Task not found"));
          rec.canceled = true;
          rec.events.push({ state: "canceled", taskId, canceledAt: new Date().toISOString() });
          return reply.send(jsonrpcSuccess(id, { ok: true }));
        }
        case "agent/getAuthenticatedExtendedCard": {
          // For demo: return same as public but add auth-only fields if a Bearer token is present
          const auth = req.headers.authorization || "";
          const isAuthed = auth.startsWith("Bearer ") && auth.slice(7).length > 0;
          if (!isAuthed) return reply.send(jsonrpcError(id, 401, "Unauthorized"));
          const base = buildPublicCard(process.env.PUBLIC_BASE_URL || "http://localhost:3000", process.env.AGENT_BASE_URL || `http://localhost:${process.env.AGENT_PORT || 8787}`);
          return reply.send(jsonrpcSuccess(id, {
            ...base,
            capabilities: { ...base.capabilities, pushNotifications: false },
            securitySchemes: {
              openIdConnect: {
                issuer: "https://accounts.example.com",
                authorizationEndpoint: "https://accounts.example.com/authorize",
                tokenEndpoint: "https://accounts.example.com/token",
                scopes: ["openid", "profile", "email"],
              },
            },
          }));
        }
        default:
          return reply.send(jsonrpcError(id, -32601, "Method not found"));
      }
    } catch (err: any) {
      fastify.log.error({ err }, "rpc_error");
      return reply.send(jsonrpcError(id, -32603, "Internal error"));
    }
  });

  // SSE stream of task events: /rpc/stream?taskId=...
  fastify.get("/stream", async (req, reply) => {
    const taskId = (req.query as any)?.taskId as string | undefined;
    if (!taskId) {
      return reply.code(400).send({ error: "taskId required" });
    }
    const rec = tasks.get(taskId);
    if (!rec) return reply.code(404).send({ error: "Task not found" });

    reply
      .header("Content-Type", "text/event-stream")
      .header("Cache-Control", "no-cache, no-transform")
      .header("Connection", "keep-alive");

    // Helper to send one SSE event
    const sendEvent = (obj: unknown) => {
      const parsed = taskStatusSchema.safeParse(obj);
      if (!parsed.success) return; // skip invalid
      reply.raw.write(`event: message\n`);
      reply.raw.write(`data: ${JSON.stringify(parsed.data)}\n\n`);
    };

    // send existing events first
    for (const ev of rec.events) sendEvent(ev);

    // naive poller — in prod, use an event emitter/queue
    let idx = rec.events.length;
    const interval = setInterval(() => {
      const r = tasks.get(taskId);
      if (!r) return;
      while (idx < r.events.length) {
        sendEvent(r.events[idx++]);
      }
      const last = r.events[r.events.length - 1];
      if (last?.state === "completed" || last?.state === "failed" || last?.state === "canceled") {
        clearInterval(interval);
        reply.raw.end();
      }
    }, 200);

    req.raw.on("close", () => {
      clearInterval(interval);
    });

    return reply.hijack(); // keep connection open
  });

  // Alias path to match spec wording: /rpc/message/stream
  fastify.get("/message/stream", async (req, reply) => {
    (req as any).query = (req as any).query || (req as any).requestContext?.queryStringParameters;
    return fastify.inject({
      method: 'GET',
      url: `/rpc/stream?taskId=${(req.query as any)?.taskId ?? ''}`,
    }).then((res) => {
      reply.raw.writeHead(res.statusCode, res.headers as any);
      reply.raw.write(res.body);
      reply.raw.end();
      return reply.hijack();
    });
  });

  done();
};

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
  };
}

export type { };

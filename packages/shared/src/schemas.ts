import { z } from "zod";

export const jsonrpcBase = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number(), z.null()]).optional(),
});

export const messageSendParamsSchema = z.object({
  recipient: z.string().min(1),
  text: z.string().min(1),
  stream: z.boolean().default(true),
});
export type MessageSendParams = z.infer<typeof messageSendParamsSchema>;

export const tasksGetParamsSchema = z.object({ taskId: z.string().min(1) });
export type TasksGetParams = z.infer<typeof tasksGetParamsSchema>;

export const tasksCancelParamsSchema = z.object({ taskId: z.string().min(1) });
export type TasksCancelParams = z.infer<typeof tasksCancelParamsSchema>;

export const getAuthenticatedExtendedCardParamsSchema = z.object({});

export const jsonrpcRequestSchema = jsonrpcBase.extend({
  method: z.string(),
  params: z.unknown().optional(),
});

export const taskStatusSchema = z.discriminatedUnion("state", [
  z.object({ state: z.literal("queued"), taskId: z.string(), queuedAt: z.string() }),
  z.object({ state: z.literal("running"), taskId: z.string(), startedAt: z.string() }),
  z.object({ state: z.literal("artifact"), taskId: z.string(), kind: z.string(), contentType: z.string(), data: z.unknown(), index: z.number() }),
  z.object({ state: z.literal("completed"), taskId: z.string(), completedAt: z.string() }),
  z.object({ state: z.literal("canceled"), taskId: z.string(), canceledAt: z.string() }),
  z.object({ state: z.literal("failed"), taskId: z.string(), failedAt: z.string(), error: z.string() })
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const skillSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  inputs: z.record(z.object({ type: z.string(), description: z.string().optional(), required: z.boolean().optional() })),
  outputs: z.record(z.object({ type: z.string(), description: z.string().optional() })),
});

export const agentCardSchema = z.object({
  protocolVersion: z.string(),
  identity: z.object({ name: z.string(), provider: z.string(), url: z.string().url() }),
  capabilities: z.object({ streaming: z.boolean(), pushNotifications: z.boolean().optional() }),
  interfaces: z.object({ jsonrpc: z.object({ endpoint: z.string().url() }) }),
  skills: z.array(skillSchema),
  securitySchemes: z
    .object({
      openIdConnect: z
        .object({
          issuer: z.string().url(),
          authorizationEndpoint: z.string().url(),
          tokenEndpoint: z.string().url(),
          scopes: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});
export type AgentCard = z.infer<typeof agentCardSchema>;

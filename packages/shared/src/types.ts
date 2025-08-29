export type JSONRPCRequest<T = unknown> = {
  jsonrpc: "2.0";
  id: string | number | null;
  method: string;
  params?: T;
};

export type JSONRPCSuccess<T = unknown> = {
  jsonrpc: "2.0";
  id: string | number | null;
  result: T;
};

export type JSONRPCError = {
  jsonrpc: "2.0";
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

export type JSONRPCResponse<T = unknown> = JSONRPCSuccess<T> | JSONRPCError;

export type TaskStatus =
  | { state: "queued"; taskId: string; queuedAt: string }
  | { state: "running"; taskId: string; startedAt: string }
  | { state: "artifact"; taskId: string; kind: string; contentType: string; data: unknown; index: number }
  | { state: "completed"; taskId: string; completedAt: string }
  | { state: "canceled"; taskId: string; canceledAt: string }
  | { state: "failed"; taskId: string; failedAt: string; error: string };

export type Skill = {
  id: string;
  title: string;
  description: string;
  inputs: Record<string, { type: string; description?: string; required?: boolean }>;
  outputs: Record<string, { type: string; description?: string }>;
};

export type AgentCard = {
  protocolVersion: string;
  identity: {
    name: string;
    provider: string;
    url: string;
  };
  capabilities: {
    streaming: boolean;
    pushNotifications?: boolean;
  };
  interfaces: {
    jsonrpc: {
      endpoint: string;
    };
  };
  skills: Skill[];
  securitySchemes?: {
    openIdConnect?: {
      issuer: string;
      authorizationEndpoint: string;
      tokenEndpoint: string;
      scopes?: string[];
    };
  };
};

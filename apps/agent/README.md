# @graham/agent

JSON-RPC 2.0 over HTTPS with SSE streaming.

Endpoints:
- POST /rpc — methods: message/send, tasks/get, tasks/cancel, agent/getAuthenticatedExtendedCard
- GET /rpc/stream?taskId=... — SSE events of TaskStatus
- GET /healthz — health
- GET /status — uptime


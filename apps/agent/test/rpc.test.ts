import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { buildServer } from '../src/server';

let app: Awaited<ReturnType<typeof buildServer>>;

describe('A2A JSON-RPC', () => {
  beforeAll(async () => {
    app = await buildServer();
  });
  afterAll(async () => {
    await app.close();
  });

  it('message/send -> tasks/get lifecycle', async () => {
    const sendRes = await request(app.server)
      .post('/rpc')
      .send({ jsonrpc: '2.0', id: 1, method: 'message/send', params: { recipient: 'demo', text: 'Hello', stream: true } })
      .expect(200);
    expect(sendRes.body.result.taskId).toBeDefined();

    const taskId = sendRes.body.result.taskId as string;

    const getRes = await request(app.server)
      .post('/rpc')
      .send({ jsonrpc: '2.0', id: 2, method: 'tasks/get', params: { taskId } })
      .expect(200);

    expect(Array.isArray(getRes.body.result.events)).toBe(true);
  });
});

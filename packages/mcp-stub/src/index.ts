#!/usr/bin/env node
// Minimal JSON-RPC over stdio MCP-like stub with one resource and one tool

import readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function respond(id: any, result: any) {
  const res = JSON.stringify({ jsonrpc: '2.0', id, result });
  process.stdout.write(res + '\n');
}

function error(id: any, code: number, message: string) {
  const res = JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } });
  process.stdout.write(res + '\n');
}

rl.on('line', (line) => {
  try {
    const msg = JSON.parse(line);
    const { id, method, params } = msg;
    if (method === 'resources/list') {
      return respond(id, [{ uri: 'mcp://about', name: 'About', description: 'About Graham Paasch' }]);
    }
    if (method === 'tools/list') {
      return respond(id, [{ name: 'echo', description: 'Echo text', inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } }]);
    }
    if (method === 'tools/call' && params?.name === 'echo') {
      return respond(id, { content: params?.arguments?.text ?? '' });
    }
    return error(id, -32601, 'Method not found');
  } catch (e) {
    error(null, -32700, 'Parse error');
  }
});

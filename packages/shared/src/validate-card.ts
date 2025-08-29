#!/usr/bin/env node
import { agentCardSchema } from './schemas';

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  const input = Buffer.concat(chunks).toString('utf8');
  const data = JSON.parse(input);
  const parsed = agentCardSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid card:', parsed.error.flatten());
    process.exit(1);
  }
  console.log('Valid card for', parsed.data.identity.name);
}

main().catch((e) => { console.error(e); process.exit(1); });

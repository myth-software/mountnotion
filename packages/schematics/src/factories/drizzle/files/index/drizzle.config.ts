import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle.schema.ts',
  out: './migrations',
} satisfies Config;

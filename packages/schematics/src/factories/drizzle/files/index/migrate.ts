import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';

const connectionString = process.env['CONNECTION_STRING']!;
const sql = postgres(connectionString, { max: 1, ssl: true });
const db = drizzle(sql);

async function run() {
  const outDir = process.argv[2];

  await migrate(db, { migrationsFolder: `${outDir}/../drizzle` });
  return 0;
}

run()
  .then((exitCode) => {
    process.exitCode = exitCode;
    process.exit();
  })
  .catch((e) => {
    throw e;
  });

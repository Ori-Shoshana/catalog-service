import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  server: {
    port: Number(process.env.PORT ?? 3000),
  },
  db: {
    databaseUrl: requireEnv('DATABASE_URL'),
  },
};

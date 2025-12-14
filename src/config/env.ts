import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: Number(process.env.PORT ?? 3000),
  },
  db: {
    connectionString: process.env.DATABASE_URL ?? 'postgres://postgres@localhost:5432/products_db',
  },
}; 
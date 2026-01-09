import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  dbFile: 'database.sqlite',
  origin: process.env['origin'] || '*',
  port: process.env['port'] ? Number( process.env['port']) : 3000
};

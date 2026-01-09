import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  origin: process.env['origin'] || '*',
  port: process.env['port'] ? Number( process.env['port']) : 3000,
  dbURL: process.env['dbURL']
};

import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env['origin']);

export const config = {
  dbFile: 'database.sqlite',
  origin: process.env['origin'] || 'http://localhost:5173'
};

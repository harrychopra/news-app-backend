const { Pool } = require('pg');
const dotenv = require('dotenv');

process.env.NODE_ENV ||= 'development';
const envFilePath = `${__dirname}/../.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFilePath });

if (!process.env.PGDATABASE) {
  throw new Error('No PGDATABASE configured');
}
const db = new Pool();

module.exports = db;

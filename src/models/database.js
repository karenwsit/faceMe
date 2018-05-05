const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/karensit';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE fbi_wanted(id SERIAL PRIMARY KEY, uuid VARCHAR(100) UNIQUE NOT NULL, subject VARCHAR[], url VARCHAR(100), images JSON)');
query.on('end', () => { client.end(); });

var pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/karensit'

const client = new pg.Client(connectionString)

const buildTable = async () => {
  await client.connect()
  await client.query(
    'CREATE TABLE fbi_wanted(id SERIAL PRIMARY KEY, uid VARCHAR(100) UNIQUE NOT NULL, subject VARCHAR[], url VARCHAR(100), images JSON)')
  await client.end()
}

buildTable()

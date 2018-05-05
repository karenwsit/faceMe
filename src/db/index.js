import pg from 'pg'

const { Pool } = pg

const pool = new Pool()

module.exports = {
  query: (text, params, callback) => {
    // queries to the db now logging
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('Executed Query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  }
}

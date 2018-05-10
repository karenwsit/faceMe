// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('./env')
require('babel-register')({
    presets: [ 'env' ]
})
require("babel-core/register")
require("babel-polyfill")
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ silent: true })
  console.log('process env node env:', process.env)
}



// Import the rest of our application.
module.exports = require('./server.js')

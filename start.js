// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})
require('dotenv').config()

console.log('LULZ SECRETS:', process.env.API_SECRET)

// Import the rest of our application.
module.exports = require('./server.js')

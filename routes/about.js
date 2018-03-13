var express = require('express')

var router = express.Router()

router.get('/', (req, res) => {
  res.send('this is the about page!')
})

module.exports = router

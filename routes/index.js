import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('this is the home page fool!')
})

module.exports = router

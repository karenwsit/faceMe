import express from 'express'

var router = express.Router()

router.get('/', (req, res) => {
  res.send('this is the about page!')
})

router.post('/', (req, res) => {
  res.send('hitting the posty post')
})

module.exports = router

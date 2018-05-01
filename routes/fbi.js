import express from 'express'
import request from 'request-promise'

var router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const fbiImages = request({
      uri: 'https://api.fbi.gov/wanted/v1/list'
    })
    res.json(fbiImages)
  } catch (e) {
    next(e)
  }
})

module.exports = router

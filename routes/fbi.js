import express from 'express'
import request from 'request-promise'

var router = express.Router()

router.get('/', (req, res) => {
  return request({
    uri: 'https://api.fbi.gov/wanted/v1/list'
  })
  .then(res => {
    console.log('RESPONSE:', res)
  })
  .catch(err => {
    console.log('ERR:', err)
  })
})

module.exports = router

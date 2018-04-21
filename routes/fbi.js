import express from 'express'
import request from 'require'

var router = express.Router()

router.get('/', (req, res) => {
  request({
    uri: 'https://api.fbi.gov/wanted/v1/list'
  })
  .then(body => {
    console.log('BODAY:', body)
  })
  .catch(err => {
    console.log('ERR:', err)
  })
})

module.exports = router

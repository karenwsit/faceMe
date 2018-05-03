import express from 'express'
import request from 'request-promise'

var router = express.Router()

let allItems = []
let subjects = {}
let page = 1

const getSubjects = (item) => {
  if (item.subjects) {
    item.subjects.forEach((subject) => {
      if (!subjects[subject]) {
        subjects[subject] = 1
      } else {
        subjects[subject] += 1
      }
    })
  }
}

router.get('/', (req, res, next) => {
  return request({
    uri: 'https://api.fbi.gov/wanted/v1/list',
    qs: {
      page
    }
  })
  .then(res => {
    const fbiImages = JSON.parse(res)
    const total = fbiImages.total
    const itemsLen = fbiImages.items.length
    const numberOfCalls = Math.round(total/itemsLen)
    while (page < numberOfCalls) {
      page++
    }
    console.log('fbiImages.total', fbiImages.total)
    console.log('fbiImages.page', fbiImages.page)
    console.log('LEN:', fbiImages.items.length)
    return { fbiImages: fbiImages.items,  }
  })
  .then(fb => {
    fbiImages.forEach(getSubjects)
  })
  .catch(e =>
    next(e)
  )
})

module.exports = router

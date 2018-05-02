import express from 'express'
import request from 'request-promise'

var router = express.Router()




router.get('/', async (req, res, next) => {
  try {
    const response = await request({
      uri: 'https://api.fbi.gov/wanted/v1/list',
      qs: {
        page: 37
      }
    })
    const fbiImages = JSON.parse(response)
    console.log('fbiImages.page', fbiImages.page)
    console.log('LEN:', fbiImages.items.length)
    let subjects = {}
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
    fbiImages.items.forEach(getSubjects)
    console.log('SUBJECTS:', subjects)
    res.send(fbiImages)
  } catch (e) {
    next(e)
  }
})

module.exports = router

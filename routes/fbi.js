import express from 'express'
import request from 'request-promise'

var router = express.Router()

let subjects = {}
const fbiURL = 'https://api.fbi.gov/wanted/v1/list'

const getWantedList = async (page, totalItems) => {
  if (totalItems && page < total/20) {
    return []
  }
  let { items, total } = await request({
    uri: fbiURL,
    qs: { page }
  })
  return getWantedList.concat(getWantedList(page+1, total))
}

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
  return getWantedList()
  //   uri: fbiURL,
  //   qs: {
  //     page
  //   }
  // })
  .then(res => {
    const fbiImages = JSON.parse(res)
    console.log('fbiImages!!!!:', fbiImages)
  //   const total = fbiImages.total
  //   const itemsLen = fbiImages.items.length
  //   const numberOfCalls = Math.round(total/itemsLen)
  //   while (page < numberOfCalls) {
  //     page++
  //   }
  //   console.log('fbiImages.total', fbiImages.total)
  //   console.log('fbiImages.page', fbiImages.page)
  //   console.log('LEN:', fbiImages.items.length)
  //   return { fbiImages: fbiImages.items }
  // })
  // .then(fb => {
  //   const { fbiImages } = fb
  //   fbiImages.forEach(getSubjects)
  //   console.log('SUBJECTS:', subjects)
  })
  .catch(e =>
    console.log('ERROR:', e)
  )
})

module.exports = router

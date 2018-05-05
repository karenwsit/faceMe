import express from 'express'
import request from 'request-promise'
import fs from 'fs'

var router = express.Router()

let subjects = {}
const fbiURL = 'https://api.fbi.gov/wanted/v1/list'

const getWantedList = async (page=1, totalItems) => {
  if (totalItems && page > Math.round(totalItems/20)) {
    return []
  }
  let response  = await request({
    uri: fbiURL,
    qs: { page }
  })
  const { items, total } = JSON.parse(response)
  console.log('total:', total)
  console.log('page:', page)
  fs.writeFileSync('items.json', JSON.stringify(items))
  return items.concat(getWantedList(page+1, total))
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

router.get('/', async (req, res, next) => {
  try {
    const response = await getWantedList()
    console.log('fbiImages!!!!:', response.length)
  } catch (e) {
    console.log('ERROR:', e)
  }


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
  // })
  // .catch(e =>
  //   console.log('ERROR:', e)
  // )
})

module.exports = router

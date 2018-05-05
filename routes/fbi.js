import express from 'express'
import request from 'request-promise'
// import fs from 'fs'
import db from '../src/db'

var router = express.Router()

let subjects = {}
const fbiURL = 'https://api.fbi.gov/wanted/v1/list'

const getWantedList = async (page=1, totalItems, wantedPeople=[]) => {
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
  return items.concat( await getWantedList(page+1, total, [...items, ...wantedPeople]))
}

router.get('/', async (req, res, next) => {
  // TODO: handle promise rejection
  try {
    const response = await getWantedList()
    response.forEach((item) => {
      db.query('INSERT INTO fbi_wanted(uid, subject, url, images) values ($1,$2,$3,$4)', [
        item.uid,
        item.subjects,
        item.url,
        JSON.stringify(item.images)
      ])
    })
  } catch (e) {
    console.log('ERROR:', e)
  }

})

module.exports = router

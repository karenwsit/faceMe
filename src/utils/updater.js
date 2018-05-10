var request = require('request-promise')
var db = require('../db')

const fbiURL = 'https://api.fbi.gov/wanted/v1/list'
let res

const getWantedList = async (page=1, totalItems, wantedPeople=[]) => {
  if (totalItems && page > Math.round(totalItems/20)) {
    return []
  }

  try {
    res  = await request({
      uri: fbiURL,
      qs: { page }
    })
  } catch (err) {
    console.log(err)
  }

  const { items, total } = JSON.parse(res)
  console.log('total:', total)
  console.log('page:', page)
  return items.concat( await getWantedList(page+1, total, [...items, ...wantedPeople]))
}

const updater = async () => {
  try {
    const response = await getWantedList()
    response.forEach((item) => {
      db.query('INSERT INTO fbi_wanted(uid, subject, url, images) values ($1,$2,$3,$4)', [
        item.uid,
        item.subjects,
        item.url,
        JSON.stringify(item.images)
      ], (err, result) => {
        if (err) {
          console.log(err)
        }
      })
    })
  } catch (e) {
    console.log('ERROR:', e)
  }
}

updater()

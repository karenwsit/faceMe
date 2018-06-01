var dotenv = require('dotenv')
dotenv.config()
var request = require('request-promise')
var db = require('../db')
var RateLimiter = require('limiter').RateLimiter
var limiter = new RateLimiter(1, 'second')
var fs = require('fs')

const faceKey = process.env.FACEME_API_KEY
const faceSecret = process.env.FACEME_API_SECRET
const faceSetToken = process.env.FACE_SET_TOKEN
const addFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface'
const createFaceSetURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/create'
const detectFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/detect'
const getDetailFaceSetURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/getdetail'
const removeFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/removeface'
const testImage = 'https://s3-us-west-1.amazonaws.com/uploadedphotostomatch/06ceb71a-d42f-47c7-9b89-2a8eca2b0cd6.JPG'
const searchFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/search'
const setUserIdURL = 'https://api-us.faceplusplus.com/facepp/v3/face/setuserid'
const getFaceDetailURL = 'https://api-us.faceplusplus.com/facepp/v3/face/getdetail'

const createFaceSetToken = async () => {
  let options = {
    method: 'POST',
    uri: createFaceSetURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret
    },
    json: true
  }
  try {
    let response = await request(options)
    const { faceset_token } = response
    return faceset_token
  } catch (e) {
    console.error('create FaceSet error:', e)
  }
}

const getDetailFaceSet = async () => {
  let options = {
    method: 'POST',
    uri: getDetailFaceSetURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      faceset_token: faceSetToken
    }
  }
  try {
    limiter.removeTokens(1, async (err, remainingRequests) => {
      let response = await request(options)
      console.log('faceset details:', response)
    })
  } catch (e) {
    console.error('get Detail FaceSet error:', e)
  }
}

const removeAllFaces = async () => {
  let options = {
    method: 'POST',
    uri: removeFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      faceset_token: faceSetToken,
      face_tokens: "RemoveAllFaceTokens"
    }
  }
  try {
    limiter.removeTokens(1, async (err, remainingRequests) => {
      let response = await request(options)
      console.log('removed all face tokens:', response)
    })
  } catch (e) {
    console.error('get Detail FaceSet error:', e)
  }
}

const addFace = async (faceToken) => {
  let options = {
    method: 'POST',
    uri: addFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      faceset_token: faceSetToken,
      face_tokens: faceToken
    },
    json: true
  }
  try {
    limiter.removeTokens(1, async (err, remainingRequests) => {
      let response = await request(options)
      console.log('addedFace res:', response)
    })
  } catch (e) {
    console.error('detect FaceSet error:', e)
  }
}

const detectFace = async (image_url) => {
  let options = {
    method: 'POST',
    uri: detectFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      image_url
    },
    json: true
  }
  try {
    let response = await request(options)
    const { faces, image_id } = response

    //TODO: Need to store image_id in the database for when cron job runs. Identify which images are removed and which are newly added to decrease latency. Only update face_set with new images and delete face_set old images

    //TODO: Batch face_tokens in arrays of 5 since there is only 1 QPS rate limit
    console.log('face_token:', faces[0].face_token)
    return faces[0].face_token
  } catch (e) {
    console.error('detect Face error:', e)
  }
}

const setUserId = async (user_id, face_token) => {
  console.log('setting UserID user_id:', user_id)
  console.log('setting UserID face_token:', face_token)
  let options = {
    method: 'POST',
    uri: setUserIdURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      face_token,
      user_id
    },
    json: true
  }
  try {
    let response = await request(options)
    console.log('set userId response:', response)
    return
  } catch (e) {
    console.error('detect Face error:', e)
  }
}

const QUERY_IMAGES =
`SELECT
    uid,
    url,
    array_agg(each_attribute ->> 'original') images
  FROM fbi_wanted
  CROSS JOIN json_array_elements(images) each_attribute
  WHERE (each_attribute -> 'original') is NOT NULL
  GROUP BY uid, url
  LIMIT 5
`

const queryImages = async () => {
  await db.query(QUERY_IMAGES, (err, result) => {
    if (err) {
      console.log(err)
    }
    const { rows } = result
    rows.forEach((person) => {
      const { uid, images } = person
      images.forEach((image_url) => {
        limiter.removeTokens(1, async (err, remainingRequests) => {
          let face_token = await detectFace(image_url)
          await setUserId(uid, face_token)
          await addFace(face_token)
        })
      })
    })
  })
}

const QUERY_MATCHES =
`SELECT
    uid,
    url
  FROM fbi_wanted
  WHERE uid IN ($1, $2, $3, $4, $5)
`

const combineResults = (faceResults, dbResults) => {
  return faceResults.map((item) => {
    const haveSameId = (person) => person.uid === item.user_id
    const dbResultsHaveSameId = dbResults.find(haveSameId)
    return Object.assign({}, item, dbResultsHaveSameId)
  })
}

const searchFace = async (face_token) => {
  let options = {
    method: 'POST',
    uri: searchFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      face_token,
      faceset_token: faceSetToken,
      return_result_count: 5
    }
  }
  try {
    let response = await request(options)
    const searchRes = JSON.parse(response)
    const { results } = searchRes
    let userIDs = []
    results.forEach((result) => {
      const { user_id } = result
      userIDs.push(user_id)
    })
    db.query(QUERY_MATCHES, userIDs, (err, result) => {
      if (err) {
        console.log(err)
      }
      dbResults = result.rows
      const finalResults = combineResults(results, dbResults)
      console.log('finalResults:', finalResults)
      return finalResults
    })
  } catch (e) {
    console.error('search Face error:', e)
  }
}

const getFaceDetail = async (face_token) => {
  let options = {
    method: 'POST',
    uri: getFaceDetailURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      face_token
    }
  }
  try {
    let response = await request(options)
    console.log('face detail:', response)
  } catch (e) {
    console.error('get face detail error:', e)
  }

}

// queryImages()
// getDetailFaceSet()
// removeAllFaces()
// detectFace()
// setUserId()
// searchFace()
// getFaceDetail()

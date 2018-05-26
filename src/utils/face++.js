var dotenv = require('dotenv')
dotenv.config()
var request = require('request-promise')
var db = require('../db')
var RateLimiter = require('limiter').RateLimiter
var limiter = new RateLimiter(1, 'second')

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
    console.log('create FaceSet error:', e)
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
    console.log('get Detail FaceSet error:', e)
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
    console.log('get Detail FaceSet error:', e)
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
    console.log('detect FaceSet error:', e)
  }
}

// const queueFaceTokens = (faceToken) => {
//   faceToken.concat
// }

const detectFace = async (image_url) => {
  let options = {
    method: 'POST',
    uri: detectFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      image_url: 'http://turitmo.com/wp-content/uploads/2017/11/5NfENkYA.jpg'
    },
    json: true
  }
  try {
    let response = await request(options)
    const { faces, image_id } = response

    //TODO: Need to store image_id in the database for when cron job runs. Identify which images are removed and which are newly added to decrease latency. Only update face_set with new images and delete face_set old images

    //TODO: Batch face_tokens in arrays of 5 since there is only 1QPS rate limit
    console.log('face_token:', faces[0].face_token)
    return faces[0].face_token
  } catch (e) {
    console.log('detect Face error:', e)
  }
}

const setUserId = async (user_id, face_token) => {
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
    console.log('detect Face error:', e)
  }
}

const QUERY =
`SELECT
    uid,
    url,
    array_agg(each_attribute ->> 'original') images
  FROM fbi_wanted
  CROSS JOIN json_array_elements(images) each_attribute
  WHERE (each_attribute -> 'original') is NOT NULL
  GROUP BY uid, url
  LIMIT 10
`

const queryImages = async () => {
  await db.query(QUERY, (err, result) => {
    if (err) {
      console.log(err)
    }
    const { rows } = result
    console.log('ROWS:', rows)
    console.log('rows:', rows.length) // 710
    rows.forEach((person) => {
      console.log('person:', JSON.stringify(person))
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
    let confidenceScores = []
    results.forEach((result) => {
      const { confidence, user_id, face_token } = result
      confidenceScores.push(confidence)
    })

    return results
  } catch (e) {
    console.log('search Face error:', e)
  }
}

// queryImages()
// getDetailFaceSet()
// removeAllFaces()
// detectFace()
searchFace('7a94abcd44649cde880604ebf71b21f0')

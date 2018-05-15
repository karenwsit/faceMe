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
    let response = await request(options)
    console.log('faceset details:', response)
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
    let response = await request(options)
    console.log('removed all face tokens:', response)
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
    let response = await request(options)
    console.log('addedFace res:', response)

  } catch (e) {
    console.log('detect FaceSet error:', e)
  }
}

const testImage = 'https://s3-us-west-1.amazonaws.com/uploadedphotostomatch/06ceb71a-d42f-47c7-9b89-2a8eca2b0cd6.JPG'

const queueFaceTokens = (faceToken) => {
  faceToken.concat
}

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

    const face_token = faces[0].face_token

    limiter.removeTokens(1, (err, remainingRequests) => {
      addFace(face_token)
    })
  } catch (e) {
    console.log('detect Face error:', e)
  }
}

const QUERY =
`SELECT
    url,
    array_agg(each_attribute ->> 'original') images
  FROM fbi_wanted
  CROSS JOIN json_array_elements(images) each_attribute
  WHERE (each_attribute -> 'original') is NOT NULL
  GROUP BY url
  LIMIT 2;
`

const queryImages = async () => {
  await db.query(QUERY, (err, result) => {
    if (err) {
      console.log(err)
    }
    const { rows } = result
    rows.forEach((person) => {
      person.images.forEach((image_url) => {
        limiter.removeTokens(1, (err, remainingRequests) => {
          detectFace(image_url)
        })
      })
    })
  })
}

// queryImages()
// getDetailFaceSet()
// removeAllFaces()

var dotenv = require('dotenv')
dotenv.config()
var request = require('request-promise')
var db = require('../db')

const faceKey = process.env.FACEME_API_KEY
const faceSecret = process.env.FACEME_API_SECRET
const faceSetToken = process.env.FACE_SET_TOKEN

const createFaceSetURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/create'
const detectFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/detect'
const addFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface'

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
    const { faces: { face_token }, image_id } = response
    console.log('face_token', face_token)
    // await addFace(face_token)
    // console.log('image_id:', image_id)

  } catch (e) {
    console.log('detect FaceSet error:', e)
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
  LIMIT 6;
`

const queryImages = async () => {
  await db.query(QUERY, (err, result) => {
    if (err) {
      console.log(err)
    }
    const { rows } = result
    rows.forEach((person) => {
      person.images.forEach((image_url) => {
        detectFace(image_url)
      })
    })
  })
}

queryImages()

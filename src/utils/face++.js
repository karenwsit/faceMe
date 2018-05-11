var dotenv = require('dotenv')
dotenv.config()
var request = require('request-promise')
var db = require('../db')

const faceKey = process.env.FACEME_API_KEY
const faceSecret = process.env.FACEME_API_SECRET
console.log('process.env:', process.env)
console.log('FACE KEYYYY:', faceKey)

const faceSetURL = 'https://api-us.faceplusplus.com/facepp/v3/faceset/create'
const detectFaceURL = 'https://api-us.faceplusplus.com/facepp/v3/detect'

const createFaceSet = async () => {
  try {
    // let faceSet = await request({
    //   api_key:
    //   api_secret:
    //   display_name:
    // })
  } catch (e) {
    console.log('create FaceSet error:', e)
  }
}

const testImage = 'https://s3-us-west-1.amazonaws.com/uploadedphotostomatch/06ceb71a-d42f-47c7-9b89-2a8eca2b0cd6.JPG'

const detectFaceSet = async () => {
  let options = {
    method: 'POST',
    uri: detectFaceURL,
    qs: {
      api_key: faceKey,
      api_secret: faceSecret,
      image_url: testImage
    },
    json: true
  }
  try {
    let response = await request(options)
    console.log('responsee for detect:', respones)

  } catch (e) {
    console.log('detect FaceSet error:', e)
  }
}


module.exports = detectFaceSet

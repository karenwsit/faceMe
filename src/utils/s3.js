import aws from 'aws-sdk'
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const s3 = new aws.S3()

const getObjectFromS3 = (bucket, key, uuid, etag) => {
  const signedUrlExpireSeconds = 60*5
  const getParams = {
    Bucket: bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  }
  console.log('HELLO THIS SHOULD BE PRINTING!')
  const url = s3.getSignedUrl('getObject', getParams)
  console.log('URL:', url)
  // s3.getObject(getParams, (err, data) => {
  //   console.log('why isnt this callback printing')
  //   if (err) {
  //     console.log('errror in the getObject:', err)
  //     return err
  //   }
  //   let objectData = data.Body.toString('utf-8')
  //   console.log('objectData:', objectData)
  // })
}

module.exports = getObjectFromS3

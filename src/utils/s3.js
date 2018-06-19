import aws from 'aws-sdk'
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const s3 = new aws.S3()

const getObjectURLFromS3 = async (bucket, key) => {
  const signedUrlExpireSeconds = 60*30
  const getParams = {
    Bucket: bucket,
    Key: key,
    Expires: signedUrlExpireSeconds
  }
  try {
    return await s3.getSignedUrl('getObject', getParams)
  } catch (err) {
    console.error('s3 getSignedUrl error:', err)
  }
}

module.exports = getObjectURLFromS3

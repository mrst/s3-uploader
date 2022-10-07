import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"

const randomBytes = promisify(crypto.randomBytes)
const bucketName = process.env.BUCKET_NAME
const region = process.env.AWS_REGION
const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const S3Config = {
  region: region,
  bucketName: bucketName,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
}

aws.config.update(S3Config)

const s3 = new aws.S3()

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    //Key: albumType+"/"+albumId+"/"+imageName,
    Key: imageName,
    Expires: 60
  })
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
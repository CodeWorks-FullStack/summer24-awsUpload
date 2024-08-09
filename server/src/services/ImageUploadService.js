import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import sharp from "sharp"


const region = process.env.AWS_REGION
const bucketName = process.env.AWS_S3_BUCKET

const s3client = new S3Client(
  {
    region,
    credentials: {
      accessKeyId: process.env.AWS_TOKEN_ID,
      secretAccessKey: process.env.AWS_TOKEN_SECRET
    }
  }
)


class ImageUploadService {

  async uploadImage(file, userId) {
    const uploadRequest = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${userId}/${file.name}`,
      Body: file.data,
      ContentType: file.mimetype,
      CacheControl: 'max-age=36000'
    })
    const uploadResponse = await s3client.send(uploadRequest)
    console.log(uploadResponse);
    return { url: `https://${bucketName}.s3.${region}.amazonaws.com/${userId}/${file.name}`, kbsize: file.data.length / 1024 }
  }

  async uploadImageWithSharp(file, userId) {
    const sharpImage = sharp(file.data)
    const metadata = await sharpImage.metadata()
    const shrunkImage = sharpImage.resize(metadata.width * .5)
    // const jpegImage = shrunkImage.jpeg({ chromaSubsampling: '4:4:4', quality: 2 })
    // file.data = await jpegImage.toBuffer()
    const webpImage = shrunkImage.webp({ quality: 50, nearLossless: false })
    file.data = await webpImage.toBuffer()
    file.name = file.name.split('.')[0] + '.webp'
    // file.mimetype = 'image/jpeg'
    file.mimetype = 'image/webp'

    if (file.data.length > 50 * 1024) throw new Error(`Image too big, even after compression exceed 50kb ${file.data.length}`)
    const upload = await this.uploadImage(file, userId)
    return upload
  }

}

export const imageUploadService = new ImageUploadService()

import aws from 'aws-sdk'
import fs from 'fs'
/**
 * @param {Object} event - AWS Lambda Event
 * @param {Object} event.queryStringParameters - Query String Parameters
 * @param {string} event.queryStringParameters.bucket - S3 Bucket Name
 * @param {string} event.queryStringParameters.filepath - S3 File Path
 * @param {string} event.queryStringParameters.file - Local File Path
 */
export default defineEventHandler((event) => {
    const query = getQuery(event)
    const bucketParams: {
        Bucket: string,
        Key: string,
    } = {
        Bucket: query.bucket as string,
        Key: query.filepath as string
    }

    aws.config.update({
        region: process.env.ENV_AWS_DEFAULT_REGION,
        accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY,
    })
    aws.config.getCredentials((err) => {
        if (err) {
            console.log(err)
        }
    })
    const s3 = new aws.S3()

    s3.getObject(bucketParams, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        const writer = fs.createWriteStream(query.file as string)
        writer.on('finish', () => {
            // console.log('success')
            return
        })
        writer.write(data.Body as Buffer)
        writer.end()
    })

})
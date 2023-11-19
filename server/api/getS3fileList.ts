import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
/**
 * @param {Object} event - AWS Lambda Event
 * @param {Object} event.queryStringParameters - Query String Parameters
 * @param {string} event.queryStringParameters.bucket - S3 Bucket Name
 * @param {string} event.queryStringParameters.filepath - S3 File Path
 * @param {string} event.queryStringParameters.file - Local File Path
 */
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const client = new S3Client({
        region: process.env.ENV_AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY as string,
        }
    })
    const command = new ListObjectsV2Command({
        Bucket: query.bucket as string,
        Prefix: query.prefix as string,
        MaxKeys: 1000,
    })

    const { Contents, KeyCount } = await client.send(command)
    return { Contents, KeyCount }

})
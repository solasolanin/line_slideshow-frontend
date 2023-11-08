import aws from 'aws-sdk'
export default defineEventHandler((event) => {
    const query = getQuery(event)
    const bucketParams: {
        Bucket: string,
    } = {
        Bucket: query.bucket as string,
    }

    aws.config.getCredentials((err) => {
        if (err) {
            console.log(err)
        }
    })
    const s3 = new aws.S3()

    s3.listObjects(bucketParams, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const response = {
                statusCode: 200,
                body: JSON.stringify(data.Contents),
            }
            console.log(response)
            return response
        }
    })

})
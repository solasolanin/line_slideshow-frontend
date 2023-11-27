import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'

const client = {
    region: process.env.ENV_AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY as string,
    }
}
export default defineEventHandler(async (event) => {
    const tableName = `line-slideshow-dynamodb-${process.env.NUXT_PUBLIC_ENV}`
    const ddbClient = new DynamoDBClient(client)
    const ddbDocClient = DynamoDBDocument.from(ddbClient)
    const res = await ddbDocClient.scan({
        TableName: tableName,
        ProjectionExpression: "id"
    })
    if (res.Items == undefined) {
        return res
    }
    const dbItems = new Array(Math.ceil(res.Items.length / 25)).fill().map((_, i) =>
        res.Items?.slice(i * 25, (i + 1) * 25) as Array<object>
    )
    console.log(dbItems)
    dbItems.forEach(async (itemList) => {
        const itemsArray = []
        for (const item in itemList) {
            itemsArray.push({
                DeleteRequest: {
                    Key: itemList[item]
                }
            })
        }
        const input = {
            RequestItems: {
                tableName: itemsArray,
            }
        }
        const batchRes = await ddbDocClient.batchWrite(input)
        console.log(batchRes)
        if (batchRes.$metadata.httpStatusCode != 200) {
            return batchRes
        }
    })

    const res1 = await deleteS3file("img/")
    // if (res1?.$metadata.httpStatusCode != 200) {
    // return res1
    // }
    console.log(res1)
    const res2 = await deleteS3file("tmb/")
    // if (res2?.$metadata.httpStatusCode != 200) {
    // return res2
    // }
    console.log(res2)
    return "Done "


})
const deleteS3file = async (prefix: string) => {
    type KeyValue = {
        Key: string
    }
    const s3Client = new S3Client(client)
    const s3ListCommandImg = new ListObjectsV2Command({
        Bucket: process.env.PRIVATE_BUCKET as string,
        Prefix: prefix,
        MaxKeys: 1000,
    })
    const { Contents } = await s3Client.send(s3ListCommandImg)
    if (Contents == undefined) {
        return Contents
    }
    const keys: KeyValue = { Key: "" }
    const keyList: KeyValue[] = []
    Contents.map(x => {
        keyList.push({ Key: x.Key as string })
    })
    const s3DeleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.PRIVATE_BUCKET as string,
        Delete: {
            Objects: keyList
        }
    })
    const { Deleted } = await s3Client.send(s3DeleteCommand)
    return Deleted
}

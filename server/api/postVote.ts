import { DynamoDB as DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

/**
 * @param {Object} event - AWS Lambda Event
 * @param {Object} event.queryStringParameters - Query String Parameters
 * @param {string} event.queryStringParameters.table - DynamoDB Table Name
 * @param {string} event.queryStringParameters.prize_id - prize_id
 * @param {string} event.queryStringParameters.photo_id - photo_id
 * @param {string} event.queryStringParameters.account_name - account_name
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    const command = new PutItemCommand({
        "Item": {
            "prize_id": {
                "N": body.prize_id.toString() as string
            },
            "prize_name": {
                "S": body.prize_name as string
            },
            "photo_id": {
                "S": body.photo_id as string
            },
            "account_name": {
                "S": body.account_name as string
            }
        },
        "ReturnConsumedCapacity": "TOTAL",
        "TableName": body.table as string
    });

    const ddb = new DynamoDBClient({
        region: process.env.ENV_AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY as string,
        }
    })
    const res = await ddb.send(command)
    console.log(res)
    return res
})
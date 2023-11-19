import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda'
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
    const client = {
        region: process.env.ENV_AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY as string,
        }
    }
    const lambdaClient = new LambdaClient(client)
    const lambdaCommand = new InvokeCommand({
        FunctionName: `make-slideshow-${process.env.NUXT_PUBLIC_ENV}`,
        LogType: LogType.Tail,
    })

    const { Payload, LogResult } = await lambdaClient.send(lambdaCommand)
    const result = Buffer.from(Payload as Uint8Array).toString();
    const logs = Buffer.from(LogResult as string, "base64").toString();
    console.log("result", result)
    if (result == "") {
        return { logs: logs, result: result, videoUrl: "" as string, e: "result is empty" };
    }
    const file = JSON.parse(result)["body"]["video_name"]
    // const file = "main.mp4"
    const s3Client = new S3Client(client)
    const s3Command = new CopyObjectCommand({
        CopySource: `${process.env.PRIVATE_BUCKET as string}/video/main.mp4`,
        Bucket: process.env.PUBLIC_BUCKET as string,
        Key: `video/${file}`,
    })
    try {
        const res = await s3Client.send(s3Command)
        // console.log(res)
    } catch (e) {
        // return e
        return { logs: logs, result: result, videoUrl: "" as string, e: e };

    }
    const videoUrl = `https://${process.env.PUBLIC_BUCKET as string}.s3.ap-northeast-1.amazonaws.com/video/${file}`
    // console.log("videoUrl", videoUrl)
    // return videoUrl
    return { logs: logs, result: result, videoUrl: videoUrl as string };

})
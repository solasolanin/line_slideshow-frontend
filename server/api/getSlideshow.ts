import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda'

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
    })
    try {
        const { Payload, LogResult } = await lambdaClient.send(lambdaCommand)
        const result = Buffer.from(Payload as Uint8Array).toString();
        if (result == "") {
            return { result: result, videoUrl: "" as string, e: "result is empty" };
        }

        const file = JSON.parse(result)["body"]["video_name"]
        const videoUrl = JSON.parse(result)["body"]["video_url"]
        return { result: result, videoUrl: videoUrl as string, e: "" };
    }
    catch (e) {
        console.log(e)
        return { result: "", videoUrl: "" as string, e: e };

    }
})
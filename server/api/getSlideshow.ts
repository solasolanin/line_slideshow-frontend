import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda'

export default defineEventHandler(async (event) => {
    const client = new LambdaClient({
        region: process.env.ENV_AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY as string,
        }
    })
    const command = new InvokeCommand({
        FunctionName: `make-slideshow-${process.env.NUXT_PUBLIC_ENV}`,
        LogType: LogType.Tail,
    })

    const { Payload, LogResult } = await client.send(command)
    const result = Buffer.from(Payload as Uint8Array).toString();
    const logs = Buffer.from(LogResult as string, "base64").toString();
    return { logs, result };

})
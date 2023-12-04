<script setup lang="ts">
import '@/assets/css/loading.css';
import type { S3file } from '@/types/s3';
const runtimeConfig = useRuntimeConfig();

const isMaking = ref(false);
const haveResponse = ref(false);
const videoLink = ref("");
type VideoInfo = S3file & { Uri: string };
const videoList = ref<VideoInfo[]>([]);
const makeList = async () => {
    const { data } = await useFetch('/api/getS3fileList', {
        query: {
            bucket: `line-slideshow-open-s3-${runtimeConfig.public.env}`,
            prefix: "video/",
        }
    })
    if (data.value == null || data.value.Contents == null) {
        throw new Error("data is null")
    }
    data.value.Contents.forEach((item: any) => {
        videoList.value.push({
            Uri: `${runtimeConfig.public.bucket_url}${item.Key}`,
            Key: item.Key.replace("video/", ""),
            LastModified: new Date(item.LastModified).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        })
    })
}
const makeSlideshow = async () => {
    isMaking.value = true;
    const { data: response } = await useFetch("/api/getSlideshow")
    if (response.value == null) {
        throw Error("response is undefined");
    }
    console.log(response.value.result)
    if (JSON.parse(response.value.result)["statusCode"] !== 200) {
        throw Error("statusCode is not 200");
    }
    if (!response.value.videoUrl) {
        throw Error("videoUrl is undefined");
    }
    videoLink.value = response.value.videoUrl;
    haveResponse.value = true;
    isMaking.value = false;
    videoList.value = [];
    await makeList();
};
onMounted(async () => {
    await makeList();
});

</script>
<template>
    <header>
        <h2>スライドショー作成</h2>
    </header>
    <hr />
    <main>
        <div v-if="!isMaking">
            <button v-on:click="makeSlideshow">
                ここを押してスライドショー作成実行
            </button>
        </div>
        <!-- <div id="loading"> -->
        <div id="loading" v-if="isMaking">
            <div class="loader001"> </div>
        </div>
        <div class="link" v-if="!isMaking">
            <h3>作成されたファイル</h3>
            <div id="file_list">
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">ファイル名</th>
                            <th class="text-left">作成日時</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="el in videoList">
                            <td>
                                <a v-bind:href="el.Uri">{{ el.Key }}</a>
                            </td>
                            <td>{{ el.LastModified }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <!-- <a v-bind:href="videoLink">ここを押すとスライドショーがダウンロードされます。</a> -->

        </div>
    </main>
</template>
<style scoped>
main {
    text-align: center;
}

button {
    margin-top: 70px;
    background-color: white;
    border: 1px solid black;
    color: black;
    border-radius: 5px;
    padding: 10px 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.link {
    margin-top: 70px;
}

#file_list {
    margin: 0 20vw;
    text-align: left;
}
</style>
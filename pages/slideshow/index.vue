<script setup lang="ts">
import '@/assets/css/loading.css';

const runtimeConfig = useRuntimeConfig();

const isMaking = ref(false);
const haveResponse = ref(false);
const videoLink = ref("");
const makeSlideshow = async () => {
    isMaking.value = true;
    const { data: response } = await useFetch("/api/getSlideshow")
    if (response.value == null) {
        throw Error("response is undefined");
    }
    console.log(response.value.result)
    if (JSON.parse(response.value.result)["statusCode"] !== 200) {
        throw response.value.logs;
    }
    videoLink.value = runtimeConfig.public.video_url
        + JSON.parse(response.value.result)["body"]["video_name"];
    haveResponse.value = true;
    isMaking.value = false;
};

</script>
<template>
    <header>
        <h2>スライドショー作成</h2>
    </header>
    <hr />
    <main>
        <div v-if="!isMaking">
            <button v-on:click="makeSlideshow">
                ここを押してスライドショー作成実行{{ runtimeConfig.public.env }}
            </button>
        </div>
        <!-- <div id="loading"> -->
        <div id="loading" v-if="isMaking">
            <div class="loader001"> </div>
        </div>
        <div class="link" v-if="haveResponse">
            <a v-bind:href="videoLink">ここを押すとスライドショーがダウンロードされます。</a>
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
</style>
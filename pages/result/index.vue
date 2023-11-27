<script setup lang="ts">
import { type prize } from '@/types/prize'
const runtimeConfig = useRuntimeConfig();
const viewId = ref<number>(0)
const prizeMap = new Map<number, prize>()
const { data: prizeDatad } = await useFetch('/api/getTableScan', {
    query: { table: `line-slideshow-dynamodb-contest-${runtimeConfig.public.env}` }
})
if (prizeDatad.value?.Items) {
    prizeDatad.value?.Items.forEach((item: any) => {
        prizeMap.set(
            item.prize_id,
            {
                id: item.prize_id as number,
                name: item.prize_name as string,
                photo_id: item.photo_id as string,
                account_name: item.account_name as string,
            })
    })
    viewId.value = prizeMap.size
}

useState<Map<number, prize>>("prizeMap", () => prizeMap)
useState<number>("viewId", () => viewId.value)
</script>
<template>
    <div>
        <img src="@/assets/flower.jpg" />
    </div>
    <div class="title">
        <div>
            <h3>新郎＆新婦が選ぶ</h3>
            <h1>フォトコンテスト</h1>
        </div>
        <div>
            <NuxtLink v-bind:to="{ name: 'result-id', params: { id: viewId } }">
                <button>結果発表</button>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@700&display=swap');

img {
    height: 100vh;
    width: 100vw;
    object-fit: cover;
    opacity: 0.75;
}

.title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: xxx-large;
    color: azure;
    width: max-content;
    font-weight: bold;
    font-style: italic;
    font-family: 'Kaisei Decol', serif;
    -webkit-text-stroke: 1px #000;
    text-align: center;
}

button {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: xx-large;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}
</style>
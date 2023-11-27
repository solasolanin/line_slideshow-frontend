<script setup lang="ts">
import { type prize } from '@/types/prize'
const runtimeConfig = useRuntimeConfig();
const prizeMap = ref(new Map<number, prize>())
const viewPrize = ref<prize>()
let viewPrizeId = 0
const { data: prizeDatad } = await useFetch('/api/getTableScan', {
    query: { table: `line-slideshow-dynamodb-contest-${runtimeConfig.public.env}` }
})
if (prizeDatad.value?.Items) {
    prizeDatad.value?.Items.forEach((item: any) => {
        prizeMap.value.set(
            item.prize_id,
            {
                id: item.prize_id as number,
                name: item.prize_name as string,
                photo_id: item.photo_id as string,
                account_name: item.account_name as string,
            })
    })
    viewPrize.value = prizeMap.value.get(viewPrizeId)
    viewPrizeId = prizeMap.value.size
}

// Photoデータの取得
type Photo = {
    id: string,
    file: string,
    path: string,
    poster: string,
}
// const thumbUrlPrefix = process.env.THUMBNAIL_URL
const thumbUrlPrefix = `${runtimeConfig.public.bucket_url}tmb/`
// const originUrlPrefix = process.env.ORIGIN_IMG_URL
const originUrlPrefix = `${runtimeConfig.public.bucket_url}img/`
const photoMap = ref(new Map<string, Photo>())

const colCount = 4
const rowCount = computed((): number => {
    console.log(photoMap.value.size)
    return Math.ceil(photoMap.value.size / colCount)
})

const photoArray = computed((): Photo[] => {
    return [...photoMap.value.values()]
})
const { data, refresh } = await useFetch('/api/getTableScan', {
    query: { table: `line-slideshow-dynamodb-${runtimeConfig.public.env}` }
})

if (data.value?.Items) {
    data.value?.Items.forEach((item: any) => {
        photoMap.value.set(
            item.id,
            {
                id: item.id,
                file: item.body.thumbnail,
                path: `${thumbUrlPrefix}${item.body.thumbnail}`,
                poster: item.body.account_name
            })
    })
}

const isSelected = ref(false)
const previewPath = ref('')
let selectedPhotoId = ''
const showPreview = ((id: string) => {
    isSelected.value = true
    selectedPhotoId = id
    previewPath.value = `${originUrlPrefix}${id}.jpeg`
})
const vote = (async () => {
    const { data: voted } = await useFetch('/api/postVote', {
        method: 'POST',
        body: {
            table: `line-slideshow-dynamodb-contest-${runtimeConfig.public.env}`,
            prize_id: viewPrizeId,
            prize_name: prizeMap.value.get(viewPrizeId)?.name,
            photo_id: selectedPhotoId,
            account_name: photoMap.value.get(selectedPhotoId)?.poster
        }
    })
    console.log(voted.value)
    if (viewPrizeId === 1) {
        return navigateTo('/vote/done')
    }
    viewPrizeId--
    isSelected.value = false
})
const viewPrizeName = computed((): string => {
    return prizeMap.value.get(viewPrizeId)?.name ?? ''
})

</script>

<template>
    <header>
        <h2>フォトコン投票</h2>
    </header>
    <hr>
    <main>
        <div id="description" v-if="viewPrizeId !== 0">
            <h4>{{ viewPrizeName }}を選んでください</h4>
            <!-- <h4>{{ prizeMap.get(viewPrizeId)?.name }}を選んでください</h4> -->
        </div>
        <div v-if="photoArray.length === 0">データがありません</div>
        <div v-else>
            <v-row>
                <v-col v-for="i in photoArray.length" :key="i" cols="3" class="card.flex">
                    <v-card>
                        <v-card-item>
                            <v-img :src="photoArray[i - 1].path" height="200px" @click="showPreview(photoArray[i - 1].id)">
                            </v-img>

                        </v-card-item>
                        <v-card-title>{{ photoArray[i - 1].poster }}</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <!-- サムネイル押下で元画像表示 -->
        <v-dialog theme="dark" v-model="isSelected">
            <v-card>
                <v-card-title>{{ viewPrizeName }}はこれでいいですか？</v-card-title>
                <v-card-item>
                    <v-img :src="previewPath" height="700"></v-img>
                </v-card-item>
                <v-card-actions>
                    <v-btn variant="text" v-on:click="isSelected = false">キャンセル</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" v-on:click="vote()">決定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </main>
</template>

<style scoped>
main {
    position: relative;
    height: 100vh;
    overflow: scroll;
    /* background-color: black; */
    padding: 0 8px;
}

#description {
    margin: 0 8px;
}

.row {
    display: inline-flex;
    flex-direction: row;
}

.col {
    display: inline-flex;
    flex-direction: column;
    margin-left: 8px;
}

.thumbnail {
    width: calc(100vw/v-bind(colCount) - 8px);
}
</style>
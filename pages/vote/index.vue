<script setup lang="ts">
type Photo = {
    id: string,
    file: string,
    path: string,
    poster: string,
}
// const thumbUrlPrefix = process.env.THUMBNAIL_URL
const thumbUrlPrefix = "https://dipq407x26ji4.cloudfront.net/tmb/"
// const originUrlPrefix = process.env.ORIGIN_IMG_URL
const originUrlPrefix = "https://dipq407x26ji4.cloudfront.net/img/"
const photoMap = ref(new Map<string, Photo>())

const colCount = 4
const rowCount = computed((): number => {
    return Math.ceil(photoMap.value.size / colCount)
})

const photoArray = computed((): Photo[] => {
    return [...photoMap.value.values()]
})
const { data, refresh } = await useFetch('/api/getTableScan', {
    query: { table: "line-slideshow-dynamodb-dev" }
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
const showPreview = ((id: string) => {
    isSelected.value = true
    previewPath.value = `${originUrlPrefix}${id}.jpeg`
})

// photoMap.value.forEach(async (value, key) => {
//     const { data } = await useLazyFetch('/api/getS3file', {
//         query: { bucket: "line-slideshow-s3-dev", filepath: `tmb/${value.file}`, file: `public/img/${value.file}` },
//     })

// })

</script>

<template>
    <header>
        <h2>フォトコン投票</h2>
    </header>
    <hr>
    <main>
        <div v-if="rowCount === 0">データがありません</div>
        <div v-else>
            <div class="row" v-for="row in rowCount">
                <div class="col" v-for="col in colCount">
                    <img class="thumbnail" @click="showPreview(photoArray[colCount * row - colCount + col].id)"
                        :src="photoArray[colCount * row - colCount + col].path"
                        v-if="photoArray.length !== 0 && photoArray[colCount * row - colCount + col]">
                    <p v-if="photoArray.length !== 0 && photoArray[colCount * row - colCount + col]">
                        {{ photoArray[colCount * row - colCount + col].poster }}
                    </p>
                </div>
            </div>
        </div>
        <!-- サムネイル押下で元画像表示 -->
        <section class="preview" v-if="isSelected">
            <div id="preview-area">
                <img id="preview" :src="previewPath">
                <div>
                    <button v-on:click="isSelected = false">キャンセル</button>
                    <button>決定</button>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
main {
    position: relative;
    height: 100vh;
    overflow: scroll;
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

section {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    /* margin-top: -85.5px; */
    display: flex;
    /* place-items: center; */
    align-items: center;
    justify-content: center;
    overflow: scroll;
    top: 0;
}

section img {
    max-width: 70%;
    max-height: 50%;
}

#preview-area {
    text-align: center;
}

section button {
    margin: 8px;
    padding: 8px;
    width: 20vw;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
}
</style>
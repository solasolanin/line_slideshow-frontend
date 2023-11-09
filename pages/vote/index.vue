<script setup lang="ts">
type Photo = {
    file: string,
    path: string,
}
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
        photoMap.value.set(item.id, { file: item.body.thumbnail, path: `/img/${item.body.thumbnail}` })
    })
}


console.log('rowCount', rowCount.value)
photoMap.value.forEach(async (value, key) => {
    const { data } = await useLazyFetch('/api/getS3file', {
        query: { bucket: "line-slideshow-s3-dev", filepath: `tmb/${value.file}`, file: `public/img/${value.file}` },
    })

})

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
                    <img :src="photoArray[colCount * row - colCount + col].path"
                        v-if="photoArray.length !== 0 && photoArray[colCount * row - colCount + col]">
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.row {
    display: inline-flex;
    flex-direction: row;
}

.col {
    display: inline-flex;
    flex-direction: column;
    margin-left: 8px;
}

image {
    width: calc(100%/4 - 8px);
}
</style>
<script setup lang="ts">
type Photo = {
    file: string,
    path?: string,
}
const photoMap = ref(new Map<string, Photo>())

const rowCount = ref(0)
const {data, refresh} = await useFetch('/api/getTableScan',{
    query: {table:"line-slideshow-dynamodb-dev"}
}) 
console.log(data.value?.Items)

if(data.value?.Items){
    data.value?.Items.forEach((item: any) => {
    photoMap.value.set(item.id, {file: item.body.thumbnail})
    })
}

console.log(photoMap.value)
rowCount.value = Math.ceil(photoMap.value.size/4) 

photoMap.value.forEach(async(value, key) => {
    const {pending, data} = await useLazyFetch('/api/getS3file', {
        query:{bucket:"line-slideshow-s3-dev", filepath: `tmb/${value.file}`, file: `public/img/${value.file}`}
    }) 
    photoMap.value.set(key, {file: value.file, path: `/img/${value.file}` as string})
})

</script>

<template>
    <header>
        <h2>フォトコン投票</h2>
    </header>
    <hr>
    <main>
        <dl v-for="row in rowCount">
            <div v-for="photo in photoMap">
                <img :src="photo[1].path" width="200px" height="200px" v-if="photo[1].path !== undefined">
            </div>
        </dl>
    </main>
</template>
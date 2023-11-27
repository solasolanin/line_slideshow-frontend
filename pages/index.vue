<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const photoNum = ref(0)
const { data } = await useFetch('/api/getS3fileList', {
    query: {
        bucket: `line-slideshow-open-s3-${runtimeConfig.public.env}`,
        prefix: "img/",
    }
})
if (data.value == null) {
    throw new Error("data is null")
}
photoNum.value = data.value.KeyCount

</script>

<template>
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <header>
        <div>
            <img src="@/assets/flower.jpg" />
        </div>
        <div class="title">
            <p>フォトコンシステム</p>
        </div>
        <div id="tips">
            <p>ただいまの投稿枚数：{{ photoNum }}</p>
        </div>
    </header>
    <main>
        <div>

            <NuxtLink to="/vote" class="link">
                <button>
                    フォトコン投票
                    <br />
                    <span class="material-symbols-outlined">how_to_vote </span>
                </button>
            </NuxtLink>
        </div>
        <div>
            <NuxtLink to="/result" class="link">
                <button class="middle">
                    フォトコン発表
                    <br />
                    <span class="material-symbols-outlined"> trophy </span>
                </button>
            </NuxtLink>
        </div>
        <div>
            <NuxtLink to="/slideshow" class="link">
                <button class="right">
                    スライドショー作成
                    <br />
                    <span class="material-symbols-outlined"> slideshow </span>
                </button>
            </NuxtLink>
        </div>
    </main>
</template>

<style scoped>
header {
    position: relative;
}

header img {
    height: 80vh;
    width: 100vw;
    object-fit: cover;
    opacity: 0.75;
}

header .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: xxx-large;
    color: white;
    width: max-content;
    font-weight: bold;
    font-style: italic;
    -webkit-text-stroke: 1px #000;
}

#tips {
    position: absolute;
    top: 0;
    left: 10px;
    color: white;
}

/* .title {
    position: flex;
} */

main {
    display: inline-flex;
    width: 100vw;
    position: fixed;
    bottom: 0;
}


.link {
    text-decoration: none;
    color: black;
}

button {
    height: 20vh;
    width: 33vw;
    background-color: #F5E2DB;
    border: 1px solid gray;
    flex-grow: 1;
    font-size: large;
    font-weight: bold;
}

button.middle {
    border-left: none;
}

button.right {
    border-left: none;
    width: 34vw;
}

.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
</style>
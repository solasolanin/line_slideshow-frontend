<script setup lang="ts">
</script>

<template>
    <header>
        <div>
            <img src="@/assets/flower.jpg" />
        </div>
        <div class="title">
            <p>フォトコンシステム</p>
        </div>
    </header>
    <main>
        <div>

            <NuxtLink to="/vote" class="link">
                <button>
                    フォトコン投票
                </button>
            </NuxtLink>
        </div>
        <div>
            <button class="middle">フォトコン発表</button>
        </div>
        <div>
            <button class="right">スライドショー作成</button>
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
</style>
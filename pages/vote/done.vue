<script setup lang="ts">

</script>

<template>
    <header>
        <h2>フォトコン投票</h2>
    </header>
    <hr>
    <main>
        <div>
            <p>投票を受け付けました</p>
        </div>
        <div>
            <NuxtLink to="/">
                <button>トップページへ</button>
            </NuxtLink>
        </div>
    </main>
</template>

<style scoped>
body {
    background-color: #F5E2DB;
}

button {
    background-color: #F5E2DB;
    border: solid 1px #F5E2DB;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    cursor: pointer;
}
</style>
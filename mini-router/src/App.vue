<template>
    <h1 class="title">mini vue-router</h1>

    <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
    </nav>

    <div class="router-area">
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from '@/mini-router'

</script>

<style scoped>
h1.title {
    text-align: center;
    font-weight: 200;
}

p {
    text-align: center;
    font-weight: 200;
    margin-top: 1em;
    font-size: 18px;
}

.nav {
    display: flex;
    height: 50px;
    justify-content: space-evenly;
    align-items: center;
}

.router-area {
    margin-top: 2em;
    display: flex;
    justify-content: center;
}

.active {
    border-bottom: 3px solid hsla(160, 100%, 37%, 1);
}
</style>

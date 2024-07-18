<template>
    <div>
        <h2>首页</h2>
        <h3>下面是嵌套路由</h3>

        <div style="margin-top: 30px;">
            <router-link to="/a">A页面</router-link>
            <span>｜</span>

            <router-link to="/b">B页面</router-link>
            <span>｜</span>

            <router-link to="/c">C页面</router-link>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <p>当前路由</p>
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

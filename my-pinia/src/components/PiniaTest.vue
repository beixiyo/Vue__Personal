<template>
    <div class="PiniaTest-container">
        <p>{{ store.count }}</p>
        <p>{{ store.doubleCount }}</p>
        <p>{{ $pinia.state }}</p>

        <button @click="() => store.increase()">+</button>
    </div>
</template>

<script setup lang="ts">
import { useOptStore } from '@/store/useOptStore'
import { useSetupStore } from '@/store/useSetupStore'
import { watch } from 'vue'


defineOptions({
    inheritAttrs: true,
    name: 'PiniaTest'
})


const store = useOptStore()
// const store = useSetupStore()

watch(
    store,
    () => {
        console.log(store)   
    },
    { immediate: true }
)

</script>

<style lang="scss" scoped>

</style>
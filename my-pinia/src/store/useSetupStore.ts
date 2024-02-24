// import { defineStore } from 'pinia'
import { defineStore } from '@/my-pinia'
import { computed, ref } from 'vue'


export const useSetupStore = defineStore(
    'setup',
    () => {
        const count = ref(0)   
        const increase = () => count.value++

        const doubleCount = computed(() => count.value * 2)

        return {
            count,
            increase,
            doubleCount
        }
    }
)

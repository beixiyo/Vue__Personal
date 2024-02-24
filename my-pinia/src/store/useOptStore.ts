// import { defineStore } from 'pinia'
import { defineStore } from '@/my-pinia'


export const useOptStore = defineStore(
    'opt',
    {
        state: () => ({
            count: 0,
        }),
        getters: {
            doubleCount: (state) => state.count * 2,
        },
        actions: {
            increase() {
                this.count++
            }
        }
    }
)

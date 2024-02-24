import type { PiniaOpt, PiniaSetup, PiniaStore } from '@/types'
import type { StateTree } from 'pinia'
import { computed, inject, reactive } from 'vue'
import { PiniaKey } from './config'


export function defineStore<Id extends string, S extends StateTree>(
    id: Id,
    optOrSetup: PiniaOpt<S> | PiniaSetup
) {
    /** 最终所有属性分配到的地方 */
    const store = reactive<any>({})

    return () => {
        const pinia = inject(PiniaKey) as PiniaStore
        pinia.state[id] = store

        switch (typeof optOrSetup) {
            case 'function':
                createSetupStore(store, optOrSetup, id)
                break
            case 'object':
                createOptStore(store, optOrSetup, id)
    
            default:
                break
        }
        
        return store
    }
}


function createSetupStore(store: any, setup: PiniaSetup, id: string) {
    Object.assign(store, setup(), { $id: id })
}

function createOptStore<S extends StateTree>(store: any, opt: PiniaOpt<S>, id: string) {
    const { actions = {}, getters = {}, state = () => ({}) } = opt

    function setup() {
        const $state = state()

        return Object.assign(
            $state,
            actions,
            Object.keys(getters).reduce(
                (init, key) => {
                    /** 最终会被放入 Reactive 中，能自动解包 */
                    init[key] = computed(() => getters[key].call(store, store))
                    return init
                },
                {} as any
            )
        )
    }

    createSetupStore(store, setup, id)
}
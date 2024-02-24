import type { Plugin } from 'vue'
import { PiniaKey } from './config'


export function createPinia(): Plugin {
    return {
        install(app) {
            const
                config = app.config.globalProperties as any,
                pinia = {
                    state: {}
                }

            app.provide(PiniaKey, pinia)
            config.$pinia = pinia
        }
    }
}

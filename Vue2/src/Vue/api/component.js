import { isFn } from '@/utils/tools'

export function component(Vue) {

    function VueComponent(id, defintion) {
        defintion = isFn(defintion)
            ? defintion
            : Vue.extend(defintion)

        Vue.options.components[id] = defintion
    }

    return VueComponent
}
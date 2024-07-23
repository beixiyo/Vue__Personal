import { getType, isFn } from "@/utils/tools"
import observe from "@/Vue/observe"

export default function initData(vm, data) {
    if (!['object', 'function'].includes(getType(data))) {
        throw new TypeError('data must be object or function')
    }
    data = isFn(data)
        ? data.call(vm)
        : data

    vm._data = data
    observe(data)

    for (const key in data) {
        if (!Object.hasOwnProperty.call(data, key)) continue
        proxy(vm, '_data', key)
    }
}

/**
 * 把 data 从 _data 代理到 vm ,方便用户访问
 */
function proxy(vm, tar, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[tar][key]
        },
        set(newVal) {
            vm[tar][key] = newVal
        }
    })
}
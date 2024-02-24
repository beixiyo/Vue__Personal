import handler from './handler.js'
import { isObject } from '../utils/index.js'


const targetMap = new WeakMap()

export function reactive(target) {
    if (!isObject(target)) return target
    if (targetMap.has(target)) return targetMap.get(target)

    const proxy = new Proxy(target, handler)

    // 防止重复
    targetMap.set(target, proxy)
    targetMap.set(proxy, proxy)
    return proxy
}

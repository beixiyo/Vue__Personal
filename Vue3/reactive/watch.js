import { clearDep, effect } from './effect.js'
import { isRef } from './ref.js'


/**
 * 监听器，未考虑数组情况
 * @param {*} source 响应式数据源
 * @param {<T>(prevVal: T, oldVal: T) => void} cb 回调
 * @param {{ immediate: boolean }} opt 配置项
 */
export function watch(
    source,
    cb,
    {
        immediate = false,
    } = {}
) {
    /**
     * 函数直接使用
     * 对象深度递归触发依赖收集
     */
    let getter = isRef(source)
        ? () => source.value
        : source

    let oldVal, newVal

    const scheduler = () => {
        newVal = effectFn()
        cb(newVal, oldVal)
        oldVal = newVal
    }
    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler,
    })

    immediate
        ? scheduler()
        : effectFn()

    return () => {
        clearDep(effectFn)
    }
}

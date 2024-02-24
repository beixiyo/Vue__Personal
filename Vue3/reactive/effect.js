import { TrackTypes, TriggerTypes } from './optType.js'


let shouldTrack = true,
    activeEffect = null
const effectStack = []
const ITERATE_KEY = Symbol('iterateKey')
/**
 * @example targetMap: {
 *     [Object(原始对象)] => {
 *         propName(属性名) => {
 *             get(操作类型) => Set([fn1, fn2...]),
 *             set(操作类型) => Set([fn1, fn2...]),
 *             add(操作类型) => Set([fn1, fn2...])
 *         }
 *     }
 * }
 */
const targetMap = new WeakMap()

/**
 * 执行函数并收集其中的响应式数据
 * @param {Function} fn
 * @param {{
 *      lazy: boolean,
 *      scheduler: (effect: Function) => void
 * }} opt
 */
export function effect(fn, opt = {}) {
    const { lazy = false } = opt
    const effectFn = () => {
        try {
            activeEffect = effectFn
            effectStack.push(effectFn)
            // 每次执行前 清空当前函数 重新收集最新依赖 解决函数内 响应式数据条件判断问题
            clearDep(effectFn)
            return fn()
        }
        finally {
            // 执行栈解决函数嵌套时 内部函数执行完清空`activeEffect`的问题
            effectStack.pop()
            activeEffect = effectStack.at(-1)
        }
    }

    effectFn.depArr = []
    effectFn.opt = opt
    if (lazy) {
        return effectFn
    } else {
        return effectFn()
    }
}

/**
 * 每次执行前 清空当前函数 重新收集最新依赖
 * 解决函数内 响应式数据条件判断问题
 * @param {Function} effectFn
 */
export function clearDep(effectFn) {
    const { depArr } = activeEffect
    if (!depArr) return

    depArr.forEach((fnSet) => fnSet.delete(effectFn))
    depArr.length = 0
}

/**
 * 收集依赖
 * @param {Object} target
 * @param {TrackTypes} type
 * @param {String} key
 * @returns
 */
export function track(target, type, key) {
    // 执行`effct`时 函数中的响应式数据`getter`会触发这里的收集依赖
    if (!shouldTrack || !activeEffect) return

    let propMap = targetMap.get(target)
    if (!propMap) {
        propMap = new Map()
        targetMap.set(target, propMap)
    }

    // `for in`循环时
    if (type === TrackTypes.ITERATE) {
        key = ITERATE_KEY
    }
    let typeMap = propMap.get(key)
    if (!typeMap) {
        typeMap = new Map()
        propMap.set(key, typeMap)
    }

    let depSet = typeMap.get(type)
    if (!depSet) {
        depSet = new Set()
        typeMap.set(type, depSet)
    }
    if (!depSet.has(activeEffect)) {
        depSet.add(activeEffect)
        activeEffect.depArr.push(depSet)
    }

    console.log(`%c[[${type}]]: `, 'color: #f40', key)
}

/**
 * 派发更新
 * @param {Object} target
 * @param {TriggerTypes} type
 * @param {String} key
 */
export function trigger(target, type, key) {
    console.log(`%c[[${type}]]: `, 'color: #49f', key)

    const effectFnSet = getEffectFnSet(target, key, type)

    effectFnSet?.forEach((fn) => {
        // 当依赖收集中 不要触发 避免递归
        if (fn === activeEffect) return

        const { scheduler } = fn.opt
        if (scheduler) {
            return scheduler(fn)
        }
        fn()
    })
}

/** 暂停依赖收集 */
export function pauseTrack() {
    shouldTrack = false
}
/** 恢复依赖收集 */
export function resumeTrack() {
    shouldTrack = true
}

/** 操作关联关系 */
const triggerTypeMap = {
    [TriggerTypes.SET]: [TrackTypes.GET],
    [TriggerTypes.DELETE]: [TrackTypes.GET, TrackTypes.ITERATE, TrackTypes.HAS],
    [TriggerTypes.ADD]: [TrackTypes.GET, TrackTypes.ITERATE, TrackTypes.HAS],
}
/**
 * 返回依赖函数`Set`集合
 * @param {Object} target
 * @param {String} key
 * @param {String} type
 * @returns {Set<Function> | undefined}
 */
function getEffectFnSet(target, key, type) {
    const propMap = targetMap.get(target)
    if (!propMap) return

    const keys = [key]
    const effectFnSet = new Set()
    // 添加和删除会影响到`for in`枚举 所以要监听
    if ([TriggerTypes.ADD, TriggerTypes.DELETE].includes(type)) {
        keys.push(ITERATE_KEY)
    }

    for (const key of keys) {
        const typeMap = propMap.get(key)
        if (!typeMap) continue

        /** 派发行为类型的数组 */
        const triggerTypeArr = triggerTypeMap[type]

        for (const type of triggerTypeArr) {
            const dep = typeMap.get(type)
            if (!dep) continue
            dep.forEach((fn) => effectFnSet.add(fn))
        }
    }

    return effectFnSet
}

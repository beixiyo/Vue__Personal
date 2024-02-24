import { track, trigger, pauseTrack, resumeTrack } from './effect.js'
import { reactive } from './reactive.js'
import { isObject, hasChange } from '../utils/index.js'
import { TrackTypes, TriggerTypes } from './optType.js'
import { isRef } from './ref.js'


const RAW = Symbol('raw')
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach((method) => {
    arrayInstrumentations[method] = function (...args) {
        const res = Array.prototype[method].apply(this, args)

        if ([-1, false].includes(res)) {
            /**
             * 这里由代理对象调用 this指向是代理对象 所以会找不到对象
             * 如果找不到则使用 `this[RAW]`再次读取代理的属性
             * 当代理看见`RAW` 则返回原始对象 使用原始对象调用方法 即可找到正确的值
             */
            return Array.prototype[method].apply(this[RAW], args)
        }
        return res
    }
});

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(
    (method) => {
        /**
         * 由于上述方法 会读取和改变`length`属性
         * 但是开发者实际上不希望调用时 监听`length`属性
         * 于是先暂停依赖收集 等执行完毕后再重启依赖收集
         */
        arrayInstrumentations[method] = function (...args) {
            pauseTrack()
            const res = Array.prototype[method].apply(this, args)
            resumeTrack()
            return res
        }
    }
)

function get(target, key, receiver) {
    // 当代理看见`RAW` 则返回原始对象 使用原始对象调用方法 即可找到正确的值
    if (key === RAW) {
        return target
    }
    track(target, TrackTypes.GET, key)

    /**
     * 使用代理对象调用 ['includes', 'indexOf', 'lastIndexOf']
     * 因为下面给对象进行深度代理 所以调用上述查找方法找的是代理对象 而传参是原始对象
     * 所以会找不到对象
     */
    if (arrayInstrumentations.hasOwnProperty(key) && Array.isArray(target)) {
        return arrayInstrumentations[key]
    }
    const res = Reflect.get(target, key, receiver)
    
    /** ref 被 reactive 包裹时，要直接返回 .value */
    if (isRef(res)) {
        return res.value
    }

    /**
     * 当读取 `obj.a.b` 时，希望同时收集`a b`的依赖
     * 如果直接返回`res`原始对象 则无法收集内部属性的依赖
     * 必须返回一个代理才行
     */
    if (isObject(res)) {
        return reactive(res)
    }

    return res
}

function set(target, key, value, receiver) {
    const type = target.hasOwnProperty(key)
        ? TriggerTypes.SET
        : TriggerTypes.ADD

    const oldVal = target[key],
        isArray = Array.isArray(target),
        oldLen = isArray ? target.length : undefined

    const res = Reflect.set(target, key, value, receiver)
    /** 被冻结的对象 或 只读的属性没法赋值 所以直接返回 */
    if (!res) {
        return res
    }

    const newLen = isArray ? target.length : undefined

    if (hasChange(oldVal, value) || type === TriggerTypes.ADD) {
        trigger(target, type, key)

        if (isArray && oldLen !== newLen) {
            /**
             * 当设置数组的索引超出数组长度时
             * 会自动调用`Object.defineProperty`设置`length`
             * 所以监听不到长度变化 于是通过对比长度的方式触发`trigger`
             */
            if (key !== 'length') {
                trigger(target, TriggerTypes.SET, 'length')
            }
            // 长度变短 则删除
            else {
                for (let i = newLen; i < oldLen; i++) {
                    trigger(target, TriggerTypes.DELETE, i + '')
                }
            }
        }
    }

    return res
}

/** key in target ... */
function has(target, key) {
    track(target, TrackTypes.HAS, key)
    return Reflect.has(target, key)
}

/** for in ... */
function ownKeys(target) {
    track(target, TrackTypes.ITERATE, target)
    return Reflect.ownKeys(target)
}

function deleteProperty(target, key) {
    const rawHas = target.hasOwnProperty(key)
    const res = Reflect.deleteProperty(target, key)

    // 原来有 现在没了才算删除成功
    if (rawHas && res) {
        trigger(target, TriggerTypes.DELETE, key)
    }
    return res
}


export default {
    get,
    set,

    has,
    ownKeys,
    deleteProperty,
}

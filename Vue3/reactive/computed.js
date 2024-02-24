import { effect, track, trigger } from './effect.js'
import { TrackTypes, TriggerTypes } from './optType.js'

/**
 * 计算属性
 */
export function computed(getterOrOpt) {
    let value,
        target,
        dirty = true
    const { getter, setter } = normalize(getterOrOpt)

    const effectFn = effect(getter, {
        lazy: true,
        /** 依赖属性变了时 设置藏值 并触发依赖值更新 */
        scheduler() {
            dirty = true
            trigger(target, TriggerTypes.SET, 'value')
        },
    })

    target = {
        get value() {
            track(target, TrackTypes.GET, 'value')
            if (dirty) {
                value = effectFn()
                dirty = false
                return value
            }
            return value
        },
        set value(newVal) {
            return setter(newVal)
        },
    }
    return target
}

function normalize(getterOrOpt) {
    let getter, setter

    if (typeof getterOrOpt === 'function') {
        getter = getterOrOpt
        setter = () => {
            console.warn('computed is not has setter')
        }
    } else {
        getter = getterOrOpt.get
        setter = getterOrOpt.set
    }

    return {
        getter,
        setter,
    }
}

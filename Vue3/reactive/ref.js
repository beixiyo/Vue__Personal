import { track, trigger } from "./effect.js"
import { TrackTypes, TriggerTypes } from "./optType.js"


export const IsRef = Symbol('isRef')

/**
 * 基本数据类型包装
 * @param {T} value
 * @returns {{ value: T }}
 */
export function ref(value) {
    return {
        get value() {
            track(this, TrackTypes.GET, 'value')
            return value
        },
        set value(newVal) {
            if (value === newVal) return

            value = newVal
            trigger(this, TriggerTypes.SET, 'value')
        },
        [IsRef]: true
    }
}

export function isRef(value) {
    return value[IsRef] === true
}

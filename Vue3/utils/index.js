export function isObject(target) {
    return target !== null && typeof target === 'object'
}

export const isFn = (fn) => typeof fn === 'function'

export function hasChange(v1, v2) {
    return !Object.is(v1, v2)
}
export function isObject(target) {
    return target !== null && typeof target === 'object';
}

export function hasChange(v1, v2) {
    return !Object.is(v1, v2)
}
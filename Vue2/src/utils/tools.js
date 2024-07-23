export const toCamel = key => key
    .replace(/-[a-z]/g, res => res[1]
        .toUpperCase())

export const getType = tar => Object.prototype
    .toString.call(tar)
    .slice(8, -1)
    .toLowerCase()

/**
 * 定义不可枚举属性
 */
export function defineNoEnum(tar, key, val) {
    Object.defineProperty(tar, key, {
        value: val,
        enumerable: false
    })
}


export const isObj = obj => typeof obj === 'object' && obj !== null
export const isStr = str => typeof str === 'string'
export const isFn = fn => typeof fn === 'function'

/**
 * @param {string} tagName 
 */
export function isComponent(tagName) {
    return (tagName && tagName[0] === tagName[0].toUpperCase()) ||
        tagName.includes('-')
}
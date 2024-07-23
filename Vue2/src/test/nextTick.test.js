import { addTestPassCount, assert } from './assert'

/**
 * nextTick 测试
 * @param {*} app 
 */
export function nextTickTest(app, testSuit) {
    app.$nextTick(() => {
        const isPass = assert('$nextTick', () => {
            return /["']b["']\s*:\s*10/.test(document.querySelector('h3').innerText)
        })

        addTestPassCount(testSuit, isPass)
    })
}
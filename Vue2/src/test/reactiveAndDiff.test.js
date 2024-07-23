import { addTestPassCount, assert } from './assert'

/**
 * 响应式与 diff 测试
 * @param {*} app 
 */
export function reactiveAndDiffTest(app, testSuit) {
    app.arr.push('Test Array')
    app.arr[1] = { test: 'arrTest' }
    app.arr[2].b = 10

    setTimeout(() => {
        app.arr[3][1].push('数组响应式嵌套设置')

        app.name = '新名字'
        app.age = 18

        const isPass = assert('响应式测试', () => {
            return (
                app.name === '新名字' &&
                app.age === 18 &&
                app.arr[3][1][0] === '数组响应式嵌套设置'
            )
        })

        addTestPassCount(testSuit, isPass)
    }, 1000)
}
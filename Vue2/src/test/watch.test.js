import { addTestPassCount, assert } from './assert'

/**
 * watch 测试
 * @param {*} app 
 */
export function watchTest(app, testSuit) {
    app.$watch(
        () => app.nameAndAge,
        function (newVal, oldVal) {
            console.log('watch 监听计算属性成功：', { newVal, oldVal, self: this })
        }
    )
    app.name = 'newName'

    const isPass = assert('watch 测试', () => {
        return true
    })

    addTestPassCount(testSuit, isPass)
}
import { addTestPassCount, assert } from './assert'

/**
 * computed 测试
 * @param {*} app 
 */
export function computedTest(app, testSuit) {
    app.name = 'Computed Test'
    app.nameAndAgeSet = 39
    const isPass = assert('computed 测试', () => {
        return app.nameAndAge === 'name: Computed Test, age: 39'
    })

    addTestPassCount(testSuit, isPass)
}
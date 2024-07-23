import { addTestPassCount, assert } from './assert'

/**
 * method 测试
 * @param {*} app 
 */
export function methodTest(app, testSuit) {
    app.testMethod()
    const isPass = assert('methods 测试', () => {
        return app.name === 'methods test'
    })

    addTestPassCount(testSuit, isPass)
}
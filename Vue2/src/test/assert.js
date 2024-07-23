/**
 * 累加测试通过次数
 * @param {*} testSuit 
 * @param {*} isPass 
 */
export function addTestPassCount(testSuit, isPass) {
    if (isPass) testSuit.passLen++
    if (testSuit.len === testSuit.passLen) {
        alert('全部测试通过')
    }
}

/**
 * 单个测试断言
 * @param {*} msg 打印消息
 * @param {*} testFn 测试函数
 * @param {*} enableLog 是否打印日志
 */
export function assert(msg, testFn, enableLog = true) {
    const res = testFn()
    if (res) {
        if (enableLog) pass(msg)
        return true
    }

    return false
}

function pass(msg) {
    console.log(`%c${msg} 测试通过`, 'color: #f00')
    console.log('='.repeat(80))
}

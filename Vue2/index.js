import Vue from '@/Vue'


module.hot && module.hot.accept()

const app = new Vue({
    el: '#app',

    data() {
        return {
            name: 'CJL',
            age: 23,
            obj: {
                a: { b: 'b' },
                arr: [1, 2, { obj: {} }]
            },
            arr: [1, { a: 1 }, { b: 2 }, ['nested', []]]
        }
    },

    // template: `<div id="#app"></div>`,

    computed: {
        nameAndAge() {
            // console.log('computed get...')
            return `name: ${this.name}, age: ${this.age}`
        },
        nameAndAgeSet: {
            get() {
                return `name: ${this.name}, age: ${this.age}`
            },
            set(age) {
                this.age = age
            }
        }
    },

    watch: {
        name(newVal, oldVal) {
            console.log('watch 测试', { newVal, oldVal, self: this })
        }
    },

    methods: {
        testMethod() {
            this.name = 'methods test'
        }
    }
})

window.app = app


/** ================== 测试 ================== */

const LEN = 5
let passLen = 0;

(() => {
    /** 响应式 & `diff` 测试 */
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

        if (isPass) passLen++
        if (LEN === passLen) {
            alert('全部测试通过')
        }
    }, 1000)
})();


(() => {
    app.$nextTick(() => {
        const isPass = assert('$nextTick', () => true)

        if (isPass) passLen++
    })
})();


(() => {
    /** computed 测试 */
    app.name = 'Computed Test'
    app.nameAndAgeSet = 39
    const isPass = assert('computed 测试', () => {
        return app.nameAndAge === 'name: Computed Test, age: 39'
    })

    if (isPass) passLen++
})();


(() => {
    /** watch 测试 */
    app.$watch(() => app.nameAndAge, function (newVal, oldVal) {
        console.log({ newVal, oldVal, self: this })
    })
    app.name = 'newName'

    const isPass = assert('watch 测试', () => {
        return true
    })

    if (isPass) passLen++
})();


(() => {
    // **methods**测试
    app.testMethod()
    const isPass = assert('methods 测试', () => {
        return app.name === 'methods test'
    })

    if (isPass) passLen++
})()



function assert(msg, fn, log = true) {
    const res = fn()
    if (res) {
        if (log) pass(msg)
        return true
    }
    return false
}

function pass(msg) {
    console.log(`%c${msg} 测试通过`, 'color: #f00')
    console.log('='.repeat(80))
}

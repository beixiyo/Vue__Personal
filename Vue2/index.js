import Vue from '@/Vue'
import {
    reactiveAndDiffTest,
    nextTickTest,
    computedTest,
    watchTest,
    methodTest
} from '@/test'


module.hot && module.hot.accept()

const app = new Vue({
    el: '#app',

    data() {
        return {
            name: 'CJL',
            age: 23,
            obj: {
                a: { b: 'b' },
                arr: [
                    1, 2,
                    { obj: {} }
                ]
            },
            arr: [
                1,
                { a: 1 },
                { b: 2 },
                ['nested', []]
            ]
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
            console.log('watch 监听属性成功', { newVal, oldVal, self: this })
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

const testSuit = {
    len: 5,
    passLen: 0
}

reactiveAndDiffTest(app, testSuit)
nextTickTest(app, testSuit)
computedTest(app, testSuit)
watchTest(app, testSuit)
methodTest(app, testSuit)

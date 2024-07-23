import { isStr } from '@/utils/tools'
import asyncFn from "@/utils/asyncFn"
import { popWatcher, pushWatcher } from "./Dep"


let id = 0

export default class Watcher {

    /** Vue 实例 */
    vm
    id = id++

    /**
     * 视图渲染函数
     */
    getter

    /** 是否立刻执行 */
    lazy
    /** 配置项 */
    opts
    /** 回调函数 */
    cb
    /** 响应式属性的 Dep */
    deps = new Set()

    /**
     * - 收集组件渲染函数
     * - 每个组件有一个 Watcher
     * - 每个 Watcher 有 n 个 Dep
     * 
     * @param {*} vm Vue 实例
     * @param {*} fn 渲染函数、计算属性函数、watch 键值
     * @param {{ dirty: boolean; isWatch: boolean }} opts 配置项
     * @param {*} cb 
     */
    constructor(vm, fn, opts, cb) {
        this.vm = vm
        this.cb = cb

        /**
         * 键值统一转成函数，取到实例对应属性
         */
        this.getter = isStr(fn)
            ? () => vm[fn]
            : fn

        this.lazy = opts.dirty
        this.opts = opts

        !this.lazy && this.get()
    }

    /**
     * 在响应式数据 getter 前
     * 把当前 Wacher 记录下来
     * 等待当前渲染执行后，再取消记录当前 Watcher
     */
    get() {
        pushWatcher(this)
        this.value = this.getter.call(this.vm)
        popWatcher()
    }

    evaluate() {
        this.get()
        this.opts.dirty = false
    }

    /**
     * 收集响应式属性的 Dep
     */
    addDep(dep) {
        this.deps.add(dep)
    }

    depend() {
        const depArr = [...this.deps]
        let i = depArr.length
        while (i--) {
            /**
             * 让计算属性 watcher，也收集渲染 watcher
             */
            depArr[i].depend()
        }
    }

    /**
     * 修改属性触发
     */
    update() {
        // 如果是计算属性，则标记脏值，下次视图渲染重新取值
        if (this.lazy) {
            this.opts.dirty = true
        }
        else {
            // 加入去重队列，异步执行 `this.run`
            queueWatcher(this)
        }
    }

    run() {
        const oldVal = this.value
        this.get()
        const newVal = this.value

        if (this.opts.isWatch) {
            this.cb.call(this.vm, newVal, oldVal)
        }
    }
}


const queues = new Set()
let pending = false

/**
 * 去重 watcher 后异步批处理更新
 * @param {*} watcher 
 */
function queueWatcher(watcher) {
    queues.add(watcher)
    if (!pending) {
        asyncFn(execQueue)
        pending = true
    }
}

function execQueue() {
    queues.forEach((q) => q.run())
    pending = false
    queues.clear()
}
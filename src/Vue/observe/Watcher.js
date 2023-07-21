import asyncFn from "../../utils/asyncFn";
import { popWatcher, pushWatcher } from "./Dep";


let id = 0;

/**
 * 收集视图渲染函数
 */
export default class Watcher {
    /**
     * `fn`是渲染函数、计算属性函数、watch键值
     */
    constructor(vm, fn, opts, cb) {
        this.id = id++;
        this.vm = vm;
        this.cb = cb;

        // `watch`键值统一转成函数 取到实例对应属性
        this.getter = typeof fn === 'string'
            ? function () { return vm[fn]; }
            : fn;

        this.lazy = opts.dirty;
        this.opts = opts;
        this.deps = new Set();

        !this.lazy && this.get();
    }

    /**
     * 在响应式数据`getter`前 把自己挂在`Dep`上 方便收集依赖
     */
    get() {
        pushWatcher(this);
        this.value = this.getter.call(this.vm);
        popWatcher();
    }

    evaluate() {
        this.get();
        this.opts.dirty = false;
    }

    addDep(dep) {
        this.deps.add(dep);
    }

    depend() {
        const depArr = [...this.deps];
        let i = depArr.length;
        while (i--) {
            depArr[i].depend(); // 让计算属性watcher 也收集渲染watcher
        }
    }

    /**
     * 修改属性触发
     */
    update() {
        // 如果是计算属性 则标记脏值 下次视图渲染重新取值
        if (this.lazy) {
            this.opts.dirty = true;
        }
        else {
            // 加入去重队列 异步执行`this.run`
            queueWatcher(this);
        }
    }

    run() {
        const oldVal = this.value;
        this.get();
        const newVal = this.value;

        if (this.opts.isWatch) {
            this.cb.call(this.vm, newVal, oldVal);
        }
    }
}


const queues = new Set();
let pending = false;

function queueWatcher(watcher) {
    queues.add(watcher);
    if (!pending) {
        asyncFn(execQueue);
        pending = true;
    }
}

function execQueue() {
    queues.forEach((q) => q.run());
    pending = false;
    queues.clear();
}
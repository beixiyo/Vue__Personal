let id = 0
const stack = []

/**
 * - 收集 Watcher
 * - 每个响应式属性，都有一个数组收集 watcher
 * - 调用 depend 方法，把当前响应式属性的 watcher 添加到数组中
 * - 这样就实现了一个响应式属性，对应多个组件，当属性改变，会触发 watcher 的更新
 */
export default class Dep {

    watchers = new Set()
    id = id++

    /** 当前正在收集的 Watcher */
    static watcher = null

    /**
     * 调用响应式数据 getter 时，收集 Watcher
     */
    depend() {
        this.watchers.add(Dep.watcher)
        Dep.watcher.addDep(this)
    }

    /**
     * 执行每个 watcher 的渲染函数
     */
    notify() {
        this.watchers.forEach((w) => w.update())
    }
}

/**
 * 栈放入 Watcher，并记录当前 Wachter
 * @param {*} watcher 
 */
export function pushWatcher(watcher) {
    stack.push(watcher)
    Dep.watcher = watcher
}

/**
 * 栈弹出 Watcher，并记录当前 Wachter
 */
export function popWatcher() {
    stack.pop()
    Dep.watcher = stack.at(-1)
}
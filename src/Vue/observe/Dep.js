let id = 0;

/**
 * 收集`watcher`
 */
export default class Dep {
    constructor() {
        this.id = id++;
        this.watchers = new Set();
    }

    /**
     * 调用响应式数据`getter`时 收集依赖
     */
    depend() {
        this.watchers.add(Dep.watcher)
        Dep.watcher.addDep(this)
    }

    /**
     * 执行每个`watch`的渲染函数
     */
    notify() {
        this.watchers.forEach((w) => w.update())
    }
}

Dep.watcher = null;
const stack = [];

export function pushWatcher(watcher) {
    stack.push(watcher);
    Dep.watcher = watcher
}

export function popWatcher() {
    stack.pop()
    Dep.watcher = stack.at(-1)
}
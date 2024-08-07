import Watcher from "../observe/Watcher"


/**
 * 更新和挂载节点
 */
export default function (vm, el) {
    vm.$el = el
    /**
     * 在 `/src/Vue/lifeCycle/initLifeCycle.js` 定义的
     */
    const updateComp = () => {
        vm._update(vm._render())
    }

    new Watcher(vm, updateComp, { isRender: true })
}
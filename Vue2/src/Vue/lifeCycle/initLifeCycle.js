import { isObj } from '@/utils/tools'
import { createElVNode, createTxtVNode } from "../vDOM"
import { patch } from "../vDOM/patch"

export default function (Vue) {

    /**
     * 把传入的虚拟转换成真实节点 并挂载到根元素
     * @param {object} vNode 解析配置数据后的虚拟`DOM`
     */
    Vue.prototype._update = function (vNode) {
        const vm = this,
            el = vm.$el,
            prevvNode = vm._vNode

        vm._vNode = vNode
        /**
         * 存储新的 vNode 到 $el 并渲染，下次直接 update 使用
         */
        if (prevvNode) {
            vm.$el = patch(prevvNode, vNode)
        }
        else {
            vm.$el = patch(el, vNode)
        }
    }

    /**
     * 返回解析模板数据后的虚拟节点 `Vue/render/init/$mount` 里定义的
     */
    Vue.prototype._render = function () {
        return this.$options.render.call(this)
    }

    Vue.prototype._createEl = function () {
        return createElVNode(this, ...arguments)
    }

    Vue.prototype._createTxt = function () {
        return createTxtVNode(this, ...arguments)
    }

    Vue.prototype._parseExpr = function (value) {
        if (!isObj(value)) return value
        return JSON.stringify(value)
    }
}

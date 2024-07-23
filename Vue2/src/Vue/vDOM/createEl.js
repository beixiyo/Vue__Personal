import { isStr } from '@/utils/tools'
import { patchProps } from "./patch"


/**
 * 递归创建真实节点
 */
export function createEl(vNode) {
    const { tagName, children, text, data } = vNode

    if (isStr(tagName)) {
        vNode.el = document.createElement(tagName)
        patchProps(vNode.el, data)

        children.forEach((c) => vNode.el.appendChild(createEl(c)))
    }
    else {
        vNode.el = document.createTextNode(text)
    }

    return vNode.el
}
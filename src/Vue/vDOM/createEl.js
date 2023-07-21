import { patchProps } from "./patch";


/**
 * 递归创建真实节点
 */
export function createEl(vNode) {
    const { tagName, children, text, data } = vNode;
    if (typeof tagName === 'string') {
        vNode.el = document.createElement(tagName);
        patchProps(vNode.el, data);
        children.forEach((c) => vNode.el.appendChild(createEl(c)));
    }
    else {
        vNode.el = document.createTextNode(text);
    }
    return vNode.el;
}
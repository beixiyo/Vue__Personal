import { isSameVNode } from "."
import { createEl } from "./createEl"


/**
 * diff 比较与 vNode 转 DOM
 * @param {*} oldNode 
 * @param {*} vNode 
 * @returns 
 */
export function patch(oldNode, vNode) {
    /**
     * 如果是真实 DOM 元素
     */
    const isRealEl = oldNode.nodeType

    if (isRealEl) {
        const el = oldNode,
            parent = el.parentNode,
            newEl = createEl(vNode)

        parent.insertBefore(newEl, el.nextSibling)
        el.remove()
        return newEl
    }
    else {
        // diff
        patchVNode(oldNode, vNode)
    }
}

/**
 * - 不是同一个节点，直接替换
 * - 同一个节点，比较 Tag 和 Key
 *      - 相同则复用，并对比属性
 *      - 不相同则创建新的
 * 
 * - 文本，则直接替换文本
 */
function patchVNode(oldNode, vNode) {
    if (!isSameVNode(oldNode, vNode)) { // 标签和`key`都不同，直接舍弃
        const newEl = createEl(vNode)
        oldNode.el.parentNode.replaceChild(newEl, oldNode.el)
        return newEl
    }

    const el = vNode.el = oldNode.el
    if (!oldNode.tagName) { // 是文本，直接替换旧节点的内容
        if (oldNode.text !== vNode.text) {
            el.textContent = vNode.text
        }
    }

    // 是标签 替换属性
    patchProps(el, vNode.data, oldNode.data)

    /**
     * 子节点比较
     */
    const oldChildren = oldNode.children || [],
        newChildren = vNode.children || []

    // 都有子节点 完整比较
    if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(el, newChildren, oldChildren)
    }
    else if (newChildren.length > 0) { // 只有新的 添加
        mountChildren(el, newChildren)
    }
    else if (oldChildren.length > 0) { // 没有新的 删除旧的
        el.innerHTML = ''
    }
}

/**
 * 双端指针对比
 * - 比较 两端头指针，相同则两个指针都向后移动
 * - 当头指针大于尾指针，则结束，并把新的子节点插入，老的删除
 */
function updateChildren(el, newChildren, oldChildren) {
    let oldStIndex = 0,
        oldEndIndex = oldChildren.length - 1,
        newStIndex = 0,
        newEndIndex = newChildren.length - 1

    let oldStNode = oldChildren[oldStIndex],
        oldEndNode = oldChildren[oldEndIndex],
        newStNode = newChildren[newStIndex],
        newEndNode = newChildren[newEndIndex]

    const map = createMapByKey(oldChildren)

    // 头指针小于尾指针
    while (oldStIndex <= oldEndIndex && newStIndex <= newEndIndex) {
        if (!oldStNode) {
            oldStNode = oldChildren[++oldStIndex]
        }
        else if (!oldEndNode) {
            oldEndNode = oldChildren[--oldEndIndex]
        }
        // 头节点对比
        else if (isSameVNode(oldStNode, newStNode)) {
            patchVNode(oldStNode, newStNode)
            oldStNode = oldChildren[++oldStIndex]
            newStNode = newChildren[++newStIndex]
        }
        else if (isSameVNode(oldEndNode, newEndNode)) {
            patchVNode(oldEndNode, newEndNode)
            oldEndNode = oldChildren[--oldEndIndex]
            newEndNode = newChildren[--newEndIndex]
        }
        else if (isSameVNode(oldEndNode, newStNode)) {
            patchVNode(oldEndNode, newStNode)
            el.insertBefore(oldEndNode.el, oldStNode.el)
            oldEndNode = oldChildren[--oldEndIndex]
            newStNode = newChildren[++newStIndex]
        }
        else if (isSameVNode(oldStNode, newEndNode)) {
            patchVNode(oldStNode, newEndNode)
            el.insertBefore(oldStNode.el, oldEndNode.el.nextSibling)
            oldStNode = oldChildren[++oldStIndex]
            newEndNode = newChildren[--newEndIndex]
        }
        // 交叉比对
        else {
            let moveIndex = map[newStNode.key] // 如果拿到则说明是要移动的索引
            if (moveIndex !== undefined) {
                let moveVnode = oldChildren[moveIndex] // 找到对应的虚拟节点 复用
                el.insertBefore(moveVnode.el, oldStNode.el)
                oldChildren[moveIndex] = undefined // 表示这个节点已经移动走了
                patchVNode(moveVnode, newStNode) // 比对属性和子节点
            }
            else {
                el.insertBefore(createEl(newStNode), oldStNode.el)
            }
            newStNode = newChildren[++newStIndex]
        }
    }

    /**
     * 添加新的节点
     */
    if (newStIndex <= newEndIndex) {
        for (let i = newStIndex; i <= newEndIndex; i++) {
            const childEl = createEl(newChildren[i])
            el.appendChild(childEl)

            const anchor = newChildren[newEndIndex + 1].el || null
            el.insertBefore(childEl, anchor)
        }
    }
    /**
     * 删除老的节点
     */
    if (oldStIndex <= oldEndIndex) {
        for (let i = oldStIndex; i <= oldEndIndex; i++) {
            const child = oldChildren[i]
            child && el.removeChild(child.el)
        }
    }
}

/**
 * 全部对比不上，则创建映射表
 * @example
 * { key: index }
 */
function createMapByKey(children) {
    const map = {}
    children.forEach((child, index) => {
        map[child.key] = index
    })
    return map
}

function mountChildren(el, childern) {
    for (const c of childern) {
        el.appendChild(createEl(c))
    }
}

export function patchProps(el, newProps, oldProps) {
    const newStyle = newProps?.style,
        oldStyle = oldProps?.style

    /**
     * 新样式中没有旧样式，删除
     */
    for (const key in oldStyle) {
        if (!Object.hasOwnProperty.call(oldStyle, key)) continue
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }

    /**
     * 新属性中没有旧属性，删除
     */
    for (const key in oldProps) {
        if (!Object.hasOwnProperty.call(oldProps, key)) continue
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }

    /**
     * 新的覆盖旧属性
     */
    for (const key in newProps) {
        if (!Object.hasOwnProperty.call(newProps, key)) continue

        if (key === 'style') {
            for (const styleName in newProps.style) {
                if (!Object.hasOwnProperty.call(newProps.style, styleName)) continue
                el.style[styleName] = newProps.style[styleName]
            }
        }
        else {
            el.setAttribute(key, newProps[key])
        }
    }

    return el
}
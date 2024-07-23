import { isComponent } from '@/utils/tools'

export function createElVNode(vm, tagName, data, ...children) {
    data ??= {}
    const key = data.key
    key && delete data.key

    if (!isComponent(tagName)) {
        return vNode(vm, tagName, key, data, children)
    }

    const CompConstructor = vm.$options.components[tagName]
    return createCompVNode(vm, CompConstructor, key, data, children)
}

function createCompVNode(vm, CompConstructor, key, data, children) {

}

export function createTxtVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)
}

function vNode(vm, tagName, key, data, children, text) {
    return {
        vm, tagName, key, data, children, text
    }
}

export function isSameVNode(vnode1, vnode2) {
    return vnode1.tagName === vnode2.tagName &&
        vnode1.key === vnode2.key
}
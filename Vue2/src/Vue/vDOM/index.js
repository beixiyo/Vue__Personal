export function createElVNode(vm, tagName, data, ...children) {
    data ??= {};
    const key = data.key;
    key && delete data.key;

    return vNode(vm, tagName, key, data, children);
}

export function createTxtVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text);
}

function vNode(vm, tagName, key, data, children, text) {
    return {
        vm, tagName, key, data, children, text
    };
}

export function isSame(vnode1, vnode2) {
    return vnode1.tagName === vnode2.tagName && vnode1.key === vnode2.key;
}
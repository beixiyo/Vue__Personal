import { isStr } from '@/utils/tools'

export default function (vm, watch) {
    for (const key in watch) {
        if (!Object.hasOwnProperty.call(watch, key)) continue

        const fn = watch[key]
        // watch 键值可以是数组，监听多个
        if (Array.isArray(fn)) {
            for (const item of fn) {
                createWatch(vm, key, item)
            }
        }
        else {
            createWatch(vm, key, fn)
        }
    }
}

function createWatch(vm, key, fn) {
    // watch 键值是函数或者字符串
    if (isStr(fn)) {
        fn = vm[fn]
    }
    return vm.$watch(key, fn)
}

import { defineNoEnum } from "../../utils/tools"

export default function (vm) {
    const methods = vm.$options.methods
    if (!methods) {
        return
    }

    for (const key in methods) {
        if (!Object.hasOwnProperty.call(methods, key)) continue

        const m = methods[key]
        defineNoEnum(vm, key, m.bind(vm))
    }
}
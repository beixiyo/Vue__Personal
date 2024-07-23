import { defineNoEnum, isObj } from '@/utils/tools'
import newArrProto from './arrProto'
import Dep from './Dep'


class Observer {

    constructor(data) {
        /**
         * 不可枚举的内部属性，防止递归代理死循环
         */
        defineNoEnum(data, '__ob__', this)
        /**
         * 让数组也有依赖收集
         */
        defineNoEnum(this, 'dep', new Dep())

        /**
         * 给数组重写方法时
         * 定义响应式 
         * 以及判断数据是否代理过
         * 
         * 不会对数组的每一项进行监听，因为太耗性能
         * 而是修改数组的原型方法，如 push pop splice 等等
         */
        if (Array.isArray(data)) {
            Object.setPrototypeOf(data, newArrProto)
            this.observeArr(data)
        }
        else {
            this.walk(data)
        }
    }

    walk(data) {
        Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
    }

    observeArr(arr) { // 仅监控数组内的引用值
        arr.forEach((item) => observe(item))
    }
}

/**
 * 观测数据
 */
export default function observe(data) {
    if (!isObj(data)) return

    if (data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
        return data.__ob__
    }
    return new Observer(data)
}

/**
 * 定义响应式数据
 */
export function defineReactive(tar, key, value) {
    const dep = new Dep(),
        childOb = observe(value) // 深度递归代理

    Object.defineProperty(tar, key, {
        /**
         * 执行到这时，外部已经记录当前的组件的 Watcher
         * 在 new Watcher 时，就已经把当前 Watcher 记录在 Dep 上了
         */
        get() {
            if (Dep.watcher) {
                dep.depend()

                // 收集数组依赖
                childOb && childOb.dep.depend()
                Array.isArray(value) && dependArr(value)
            }
            return value
        },
        set(newVal) {
            if (newVal === value) {
                return
            }
            value = newVal
            dep.notify()
        }
    })
}

/**
 * 递归嵌套数组响应式
 * @param {*} arr 
 */
function dependArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i]
        // 只有对象存在`__ob__`
        cur.__ob__?.dep.depend()
        Array.isArray(cur) && dependArr(cur)
    }
}
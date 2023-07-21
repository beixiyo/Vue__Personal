import { defineNoEnum } from '@/utils/tools';
import newArrProto from './arrProto';
import Dep from './Dep';


class Observer {
    constructor(data) {
        // 给数组重写方法时 定义响应式 以及判断数据是否代理过
        defineNoEnum(data, '__ob__', this);
        defineNoEnum(this, 'dep', new Dep());

        if (Array.isArray(data)) {
            Object.setPrototypeOf(data, newArrProto);
            this.observeArr(data);
        }
        else {
            this.walk(data);
        }
    }

    walk(data) {
        Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
    }

    observeArr(arr) { // 仅监控数组内的引用值
        arr.forEach((item) => observe(item));
    }
}

export default function observe(data) {
    if (typeof data !== 'object') {
        return;
    }

    if (data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
        return data.__ob__;
    }
    return new Observer(data);
}

export function defineReactive(tar, key, value) {
    const dep = new Dep(),
        childOb = observe(value); // 深度递归代理
    Object.defineProperty(tar, key, {
        get() {
            if (Dep.watcher) {
                dep.depend();

                // 收集数组依赖
                childOb && childOb.dep.depend();
                Array.isArray(value) && dependArr(value);
            }
            return value;
        },
        set(newVal) {
            if (newVal === value) {
                return;
            }
            value = newVal;
            dep.notify();
        }
    });
}

function dependArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        // 只有对象存在`__ob__`
        cur.__ob__?.dep.depend();
        Array.isArray(cur) && dependArr(cur);
    }
}
import { getType } from "@/utils/tools";
import Watcher from "../../observe/Watcher";
import Dep from "../../observe/Dep";


export default function initComputed(vm, computed) {
    vm._computedWatcher = {};
    for (const key in computed) {
        if (!Object.hasOwnProperty.call(computed, key)) continue;

        const c = computed[key];
        if (!['object', 'function'].includes(getType(c))) {
            throw TypeError('computed of property must be object or function');
        }

        const get = typeof c === 'function' ? c : c.get,
            set = c.set || (() => { });

        vm._computedWatcher[key] = new Watcher(vm, get, { dirty: true });
        defineComputed(vm, key, get, set);
    }
}

function defineComputed(vm, key, get, set) {
    get = createGetter(vm, key);
    Object.defineProperty(vm, key, {
        get, set
    });
}

function createGetter(vm, key) {
    const watcher = vm._computedWatcher[key];

    return function () {
        if (watcher.opts.dirty) {
            watcher.evaluate();
        }
        Dep.watcher && watcher.depend()
        return watcher.value;
    };
}
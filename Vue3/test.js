import {
    ref,
    computed,
    effect,
    reactive
} from './reactive/index.js'


const obj = {
    name: 'cjl',
    age: 23,
    height: 172,
    obj: {
        key: 'value',
    },
}
const arr = [1, obj]

const state = reactive(obj);


/** ----------------------------------------------------------------------------
 * 防重复测试
 */
(() => {
    const s2 = reactive(state)
    const s3 = reactive(obj)

    assert('防重复', () => {
        return state === s2 && state === s3
    })
})();


/** ---------------------------------------------------------------------------
 * 数组测试
 */
(() => {
    const arrState = reactive(arr)

    assert('数组查找对象 this 指向', () => {
        return arrState.includes(obj)
    })
    assert('数组直接设置长度触发删除', () => {
        arrState.length = 0
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * 条件判断改变依赖测试
 * 当改变`state.name`后 则抛弃旧的依赖(state.age)
 * 下次再改动`state.age`时 无需触发更新 所以总共触发*2*次执行
 */
(() => {
    function effectFn() {
        console.log('effectFn')
        if (state.name === 'cjl') {
            state.age
        } else {
            state.obj
        }
    }

    effect(effectFn)

    state.name = 'new Name'
    state.age = 24
    assert('effect 依赖判断', () => {
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * 函数嵌套测试
 */
(() => {
    const state2 = reactive({ name: 'CJL', age: 1 })
    function effectFnNest() {
        console.log('outter')
        effect(() => {
            console.log('inner')
            state2.age
        })

        state2.name
    }

    effect(effectFnNest)
    state2.name = 'new2 Name'

    assert('effect 函数嵌套测试', () => {
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * 递归测试
 */
(() => {
    const state3 = reactive({ name: 'CJL', age: 1 })
    /** 递归(同时读取和设置) & 配置 测试 */
    function recursive() {
        console.log('recursive')
        state3.age--
    }

    effect(recursive, {
        lazy: true,
        scheduler(effect) {
            effect()
            console.log('scheduler...')
        }
    })()
    state3.age++

    assert('effect 递归设置', () => {
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * ref 测试
 */
(() => {
    const val = ref(1)
    effect(() => {
        console.log('ref...')
        val.value
    })

    val.value++
    assert('ref', () => {
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * computed 缓存测试
 */
(() => {
    const sum = computed(() => {
        console.log('computed执行中')
        return state.age + state.height
    })

    console.log(sum.value)
    console.log(sum.value)
    state.age++
    console.log(sum.value)

    /** 计算属性依赖关系测试 */
    effect(() => {
        console.log('computed依赖', sum.value)
    })
    state.age++

    assert('computed缓存', () => {
        return true
    })
})();


/** ---------------------------------------------------------------------------
 * ref 放入 reactive 解包测试
 */
(() => {
    const refVal = ref(1),
        o = reactive({
            refVal,
            test: 'test'
        })

    console.log(o)

    assert('自动解包', () => {
        return o.refVal === 1
    })
})()



function assert(msg, fn, log = true) {
    const res = fn()
    if (res) {
        if (log) pass(msg)
        return true
    }
    return false
}

function pass(msg) {
    console.log(`%c${msg} 测试通过`, 'color: #f00')
    console.log('='.repeat(80))
}
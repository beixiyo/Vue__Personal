import { component } from './component'
import { extend } from './extend'

/**
 * 扩展静态方法
 */
export function initGlobalApi(Vue) {
    Vue.options = {
        components: {},
        _base: Vue
    }

    Vue.Mixin = function (mixin) {
        this.options = mergeOpts(this.options, mixin)
        return this
    }

    Vue.extend = extend(Vue)
    Vue.component = component(Vue)
}


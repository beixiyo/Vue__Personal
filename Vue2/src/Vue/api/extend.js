import { mergeOpts } from '@/utils/mergeOpts'

export function extend(Vue) {

    return function (options) {
        function Sub(opts = {}) {
            this._init(opts)
        }

        Sub.prototype = Object.create(Vue.prototype)
        Sub.prototype.constructor = Sub
        /**
         * 合并 options，找不到当前组件则找父组件
         */
        Sub.options = mergeOpts(Vue.options, options)

        return Sub
    }
}
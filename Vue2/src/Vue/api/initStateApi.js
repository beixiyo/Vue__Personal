import Watcher from '../observe/Watcher'
import nextTick from './nextTick'


export function initStateApi(Vue) {

    Vue.prototype.$watch = function (key, watchCallback, opts = { isWatch: true }) {
        new Watcher(this, key, opts, watchCallback)
    }

    Vue.prototype.$nextTick = nextTick.bind(this)
}
import Watcher from "../observe/Watcher";
import nextTick from "./nextTick";

export function initApi(Vue) {
    Vue.prototype.$nextTick = nextTick.bind(this);

    Vue.prototype.$watch = function (key, cb, opts = { isWatch: true }) {
        new Watcher(this, key, opts, cb);
    };
}


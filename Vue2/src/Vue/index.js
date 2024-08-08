import { initStateApi } from './api/initStateApi'
import initLifeCycle from './lifeCycle/initLifeCycle'
import { initMixin } from './render/init'


export default function Vue(opts) {
    this._init(opts)
}

initMixin(Vue)
initLifeCycle(Vue)
initStateApi(Vue)

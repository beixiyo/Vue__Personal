import { initApi } from "./api"
import initLifeCycle from "./lifeCycle/initLifeCycle"
import { initMixin } from "./render/init"


export default function Vue(opts) {
    this._init(opts)
}

initMixin(Vue)
initLifeCycle(Vue)
initApi(Vue)

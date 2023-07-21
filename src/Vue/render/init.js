import { compileToFunc } from '../compiler';
import { mountComp } from '../lifeCycle';
import initMethods from './initMethods';
import initState from './initState';

export function initMixin(Vue) {

    Vue.prototype._init = function (opts) {
        this.$options = opts;

        initState(this);
        initMethods(this);
        opts.el && this.$mount(opts.el);
    };

    Vue.prototype.$mount = function (el) {
        let template;
        el = document.querySelector(el);
        const opts = this.$options;

        if (!opts.render) {
            if (!opts.el) {
                return;
            }

            if (!opts.template) {
                // `outerHTML`会导致单闭合标签尾部消失 **<input /> '/'会自动删除**
                template = el.outerHTML;
            }
            else {
                template = opts.template;
            }
        }

        if (template) {
            opts.render = compileToFunc(template); // 最终都是把模板转成渲染函数
        }

        mountComp(this, el);
    };
}

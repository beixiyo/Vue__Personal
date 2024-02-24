import initComputed from "./initComputed";
import initData from "./initData";
import initWatch from "./initWatch";

export default function initState(vm) {
    const opts = vm.$options;

    opts.data && initData(vm, opts.data);
    opts.computed && initComputed(vm, opts.computed);
    opts.watch && initWatch(vm, opts.watch);
}
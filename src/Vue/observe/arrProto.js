const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort',
];

const rawArrProto = Array.prototype,
    newArrProto = Object.create(rawArrProto);

methods.forEach((m) => {
    newArrProto[m] = function (...args) {
        let observeArgs;
        const ob = this.__ob__,
            res = rawArrProto[m].apply(this, args);

        switch (m) {
            case 'push':
            case 'unshift':
                observeArgs = args;
                break;
            case 'splice':
                observeArgs = args.slice(2);
                break;

            default:
                break;
        }

        ob.observeArr(observeArgs);
        ob.dep.notify();
        return res;
    };
});

export default newArrProto;
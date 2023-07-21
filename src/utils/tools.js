const toCamel = key => key.replace(/-[a-z]/g , res => res[1].toUpperCase())

const getType = tar => Object.prototype.toString.call(tar).slice(8, -1).toLowerCase();

const singleTagElements = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];

function defineNoEnum(tar, key, val) {
    Object.defineProperty(tar, key, {
        value: val,
        enumerable: false
    });
}

export {
    toCamel,
    getType,
    defineNoEnum,
    singleTagElements
}
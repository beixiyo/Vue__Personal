const strats = {
    components(parent, child) {
        const res = Object.create(parent)

        if (child) {
            for (const k in child) {
                const item = child[k]
                res[key] = item
            }
        }
    }
}

/**
 * 合并两个选项对象的函数
 * 
 * 此函数用于合并父选项和子选项，以创建一个新的合并后的选项对象
 * 它支持特定的策略函数来处理特定字段的合并逻辑
 * 
 * @param {Object} parent 父选项对象，其属性将被合并到新对象中
 * @param {Object} child 子选项对象，其属性将覆盖父选项对象中的相应属性
 * @returns {Object} 返回一个新的合并后的选项对象
 */
export function mergeOpts(parent, child) {
    const opts = {}

    for (const k in parent) {
        mergeField(k)
    }
    for (const k in child) {
        if (!Object.hasOwnProperty.call(child, k)) {
            mergeField(key)
        }
    }

    function mergeField(key) {
        if (strats[key]) {
            opts[key] = strats[key](parent[key], child[key])
        }
        else {
            opts[key] = child[key] || parent[key]
        }
    }

    return opts
}

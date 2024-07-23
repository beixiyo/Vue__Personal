import parseHTML from "./parseHTML"
import { toCamel } from "@/utils/tools"
import { EL_TYPE, TEXT_TYPE } from "@/utils/nodeTypes"


/**
 * @returns
 * 返回解析配置数据后的虚拟 `DOM` 字符串
 * 放入 with 语句中并绑定函数
 * 最终放在 `vm.options._render`
 */
export function compileToFunc(template) {
    /**
     * `ast`描述编译模板类型、内容等
     * 这一步尚未对模板语法解析 如 `{{ value }}`
     */
    const ast = parseHTML(template),
        code = `with(this){return ${genCode(ast)}}`,
        // `render`使用`with`绑定`this`解析模板内容
        render = new Function(code)

    return render
}

function genCode(ast) {
    const { tagName, attrs, children } = ast
    const _children = genChildren(ast.children)
    if (!tagName) {
        return
    }

    return `_createEl('${tagName}', ${attrs?.length > 0
        ? genAttrs(attrs)
        : null
        }${children?.length
            ? `,${_children}`
            : ''
        })`
}

function genAttrs(attrs) {
    const res = []
    for (const attr of attrs) {
        if (attr.name === 'style') {
            const styleVal = parseStyle(attr.value)
            res.push('style: ', styleVal)
        }
        else {
            res.push(attr.name, ': ', JSON.stringify(attr.value), ',')
        }
    }
    return '{' + res.join('') + '}'
}

function parseStyle(style) {
    const res = {},
        styleArr = style.split(';')
    for (const style of styleArr) {
        if (!style) {
            continue
        }
        let [key, value] = style.split(':')
        key = toCamel(key)
        res[key.trim()] = value.trim()
    }
    return JSON.stringify(res)
}

const exprReg = /\{\{((?:.|\r?\n)+?)\}\}/g
function genChildren(children) {
    return children.map(child => genChild(child)).join(',')
}

function genChild(node) {
    if (node.type === EL_TYPE) {
        return genCode(node)
    }
    else if (node.type === TEXT_TYPE) {
        let text = node.text
        if (!exprReg.test(text)) {
            return `_createTxt(${JSON.stringify(text)})`
        }

        /**
         * 解析变量文本
         */
        // _createTxt(_parseExpr(name) + 'hello' + _parseExpr(age))
        const tokens = []
        let match
        exprReg.lastIndex = 0
        let lastIndex = 0

        // split
        while (match = exprReg.exec(text)) {
            let index = match.index // 匹配的位置
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_parseExpr(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }

        /**
         * 普通文本
         */
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_createTxt(${tokens.join('+')})`
    }
}

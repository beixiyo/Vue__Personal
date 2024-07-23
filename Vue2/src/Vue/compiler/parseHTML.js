import { singleTagElements } from '@/utils/constants'


const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

/**
 * 开始标签名
 */
const startTagOpen = new RegExp(`^<${qnameCapture}`)
/**
 * <div> <br/>
 */
const startTagClose = /^\s*(\/?)>/
/**
 * 结束标签名
 */
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
/**
 * 第一个分组就是属性的 key 
 * value 就是 分组3/分组4/分组五
 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/


/**
 * 返回未对配置对象解析的`DOM`描述对象
 */
export default function (html) {
    const stack = []
    let curParent, root

    while (html) {
        /**
         * `> 0` 说明是文本结束索引
         * `= 0` 说明是开始/ 结束标签
         */
        let textEnd = html.indexOf('<')
        // 是开始/ 结束标签
        if (textEnd === 0) {
            const startTagMatch = parseStart()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)

                /**
                 * '/render/init.js' 使用了 `outerHTML`
                 * 导致单闭合标签消失，所以特殊处理
                 */
                if (singleTagElements.includes(startTagMatch.tagName)) {
                    end()
                }
                continue
            }

            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end()
                continue
            }
        }
        // 是文本结束索引
        else if (textEnd > 0) {
            const text = html.slice(0, textEnd)
            text && advance(text.length)
            txt(text)
        }
    }
    return root


    function advance(len) {
        html = html.slice(len)
    }

    function parseStart() {
        const start = html.match(startTagOpen)
        if (!start) return false

        advance(start[0].length)
        const match = {
            tagName: start[1],
            attrs: []
        }

        let attrs, endTag
        // 没有结尾标签 则一直匹配属性
        while (!(endTag = html.match(startTagClose)) && (attrs = html.match(attribute))) {
            advance(attrs[0].length)
            match.attrs.push({
                name: attrs[1],
                value: attrs[3] || attrs[4] || attrs[5] || true
            })
        }

        if (endTag) {
            advance(endTag[0].length)  // 匹配完所有属性后 删除开始标签的末尾 即`>`
        }
        return match
    }

    /**
     * - 用一个栈维护父子关系 
     * - 当匹配到末尾节点 删除栈中最后一个
     * - 当前父节点永远指向栈中最后一个节点
     * - `root`根节点，即最终的虚拟节点
     */
    function start(tagName, attrs) {
        const node = createAstEl(tagName, attrs)
        node.parent = stack.at(-1)
        !root && (root = node)

        curParent && curParent.children.push(node)
        stack.push(node)
        curParent = node
    }

    function txt(text) {
        text = text.trim()
        if (!text) {
            return
        }
        curParent.children.push({
            text,
            type: Element.TEXT_NODE,
            parent: curParent
        })
    }

    function end() {
        stack.pop()
        curParent = stack.at(-1)
    }
}


function createAstEl(tagName, attrs) {
    return {
        tagName,
        attrs,
        children: [],
        parent: null,
        type: Element.ELEMENT_NODE
    }
}
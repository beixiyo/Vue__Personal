import { TRAILING_SLASH_RE } from './contant'


/** 去除字符串末尾的 / */
export const removeTrailingSlash = (path: string) => path.replace(TRAILING_SLASH_RE, '')

/** 格式化基础路径 */
export function normalizeBase(base?: string): string {
    if (!base) {
        base = '/'
    }
    if (base[0] !== '/' && base[0] !== '#') {
        base = '/' + base
    }

    return removeTrailingSlash(base)
}

/** 从一个路径中去除基础路径 */
export function stripBase(pathname: string, base: string) {
    // 没有或开头一样则直接返回
    if (
        !base ||
        !pathname.toLowerCase().startsWith(base.toLowerCase())
    ) {
        return pathname
    }

    return pathname.slice(base.length) || '/'
}

/** 返回一个 `数组` 和一个 `添加数组函数` */
export function useCallback<T>() {
    /** 存储守卫回调 */
    const handlers: T[] = []

    function add(handler: T) {
        handlers.push(handler)
    }

    return {
        add,
        list: () => handlers
    }
}

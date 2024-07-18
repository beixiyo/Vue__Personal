import type { MatcherLocationAsPath } from 'vue-router'
import type { RouteRecordRaw, RouteRecordMatcher, RouteRecordNormalized } from './types'


/** 添加路由，并返回两个方法 */
export function createRouterMatcher(routes: Readonly<RouteRecordRaw[]>) {
    const matchers: RouteRecordMatcher[] = []
    routes.forEach((route) => addRoute(route))

    return {
        addRoute,
        resolve
    }

    function addRoute(route: RouteRecordRaw, parent?: RouteRecordMatcher) {
        const normalizedRecord = normalizeRouteRecord(route)

        if (parent) {
            normalizedRecord.path = parent.path + normalizedRecord.path
        }

        const matcher = createRouteRecordMatcher(normalizedRecord, parent)

        const children = normalizedRecord.children
        for (let i = 0; i < children.length; i++) {
            // 递归放入子级
            addRoute(children[i], matcher)
        }

        matchers.push(matcher)
    }

    /** 解析路由信息 */
    function resolve(location: MatcherLocationAsPath) {
        /** 存放匹配上的路由记录 */
        const matched: RouteRecordNormalized[] = []

        const path = location.path
        let matcher = matchers.find((m) => m.path === path)

        while (matcher) {
            matched.unshift(matcher.record)
            matcher = matcher.parent
        }
        
        return {
            path,
            matched
        }
    }
}


/** 格式化路由 */
function normalizeRouteRecord(record: RouteRecordRaw): RouteRecordNormalized {
    return {
        path: record.path,
        meta: record.meta || {},
        beforeEnter: record.beforeEnter,
        name: record.name || '',
        components: {
            default: record.component
        },
        children: record.children || [],
        leaveGuards: [],
        updateGuards: []
    }
}

/** 如果有父级，则把当前 Matcher 对象放入父级 children */
function createRouteRecordMatcher(record: RouteRecordNormalized, parent?: RouteRecordMatcher) {
    const matcher: RouteRecordMatcher = {
        path: record.path,
        record,
        parent,
        children: []
    }

    parent?.children.push(matcher)
    return matcher
}

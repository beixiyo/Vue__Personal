import type {
    RouterOptions,
    Router,
    ReactiveRoute,
    RouteLocationNormalized,
    RouteRecordNormalized,
    guardFn,
    Lazy
} from './types'
import { createRouterMatcher } from './matcher'
import { computed, reactive, shallowRef, unref, type App } from 'vue'
import { Route, Router as SymbolRouter, START_LOCATION_NORMALIZED } from './contant'
import { useCallback } from './utils'
import { RouterLink } from './components/router-link'
import { RouterView } from './components/router-view'


export function createRouter(options: RouterOptions): Router {
    const
        routerHistory = options.history,
        matcher = createRouterMatcher(options.routes),
        /** 当前路由 */
        currentRoute = shallowRef(START_LOCATION_NORMALIZED)

    /** 导航守卫 */
    const
        beforeGuards = useCallback(),
        beforeResolveGuards = useCallback(),
        afterGuards = useCallback()


    return {
        addRoute: matcher.addRoute,
        push,
        beforeEach: beforeGuards.add,
        afterEach: afterGuards.add,
        beforeResolve: beforeResolveGuards.add,

        install(app: App) {
            const router = this,
                appConfig = app.config.globalProperties as any

            // 绑定到 this.$router
            appConfig.$router = router
            Object.defineProperty(appConfig, '$route', {
                enumerable: true,
                get: () => unref(currentRoute)
            })

            /** 当前路由 */
            const reactiveRoute: ReactiveRoute = {}

            for (const key in START_LOCATION_NORMALIZED) {
                reactiveRoute[key] = computed(() => (currentRoute.value as any)[key])
            }

            app.provide(SymbolRouter, router as any)
            app.provide(Route, reactive(reactiveRoute))

            app.component('RouterLink', RouterLink)
            app.component('RouterView', RouterView)

            // 如果是初始安装 router 要先进行一次跳转
            if (currentRoute.value == START_LOCATION_NORMALIZED) {
                push(routerHistory.location as any)
            }
        }
    }


    /** 根据当前的路径解析信息 */
    function resolve(to: RouteLocationNormalized | string) {
        if (typeof to === 'string') {
            return matcher.resolve({
                path: to
            })
        }
        else {
            return matcher.resolve({
                path: to.path
            })
        }
    }

    /** 处理导航守卫 */
    async function navigateGuard(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        /** 进入，离开，更新 路由记录 */
        const [leavingRecords, updatingRecords, enteringRecords] = extractChangeRecords(to, from)

        /** 执行 beforeRouteLeave 守卫 */
        let guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from)

        for (const record of leavingRecords) {
            record.leaveGuards.forEach((guard) => {
                guards.push(guardToPromise(guard, to, from))
            })
        }

        /** 执行导航守卫队列 */
        return runGuardQueue(guards)
            .then(() => {
                guards = []
                // 不停的执行不同类型的守卫回调
                for (const guard of beforeGuards.list()) {
                    guards.push(guardToPromise(guard as guardFn, to, from, guard as RouteRecordNormalized))
                }
                return runGuardQueue(guards)
            })
            .then(() => {
                // 从组件上提取
                guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from)
                for (const record of updatingRecords) {
                    record.updateGuards.forEach((g) => guards.push(guardToPromise(g, to, from)))
                }
                return runGuardQueue(guards)
            })
            .then(() => {
                guards = []
                for (const record of to.matched) {
                    if (record.beforeEnter) {
                        guards.push(guardToPromise(record.beforeEnter, to, from, record))
                    }
                }
                return runGuardQueue(guards)
            })
            .then(() => {
                // 从组件上提取
                guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from)
                return runGuardQueue(guards)
            })
            .then(() => {
                guards = []
                for (const guard of beforeResolveGuards.list()) {
                    guards.push(guardToPromise(guard as guardFn, to, from, guard as RouteRecordNormalized))
                }
                return runGuardQueue(guards)
            })
    }

    /** 在 popstate 时触发 */
    function markAsReady() {
        routerHistory.listen((to) => {
            const targetLocation = resolve(to)
            const from = currentRoute.value
            finalizeNavigation(targetLocation, from, true)
        })
    }

    /** 最终的导航方法 */
    function finalizeNavigation(
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        replaced?: boolean
    ) {
        // 是否首次导航
        if (from === START_LOCATION_NORMALIZED || replaced) {
            routerHistory.replace(to.path)
            // 如果是首次导航，还要注入一个 listen 方法更新 currentRoute 的值
            markAsReady()
        }
        else {
            routerHistory.push(to.path)
        }

        currentRoute.value = to
    }

    function push(to: RouteLocationNormalized) {
        const targetLocation = resolve(to)
        const from = currentRoute.value

        navigateGuard(targetLocation, from)
            .then(() => {
                return finalizeNavigation(targetLocation, from)
            })
            // 执行完导航首位 并切换路由后
            .then(() => {
                for (
                    const guard of afterGuards.list() as Array<(
                        to: RouteLocationNormalized,
                        from: RouteLocationNormalized
                    ) => void>
                ) {
                    guard(to, from)
                }
            })
    }
}


/** 提取 `进入 | 离开 | 更新` 的路由记录 */
function extractChangeRecords(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const
        leavingRecords = [],
        updatingRecords = [],
        enteringRecords = []

    const len = Math.max(to.matched.length, from.matched.length)
    for (let i = 0; i < len; i++) {
        const recordFrom = from.matched[i]

        if (recordFrom) {
            if (to.matched.find((record) => record.path === recordFrom.path)) {
                updatingRecords.push(recordFrom)
            }
            else {
                leavingRecords.push(recordFrom)
            }
        }

        const recordTo = to.matched[i]
        if (recordTo) {
            // 如果没有，recordTo 就是一个新的路由记录
            if (!from.matched.find((record) => record.path === recordTo.path)) {
                enteringRecords.push(recordTo)
            }
        }
    }

    return [leavingRecords, updatingRecords, enteringRecords]
}

/** 将守卫回调执行结果转为 promise */
function guardToPromise(
    guard: guardFn,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    record?: RouteRecordNormalized
): () => Promise<void> {
    return () => new Promise((resolve) => {
        const next = resolve
        const guardReturn = guard.call(record, to, from, next)

        /** 把 guardReturn 结果作为 Promise 返回 */
        return Promise.resolve(guardReturn).then(next)
    })
}

/** 从组件提取出指定类型的守卫回调 */
function extractComponentsGuards(
    matched: RouteRecordNormalized[],
    guardType: string,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) {
    const guards = []

    for (const record of matched) {
        const rawComponent = record.components.default
        /** 组件上面对应类型的守卫回调 */
        const guard = (rawComponent as any)[guardType]

        guard && guards.push(guardToPromise(guard, to, from, record))
    }

    return guards
}

/** 按照顺序去执行一个路由守卫数组里面的所有函数 */
function runGuardQueue(guards: Lazy<any>[]) {
    return guards.reduce(
        (promise, guard) => promise.then(guard),
        Promise.resolve()
    )
}

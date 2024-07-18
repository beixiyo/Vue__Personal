import type { App, Component, Ref, computed } from 'vue'
import type { RouteMeta } from 'vue-router'
import type { voidfn } from './common'
import type { RouterHistory } from './history'
import type { RouteRecordNormalized } from './matcher'


/** 用户传入的原始的路由记录类型 */
export interface RouteRecordRaw {
    path: string
    name?: string
    children?: RouteRecordRaw[]
    component: Component | (() => Promise<Component>)
    meta?: RouteMeta
    beforeEnter?: voidfn
}

export interface RouterOptions {
    history: RouterHistory
    routes: Readonly<RouteRecordRaw[]>
}

export interface Router {
    push(to: string | Ref<string> | RouteLocationNormalized): void
    install(app: App): void
    beforeEach(guard: voidfn): void
    beforeResolve(guard: voidfn): void
    afterEach(guard: voidfn): void
    addRoute: (record: RouteRecordRaw) => void
}

export interface RouteLocationNormalized {
    path: string
    matched: RouteRecordNormalized[]
}

export type ReactiveRoute = Record<string, ReturnType<typeof computed>>

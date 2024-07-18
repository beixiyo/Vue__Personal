import type { Component } from 'vue'
import type { RouteMeta } from 'vue-router'
import type { voidfn } from './common'
import type { RouteRecordRaw } from './router'


export interface RouteRecordMatcher {
    record: RouteRecordNormalized
    parent: RouteRecordMatcher | undefined
    children: RouteRecordMatcher[]
    path: string
}

export interface RouteRecordNormalized {
    path: string
    name: string
    meta: RouteMeta
    beforeEnter: voidfn | undefined
    components: {
        default: Component
    }
    children: RouteRecordRaw[]
    leaveGuards: []
    updateGuards: []
}

import type { RouteRecordNormalized } from "./types"


export const TRAILING_SLASH_RE = /\/$/

export const START_LOCATION_NORMALIZED = {
    path: '/',
    matched: [] as RouteRecordNormalized[]
}


export const Route = Symbol('Route')
export const Router = Symbol('Router')
export const RouteDepth = Symbol('RouteDepth')

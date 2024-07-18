import type { RouteRecordNormalized } from "./matcher"
import type { RouteLocationNormalized } from './router'

export type voidfn = (...args: any[]) => void

export type ValueContainer<T> = {
    value: T
}

/** 守卫回调对应的类型 */
export type guardFn = (
    this: RouteRecordNormalized | undefined,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: () => void
) => void

export type Lazy<T> = () => Promise<T>
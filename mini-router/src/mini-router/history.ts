import { normalizeBase, stripBase } from './utils'
import type { HistoryState } from 'vue-router'
import type {
    HistoryLocation,
    StateEntry,
    ValueContainer,
    NavigationCallback,
    RouterHistory
} from './types'


export function createWebHistory(base?: string): RouterHistory {
    base = normalizeBase(base)

    /** 导航对象 */
    const historyNavigation = useHistoryStateNavigation(base)

    /** 监听对象 */
    const historyListeners = useHistoryListeners(
        base,
        historyNavigation.state,
        historyNavigation.location
    )

    const routerHistory = Object.assign({}, historyNavigation, historyListeners)

    Object.defineProperty(routerHistory, 'location', {
        get: () => historyNavigation.location.value
    })
    Object.defineProperty(routerHistory, 'state', {
        get: () => historyNavigation.state.value
    })

    return routerHistory
}

/** 提取路径 或 哈希 */
function createCurrentLocation(base: string) {
    const { pathname, search, hash } = window.location
    const hasPos = base.indexOf('#')

    if (hasPos > -1) {
        // 如果路径包含哈希，那 slicePos 就是基础路径中 # 之后的长度
        // 否则 slicePos 就是 1
        const slicePos = hash.includes(base.slice(hasPos))
            ? base.slice(hasPos).length
            : 1

        /** 从路径中提取的哈希，去除 # 和基础路径的结果 */
        let pathFromHash = hash.slice(slicePos)
        if (pathFromHash[0] !== '/') {
            pathFromHash = '/' + pathFromHash
        }

        return pathFromHash
    }

    // 没有哈希
    const path = stripBase(pathname, base)
    return path + search + hash
}

/**
 * 创建一个路由状态对象
 * @param back 从当前路由回退时进入的路由位置
 * @param current 当前路由位置
 * @param forward 从当前路由前进时会进入的路由位置
 * @param replace 当前的路由是否通过 replace 进行导航，默认 false
 * @param computedScroll 处理滚动，默认 false
 */
function buildState(
    back: HistoryLocation | null,
    current: HistoryLocation,
    forward: HistoryLocation | null,
    replace: boolean = false,
    computedScroll: boolean = false
) {
    return {
        back,
        current,
        forward,
        replace,
        scroll: computedScroll
            ? { left: window.scrollX, top: window.scrollY }
            : null,
        position: window.history.length - 1
    }
}

/** 创建导航对象 */
function useHistoryStateNavigation(base: string) {
    /** 当前路径 或 哈希 */
    const currentLocation = {
        value: createCurrentLocation(base)
    }

    /**  从 history 里获取 state */
    const historyState = {
        value: window.history.state
    }

    // 第一次刷新页面 需创建一个初始化状态
    if (!historyState.value) {
        // 因为是第一次，所以用 replace 初始化导航
        changeLocation(
            currentLocation.value,
            buildState(null, currentLocation.value, null, true),
            true
        )
    }

    /**
     * 更新浏览器的 history 历史记录
     */
    function changeLocation(to: HistoryLocation, state: HistoryState, replace: boolean) {
        const hasPos = base.indexOf('#')
        const url = hasPos > -1
            ? base + to
            : to

        window.history[replace ? 'replaceState' : 'pushState'](state, '', url)
        historyState.value = state
    }

    function push(to: HistoryLocation, data?: HistoryState) {
        const currentState = Object.assign(
            {},
            historyState.value,
            {
                forward: to,
                scroll: { left: window.scrollX, top: window.scrollY }
            }
        )

        // 本质上没有跳转，只是更新了状态，方便 back 之后再 forward 仍然能前进
        changeLocation(currentState.current, currentState, true)

        const state = Object.assign(
            {},
            buildState(currentLocation.value, to, null),
            {
                position: currentState.position + 1
            },
            data
        )

        // 这一次就是 push 模式
        changeLocation(to, state, false)
        currentLocation.value = to
    }

    function replace(to: HistoryLocation, data?: HistoryState) {
        const state = Object.assign(
            {},
            buildState(historyState.value.back, to, historyState.value.forward, true),
            data
        )

        changeLocation(to, state, true)
        currentLocation.value = to
    }

    return {
        location: currentLocation,
        state: historyState,
        push,
        replace
    }
}

/**
 * 创建一个监听的对象，提供一个 listen 方法
 */
function useHistoryListeners(
    base: string,
    historyState: ValueContainer<StateEntry>,
    currentLocation: ValueContainer<HistoryLocation>
) {
    const listeners: NavigationCallback[] = []

    const popStateHandler = ({ state }: { state: StateEntry }) => {
        const
            to = createCurrentLocation(base),
            from = currentLocation.value,
            fromState = historyState.value

        currentLocation.value = to
        historyState.value = state

        const isBack = state.position - fromState.position < 0

        listeners.forEach((listener) => {
            listener(to, from, { isBack })
        })
    }

    window.addEventListener('popstate', popStateHandler)

    function listen(cb: NavigationCallback) {
        listeners.push(cb)
    }

    return {
        listen
    }
}


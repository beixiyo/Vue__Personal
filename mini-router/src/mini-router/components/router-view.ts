import { inject, computed, provide, h, defineComponent } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { RouteDepth, Route } from '../contant'


export const RouterView = defineComponent({
    name: 'RouterView',
    setup(_, { slots }) {
        // 如果父组件没有提供 depth，说明这是最顶层的 router-view
        const depth: number = inject(RouteDepth, 0)
        const injectRoute: RouteLocationNormalizedLoaded = inject(Route)!

        /** 对应层数的匹配上的路由记录 */
        const matchedRouteRef = computed(() => injectRoute.matched[depth])

        provide(RouteDepth, depth + 1)

        
        return () => {
            /** 对应的路由记录 */
            const matchRoute = matchedRouteRef.value
            const Component = matchRoute && matchRoute?.components?.default
            
            if (!Component) {
                return slots.default && slots.default()
            }

            return h(Component)
        }
    }
})

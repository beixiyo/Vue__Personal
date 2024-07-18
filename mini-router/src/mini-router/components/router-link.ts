import { inject, h, defineComponent } from 'vue'
import type { UseLinkOptions } from 'vue-router'
import type { RouteLocationNormalized, Router } from '../types'
import { Router as SymbolRouter } from '../contant'


function useLink(props: UseLinkOptions) {
    const router: Router = inject(SymbolRouter) as Router
    function navigate() {
        router.push(props.to as RouteLocationNormalized)
    }

    return {
        navigate
    }
}

export const RouterLink = defineComponent({
    name: 'RouterLink',
    props: {
        to: {
            type: [String, Object],
            required: true
        }
    },
    setup(props, { slots }) {
        const link = useLink(props)
        
        return () => h(
            'a',
            {
                onClick: link.navigate,
                style: {
                    cursor: 'pointer'
                }
            },
            slots.default && slots.default()
        )

    }
})

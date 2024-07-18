import { inject } from 'vue'
import { Router, Route } from './contant'


export function useRouter() {
    return inject(Router)
}

export function useRoute() {
    return inject(Route)
}

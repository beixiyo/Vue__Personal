// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from '@/mini-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import A from '@/views/A.vue'
import B from '@/views/B.vue'
import C from '@/views/C.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            children: [
                {
                    path: 'a',
                    component: A
                },
                {
                    path: 'b',
                    component: B
                },
                {
                    path: 'c',
                    component: C
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            component: About
        }
    ]
})

export default router

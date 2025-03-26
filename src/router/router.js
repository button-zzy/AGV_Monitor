import {createRouter, createWebHistory} from "vue-router";
import {useUserInfoStore} from "@/store/Store.js";
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: ()=>import('@/components/AGVMap.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next)=>{
    // console.log('to:' + to, 'from:' + from);
    if (to.name !== 'login' && useUserInfoStore().account === '') next({ name: 'login' })
    else if (to.name === 'login' && useUserInfoStore().account !== '') next('/')
    else next()
})

export default router
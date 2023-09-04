import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

import Layout from "@/pages/layout"

const router = new Router({
    routes: [
        {
            path: '/home',
            name: 'HomePage',
            component: () => import('@/pages/homePage')
        },
        {
            path: '/',
            name: 'Layout',
            component: Layout,
            children: [
                {
                    path: 'main',
                    name: 'Main',
                    component: () => import('@/pages/workBenchPage')
                },
                {
                    path: 'detail/:id',
                    name: 'FileDetail',
                    component: () => import('@/pages/fileDetailPage')
                },
                {
                    path: 'deposit',
                    name: 'Deposit',
                    component: () => import('@/pages/depositPage')
                },
                {
                    path: 'write',
                    name: 'write',
                    component: () => import('@/pages/writeContentPage')
                },
                {
                    path: 'search/:searchValue',
                    name: 'Search',
                    component: () => import('@/pages/searchPage')
                },]
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    if (to.name !== 'HomePage') {
        const info = store.getters["account/account"]
        if (!info) {
            return next({name: 'HomePage'})
        }
    }
    next()
})

// Resolve programmatic routing to the same address when the error is reported
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;

// push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};

//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
}

export default router
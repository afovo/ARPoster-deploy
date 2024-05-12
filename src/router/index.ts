import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import("@/views/Home.vue")
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import("@/views/ProjectList.vue")
        // beforeEnter: (to: any, from: any, next: any) => {
        //     // 进行路由访问控制或相关操作
        // }
    },
    {
        path: '/editing/:id',
        name: 'Editing',
        component: () => import("@/views/ProjectEditer.vue")
    },
    {
        path: '/poster/:id',
        name: 'Poster',
        component: () => import("@/views/ArDemo.vue")
    },
    {
        path: '/test',
        name: 'PosterTest',
        component: () => import("@/views/ArDemo.vue")
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes:routes
})
// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//     else next()
//   })
  
export default router
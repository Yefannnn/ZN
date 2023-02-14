// 创建路由
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
    children: [
      {
        path: 'trace',
        name: 'trace',
        component: () => import('@/pages/home/trace/index.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 对跳转做出限制
  next()
})
router.afterEach((to, from) => {
  document.title = to.meta.title || '主页'
})

export default router

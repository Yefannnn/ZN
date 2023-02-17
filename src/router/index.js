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
      },
      {
        path: 'gplot',
        name: 'gplot',
        component: () => import('@/pages/home/gplot/index.vue')
      },
      {
        path: 'dashBoard',
        name: 'dashBoard',
        component: () => import('@/pages/home/dashBoard/index.vue'),
        children: [
          {
            path: 'APM',
            name: 'APM',
            component: () => import('@/pages/home/dashBoard/types/APM.vue')
          },
          {
            path: 'Database',
            name: 'Database',
            component: () => import('@/pages/home/dashBoard/types/Database.vue')
          },
          {
            path: 'Istio',
            name: 'Istio',
            component: () => import('@/pages/home/dashBoard/types/Istio.vue')
          },
          {
            path: 'K8s',
            name: 'K8s',
            component: () => import('@/pages/home/dashBoard/types/K8s.vue')
          },
        ]
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/pages/home/log/index.vue')
      },
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

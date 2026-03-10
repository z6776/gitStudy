import { createRouter, createWebHashHistory } from 'vue-router'

import { getCookie } from '@/utils/cookie/cookie'
import { close, start } from '@/utils/progress/nprogress'
import { pathRoutes } from '@/router/routes.ts'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/login/login.vue'),
    },
    {
      path: '/mobile',
      name: 'Mobile',
      meta: {
        title: '移动端页面',
      },
      component: () => import('@/views/pages/mobile/index.vue'),
    },

    {
      path: '/homePage',
      name: 'homePage',
      meta: {
        title: 'App',
      },
      component: () => import('@/views/homeIndex/index.vue'),
      children: [
        {
          path: '/layout',
          name: 'Layout',
          meta: {
            title: '首页',
          },
          component: () => import('@/views/layout/layout.vue'),
          children: pathRoutes,
        },
        {
          path: '/wardMonitoring',
          name: 'wardMonitoring',
          meta: {
            title: '病区监护总览',
          },
          component: () => import('@/views/pages/wardMonitoring/index.vue'),
        },
      ],
    },
    {
      path: '',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, from, next) => {
  start()
  if (to.name == 'Mobile') {
    next()
  } else if (to.name !== 'Login' && !getCookie('token')) {
    next({ name: 'Login' }) //cookie中无token信息禁止进入内页
  } else if (to.name === 'Login' && !!getCookie('token')) {
    next({ name: 'index' }) //cookie中有token禁止返回登录页
  } else {
    next()
  }
})
router.afterEach(() => {
  close()
})
export default router

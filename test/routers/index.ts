import { createRouter, createWebHistory } from 'vue-router'
import ListPage from '../components/ListPage.vue'
import DetailPage from '../components/DetailPage.vue'

/**
 * 路由配置
 */
const routes = [
  {
    path: '/',
    name: 'list',
    component: ListPage
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: DetailPage
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
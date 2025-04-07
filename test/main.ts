import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'

/**
 * 创建Vue应用
 */
const app = createApp(App)

// 挂载路由
app.use(router)

// 挂载应用
app.mount('#app') 
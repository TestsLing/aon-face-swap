import './assets/main.css'

import { createApp } from 'vue'
import { Uploader } from 'vant';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(router)
app.use(Uploader)
app.use(ElementPlus)

app.mount('#app')

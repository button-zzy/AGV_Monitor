import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from "naive-ui"
import router from '@/router/router.js'

import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(naive)
app.use(router)
app.use(pinia)
app.mount('#app')
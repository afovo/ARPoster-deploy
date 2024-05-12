import '@/assets/scss/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import AFRAME from 'aframe'
import router from './router/index'
import './index.css'
import { createPinia } from 'pinia'
const pinia = createPinia()
createApp(App).use(AFRAME).use(router).use(pinia).mount('#app')

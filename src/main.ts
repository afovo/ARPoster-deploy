import '@/assets/scss/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import AFRAME from 'aframe'
import './index.css'
import { createPinia } from 'pinia'
const pinia = createPinia()
createApp(App).use(AFRAME).use(pinia).mount('#app')

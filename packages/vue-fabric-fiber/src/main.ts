import { createHead } from '@unhead/vue/client'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import { router } from './router'
import './style.css'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(i18n)
app.use(router)
app.mount('#app')

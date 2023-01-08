import { createApp } from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import { store } from './store/index.js'
const app = createApp(App)
app.use(store)
app.use(Vuex)
app.mount('#app')

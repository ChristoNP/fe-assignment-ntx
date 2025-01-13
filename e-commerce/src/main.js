import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CategoriesView from './views/CategoriesView.vue'
import ProductsView from './views/ProductsView.vue'
import { createPinia } from 'pinia'
import { apolloClient } from './apollo/client'

// createApp(App).mount('#app')
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: CategoriesView},
        {path: '/products', component: ProductsView}
    ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(apolloClient)
app.mount('#app')
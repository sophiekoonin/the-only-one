import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './lib/store'
import GameLobby from './components/GameLobby'

const routes = [{ path: '/:gameId', component: GameLobby }]

export const router = new VueRouter({
    routes // short for `routes: routes`
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')

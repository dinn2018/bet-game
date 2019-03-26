import './database'
import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import App from './App.vue'
import router from './router'
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";
import Vuex from 'vuex'
import Store from "./store";
import VueResource from 'vue-resource';

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(Vuetify,
	{
		iconfont: 'fa'
	});

new Vue({
	store: new Store(),
	router,
	render: (h) => h(App)
}).$mount('#app')
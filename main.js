import Vue from 'vue'
import App from './App'
import request from './utils/request'
import comm from './utils/common.js'
Vue.config.productionTip = false

App.mpType = 'app'

// 此处为演示Vue.prototype使用，非uView的功能部分
Vue.prototype.vuePrototype = ''

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView)

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store'

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)


const app = new Vue({
	store,
	...App
})


Vue.prototype.$request = request;
Vue.prototype.$comm = comm;
app.$mount()
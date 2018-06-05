// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import VueLazyLoad from 'vue-lazyload'

/*import 'common/stylus/index.styl'*/

//Vue.config.productionTip = false

//减少延迟
fastclick.attach(document.body)
//注册懒加载插件
Vue.use(VueLazyLoad,{
  loading:require('commom.image.default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})

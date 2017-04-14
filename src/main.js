import Vue from 'vue'
import Vuex from 'vuex'
import contrast from './contrast'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import mdSale from './components/mdSale'
import mdStock from './components/mdStock'
import supSale from './components/supSale'
import supStock from './components/supStock'
import claSale from './components/claSale'
import claStock from './components/claStock'
import md from './components/md'
import supplier from './components/supplier'
import classify from './components/classify'
import store from './vuex/store'
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

const FastClick = require('fastclick')
FastClick.attach(document.body)
  /* eslint-disable no-new */
const router = new VueRouter()

const commit = store.commit || store.dispatch

Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true
Vue.http.headers.common["Content-Type"] = 'text/json; charset=UTF-8'
Vue.http.options.emulateHTTP = true


Vue.http.interceptors.push((request, next) => {

  commit('LOADING', {
    show: true
  })
  next((Response) => {

    if (!Response.ok || Response.body.code === 500 || Response.body === '12') {
      commit('ERROR', {
        error: true
      })
    } else {

      setTimeout(function() {

        commit('LOADING', {
          show: false
        })
      }, 200)
    }
  })
})


router.beforeEach(({
  to,
  from,
  next
}) => {

  let userId = window.localStorage.getItem('userId')
  if (userId === '0' || userId === 'undefined' || userId === null) {
    window.location.href = 'http://qianduan.cnonixdata.com/shxh'
  } else {
    next()
  }

})
router.redirect({
  '/': 'md/mdSale',
  '/supplier': 'supplier/supSale',
  '/classify': 'classify/claSale',
})
router.map({
  '/md': {
    component: md,
    subRoutes: {
      'mdSale': {
        component: mdSale
      },
      'mdStock': {
        component: mdStock
      }
    }
  },
  '/supplier': {
    component: supplier,
    subRoutes: {
      'supSale': {
        component: supSale
      },
      'supStock': {
        component: supStock
      }
    }
  },
  '/classify': {
    component: classify,
    subRoutes: {
      'claSale': {
        component: claSale
      },
      'claStock': {
        component: claStock
      }
    }
  }
})


router.start(contrast, '#contrast')
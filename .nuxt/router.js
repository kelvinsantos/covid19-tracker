import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7ad7ecd6 = () => interopDefault(import('../pages/global.vue' /* webpackChunkName: "pages/global" */))
const _03fb9a52 = () => interopDefault(import('../pages/latest-news.vue' /* webpackChunkName: "pages/latest-news" */))
const _125fa94c = () => interopDefault(import('../pages/map.vue' /* webpackChunkName: "pages/map" */))
const _2d4a713f = () => interopDefault(import('../pages/country/_id.vue' /* webpackChunkName: "pages/country/_id" */))
const _5bdc4250 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/global",
    component: _7ad7ecd6,
    name: "global"
  }, {
    path: "/latest-news",
    component: _03fb9a52,
    name: "latest-news"
  }, {
    path: "/map",
    component: _125fa94c,
    name: "map"
  }, {
    path: "/country/:id?",
    component: _2d4a713f,
    name: "country-id"
  }, {
    path: "/",
    component: _5bdc4250,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}

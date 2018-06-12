import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Timetable from '@/components/Timetable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },

    {
      path: '/timetable',
      name: 'timetable',
      component: Timetable
    }
  ]
})

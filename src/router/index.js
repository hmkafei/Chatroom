//创建一个路由器.并暴露出去
import {createRouter,createWebHistory} from 'vue-router'

import Chatroom from '@/components/Chatroom.vue'
import HelloWorld from '@/components/HelloWorld.vue'
// import About from '@/components/About.vue'
const router = createRouter({
  history:createWebHistory(),     //路由器的工作模式
  routes:[                      //一个一个的路由规则
    {
      path:'/hello',
      component:HelloWorld
    },
    {
      path:'/chatroom',
      component:Chatroom
    },
    // {
    //   path:'/about',
    //   component:About
    // }
  ]
})

export default router
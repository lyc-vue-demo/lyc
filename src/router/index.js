import Vue from 'vue'
import Router from 'vue-router'
import Blog from '@/components/Blog'
import list from '@/components/list'
import content from '@/components/content'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'blog',
      component: Blog,
      children: [
        {
          path: 'list',
          name: 'list',
          component: list
        },
        {
          path: 'content',
          name: 'content',
          component: content
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'blog') {
    next({
      replace: true,
      path: 'list'
    })
  } else {
    next()
  }
})
export default router

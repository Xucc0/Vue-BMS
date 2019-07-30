import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Indexs from '@/components/Index'
import userList from '@/components/userList'
import rolesList from '@/components/rolesList'
import rightsList from '@/components/rightsList'
import goodsList from '@/components/goodsList'
import categories from '@/components/categories'
import orders from '@/components/orders'
import reports from '@/components/reports'
import addGoodsList from '@/components/addGoodsList'
import paramsList from '@/components/paramsList'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/', component: Indexs, children: [
        { path: '/users', component: userList },
        { path: '/roles', component: rolesList },
        { path: '/rights', component: rightsList },
        { path: '/goods', component: goodsList },
        { path: '/categories', component: categories },
        { path: '/orders', component: orders },
        { path: '/reports', component: reports },
        { path: '/goods/add', component: addGoodsList },
        { path: '/params', component: paramsList },
        //重定向
        { path: '/goods/goods', redirect: '/goods' },
        { path: 'goods/params', redirect: '/params' },
        { path: 'goods/categories', redirect: '/categories' },
        { path: 'goods/users', redirect: '/users' },
        { path: 'goods/roles', redirect: '/roles' },
        { path: 'goods/rights', redirect: '/rights' },
        { path: 'goods/orders', redirect: '/orders' },
        { path: 'goods/reports', redirect: '/reports' },
        { path: '/', redirect: '/users' },
      ]
    },
    { path: '/Login', component: Login },
    
  ]
})
//导航守卫，判断是否有token
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next();
  } else {
    if (localStorage.getItem('token') == null) {
      next({ path: '/login' });
      //原来的this是指的是Vue的实例化对象，所以在这里需要对Vue进行实例化
      var that = new Vue()
      that.$message({
        message: '请先登录',
        type: 'error'
      })
    } else {
      next();
    }
  }
})
export default router;
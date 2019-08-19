import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: '首页',
    redirect: '/system/adminApi',
    component: (resolve) => require(['../pages/base.vue'], resolve),
    children: [
      {
        path: '/system/adminApi',
        name: '主页',
        component: (resolve) => require(['../pages/system/adminApi.vue'], resolve)
      },
      {
        path: '/system/index',
        name: '系统信息',
        meta: {
          noNeedLogin: true // 加上这个说明不需要登录，也可以访问该页面
        },
        component: (resolve) => require(['../pages/system/index.vue'], resolve)
      },
      {
        path: '/system/adminUser',
        name: '管理员',
        component: (resolve) => require(['../pages/system/adminUser.vue'], resolve)
      },
      {
        path: '/system/adminGroup',
        name: '管理组',
        component: (resolve) => require(['../pages/system/adminGroup.vue'], resolve)
      },
      {
        path: '/article/index',
        name: '博文列表',
        component: (resolve) => require(['../pages/article/index.vue'], resolve)
      },
      {
        path: '/richText/richTextForm',
        name: '富文本编辑器',
        component: (resolve) => require(['../pages/richText/richTextForm.vue'], resolve)
      },
      {
        path: '/workpoint/RecordWorkPoint',
        name: '记工时',
        component: (resolve) => require(['../pages/workpoint/RecordWorkPoint.vue'], resolve)
      },
      {
        path: '/article/add',
        name: '添加博客',
        component: (resolve) => require(['../pages/article/add.vue'], resolve)
      },
      {
        path: '/article/edit/:id',
        name: '编辑文章',
        component: (resolve) => require(['../pages/article/edit.vue'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['../pages/login/index.vue'], resolve),
    meta: {
      noNeedLogin: true
    }
  },
  {
    path: '/admin/*',
    redirect: '/'
  }
];

const router = new Router({
  routes: routes
});

router.beforeEach((to, from, next) => {
  // 修改页面title
  if (to.name) {
    // document.title = to.name
  }
  // 判断该路由是否需要登录权限
  if (!to.meta.noNeedLogin) {
    let localToken = window.localStorage.getItem('token');
    if (localToken) {
      next();
    } else {
      router.push({ path: '/login' });
    }
  } else {
    next();
  }
});

export default router;

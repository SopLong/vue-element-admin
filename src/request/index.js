import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
// import store from '@/store';
// import { getToken } from '@/utils/auth'

// 是否开启无状态认证
const stateless = false;
if (!stateless) {
  axios.defaults.withCredentials = true;
}
// create an axios instance
const service = axios.create({
  // baseURL: 'http://' + location.host.replace(location.port, '9999'), // api的base_url
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 115000 // request timeout
});
// request interceptor
service.interceptors.request.use(config => {
  if (stateless) {
    // config.headers['authorization'] = store.getters.user + '_' + store.getters.token;
  }

  // store.commit('updateLoading', true);

  // Do something before request is sent
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // }
  return config;
}, error => {
  // Do something with request error
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
    // store.commit('updateLoading', false);
    const res = response.data;
    if (res.code !== 20000) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50004) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload();// 为了重新实例化vue-router对象 避免bug
          // });
        });
      }
      // 后端异常代码
      if (res.code === 50005) {
        if (res.msg) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          });
        }
      }
      return response.data;
      // return Promise.reject('error')
    } else {
      // 更新在线人数
      // store.dispatch('setOnLineCount', response.data.userCount);
      return response.data;
    }
  },
  error => {
    // console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error);
  });

export default service;

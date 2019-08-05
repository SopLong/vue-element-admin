import request from '@/request/index';

// 登录方法
export function login(data) {
  return request({
    url: '/LoginController/login',
    method: 'post',
    data
  });
}

// 登出方法
export function logout() {
  return request({
    url: '/LoginController/logout',
    method: 'get'
  });
}

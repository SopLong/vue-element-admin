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

// 保存工作时长
export function saveWorkPoint(day, duration) {
  return request({
    url: '/workPoint/saveWorkPoint',
    method: 'post',
    data: {
      dateTime: day,
      allHours: duration
    }
  });
}

// 生成工资单
export function generarePayroll(month) {
  return request({
    url: '/workPoint/generarePayroll',
    method: 'get',
    params: {
      currentMonth: month
    }
  });
}

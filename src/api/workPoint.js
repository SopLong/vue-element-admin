import request from '@/request/index';

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

// 获取每月工资信息
export function getMonthInfo(month) {
  return request({
    url: '/workPoint/getMonthInfo',
    method: 'get',
    params: {
      currentMonth: month
    }
  });
}

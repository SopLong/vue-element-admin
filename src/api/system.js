import request from '@/request/index';

// 获取字典下拉数据
export function getCodeDropList(type) {
  return request({
    url: '/sysCode/getCodeDropList/' + type,
    method: 'get'
  });
}

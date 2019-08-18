import request from '@/request/index';

// 添加博客文章
export function addBlogArticle(data) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data
  });
}

import request from '@/request/index';

// 添加博客文章
export function addBlogArticle(data) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data
  });
}

// 获取博文列表
export function getArticleList(data) {
  return request({
    url: '/article/getArticleList',
    method: 'post',
    data
  });
}

// 删除博客文章
export function deleteArticle(id) {
  return request({
    url: '/article/deleteArticle/' + id,
    method: 'get'
  });
}

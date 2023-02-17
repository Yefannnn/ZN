// 用户模块请求
import request from '@/utils/request'

export const getLinkList = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/queryOpenTrace/2`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 用户模块请求
import request from '@/utils/request'

export const getLinkList = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/queryOpenTrace/2`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})


// 慢节点/ 慢服务
export const slowNodeSort = () => request({
  method: 'GET',
  url: `${SuApi}/search/slow_service`
})

// 慢节点/慢服务 错误率/成功率排序
export const slowNodeErrorRateSort = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_error`,
  params: {
    service_type_suc: data.type
  }
})

// 节点/服务高负载
export const highPayloadSort = () => request({
  method: 'GET',
  url: `${SuApi}/search/service_load_cpm`
})


// 服务实例错误率/成功分布热图
export const serviceInstanceError = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_instance_slow`,
  params: {
    service_name: data.name,
    service_type_suc: data.type
  }
})


// 服务实例负载分布热图
export const serviceInstancePayload = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_instance_cpm`,
  params: {
    service_name: data
  }
})

// 服务响应时延
export const serviceDelay = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_instance_duration`,
  params: {
    service_name: data
  }
})
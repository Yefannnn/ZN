// 用户模块请求
import request from '@/utils/request'

export const getLinkList = (params) => request({
  method: 'POST',
  url: `${SuApi}/search/queryOpenTrace`,
  data: {
    service_name: params.service_name,  // api_geteway
    start_time: params.start_time,
    end_time: params.end_time,
    isUpdate: params.isUpdate
  }
})

// 慢节点/ 慢服务
export const slowNodeSort = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/slow_service`,
  params: {
    service_type: data.type
  }
})

// 慢节点/慢服务 错误率/成功率排序
export const slowNodeErrorRateSort = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_error`,
  params: {
    service_type_suc: data.type,
    service_type: data.serviceType
  }
})

// 节点/服务高负载
export const highPayloadSort = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_load_cpm`,
  params: {
    service_type: data.serviceType
  }
})


// 服务实例错误率 /成功 分布热图
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
    service_name: data.name
  }
})

// 服务响应时延热图
export const serviceDelay = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/service_instance_duration`,
  params: {
    service_name: data
  }
})

// 获取日志
export const getLogOrigin = (data) => request({
  method: 'GET',
  url: `${SuApi}/search/log`,
  params: {
    span_id: data.span_id
  }
})

// 服务列表
export const getServiceList = () => request({
  method: 'GET',
  url: `${SuApi}/search/serviceList`,
})
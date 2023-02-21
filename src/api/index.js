// 所有请求集合

// user模块
import { getLinkList, slowNodeSort, slowNodeErrorRateSort, highPayloadSort, serviceInstanceError, serviceInstancePayload, serviceDelay } from '@/api/link'
export const getLinkListAPI = getLinkList
export const slowNodeSortAPI = slowNodeSort
export const slowNodeErrorRateSortAPI = slowNodeErrorRateSort
export const highPayloadSortAPI = highPayloadSort
export const serviceInstanceErrorAPI = serviceInstanceError
export const serviceInstancePayloadAPI = serviceInstancePayload
export const serviceDelayAPI = serviceDelay
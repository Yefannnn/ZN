import { defineStore } from 'pinia'


export default defineStore('trace', {
    state() {
        return {
            openTraceData: [], // 调用链数据
            openTraceAllData: [], //调用链所有数据
            serviceInstanceDuration: [], // 服务响应时延热图
            serviceInstanceSuccess: [], // 实例成功率百分比热图
            serviceLoadCpm: [], // 服务负载排序-服务
            serviceErrorHost: [], // 服务error排序-节点
            slowService: [], // 慢服务排序-服务
            serviceInstanceSlow: [], // 实例错误率百分比热图
            instanceCpmsData: [] // 实例负载分布热图
        }
    },
    actions: {
        updateTraceData(type, data) {
            switch (type) {
                case "openTraceAllData":
                    this.openTraceAllData = data
                    break;
                case "openTraceData":
                    this.openTraceData = data
                    break;
                case "serviceInstanceDuration":
                    this.serviceInstanceDuration = data
                    break;
                case "serviceInstanceSuccess":
                    this.serviceInstanceSuccess = data
                    break;
                case "serviceLoadCpm":
                    this.serviceLoadCpm = data
                    break;
                case "serviceErrorHost":
                    this.serviceErrorHost = data
                    break;
                case "slowService":
                    this.slowService = data
                    break;
                case "serviceInstanceSlow":
                    this.serviceInstanceSlow = data
                    break;
                case "instanceCpmsData":
                    this.instanceCpmsData = data
                    break;


                default:
                    break;
            }
        }
    }
})
// 热点模块
import { defineStore } from 'pinia'

export default defineStore('dashBoard', {
  state() {
    return { APMWithInstance: 'api_gateway' }
  },
  actions: {
    updateAPMWithInstance(payload) {
      this.APMWithInstance = payload
    }
  }
})

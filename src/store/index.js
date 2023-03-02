/*
 * createPiniaStore
 * 主仓库
 */
import { defineStore, storeToRefs } from 'pinia'

export default defineStore('main', {
  state() {
    return {
      overAllWithSelected: ''
    }
  },
  actions: {
    updateOverAllSelected(payload) {
      this.overAllWithSelected = payload
    }
  }
})

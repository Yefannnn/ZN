<template>
  <div class="homeBox">
    <div class="navTab">
      <div class="bgcImg">
        <img src="" alt="" />
      </div>
      <div class="titleBox" v-for="(item, index) in tabData" :key="index">
        <div class="titleItem" :style="{
          backgroundColor: new RegExp(item.name).test(route.path)
            ? '#333844'
            : '',
          color: new RegExp(item.name).test(route.path)
            ? '#fff'
            : '#c6c7ca'
        }" @click="changeActive(item.title, item.name)">
          <img :src="item.imgUrl" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <div class="selectBox1">
          <el-select v-model="serviceSelect.selected" class="m-2" placeholder="请选择服务器实例" size="small"
            @change="valueSelected">
            <el-option v-for="item in serviceSelect.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>

    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
import useTraceStore from '@/store/trace'

const traceStore = useTraceStore()

// store 中的全局变量
const store = useStore()
const { overAllWithSelected } = storeToRefs(store)


const router = useRouter();
const route = useRoute();

const tabData = ref([
  {
    title: "仪表盘",
    name: "dashBoard",
    imgUrl: "",
    active: true,
  },
  {
    title: "拓补图",
    name: "gplot",
    imgUrl: "",
    active: false,
  },
  {
    title: "追踪",
    name: "trace",
    imgUrl: "",
    active: false,
  },
  {
    title: "日志",
    name: "log",
    imgUrl: "",
    active: false,
  },
]);

const serviceSelect = ref({
  selected: '111',
  options: [
    {
      value: '111',
      label: '111'
    },
    {
      value: '222',
      label: '222'
    },
    {
      value: '333',
      label: '333'
    },
  ]
})

const valueSelected = (newValue) => {
  // console.log('newValue', newValue, store);
  store.updateOverAllSelected(newValue)
}

const changeActive = (title, name) => {
  tabData.value.forEach((item) => {
    item.active = false;
  });
  let targetObj = tabData.value.find((item) => item.title === title);
  targetObj ? (targetObj.active = true) : "";

  router.push({
    name,
  });
};


let ws = null
let connectCount = 0  // 重连次数

// 监听websocket
const websocketOnSuccess = (e) => {
  connectCount = 0
  console.log('连接成功', e);
}

const websocketOnMessage = (e) => {
  let orginData = JSON.parse(e.data)
  console.log('收到消息', orginData);
  switch (orginData.type) {
    case "openTraceAllData": // 调用链所有数据
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "openTraceData": // 调用链数据
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "serviceInstanceDuration": // 服务响应时延热图
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "serviceInstanceSuccess": // 实例成功率百分比热图
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "serviceLoadCpm": // 服务负载排序-服务
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "serviceErrorHost": // 服务error排序-节点
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "slowService": // 慢服务排序-服务
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "serviceInstanceSlow": // 实例错误率百分比热图
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;
    case "instanceCpmsData": // 实例负载分布热图
      traceStore.updateTraceData(orginData.type, orginData.data)
      break;

    default:
      break;
  }

}

const websocketOnError = (e) => {
  console.log('连接出错', e);
  // 出错重连
  // 关闭重连
  if (connectCount >= 2) return
  initWebSocket()
  connectCount++
}

const websocketOnClose = (e) => {
  console.log('连接关闭', e);
  // 关闭重连
  if (connectCount >= 2) return
  initWebSocket()
  connectCount++
}

const connectSocket = (url) => {
  try {
    if (window.WebSocket)
      return new WebSocket(url);
    if (window.MozWebSocket)
      return new MozWebSocket(url);
  } catch (e) {
  }
  return false;
}

const initWebSocket = () => {
  // 创建连接
  ws = connectSocket('ws://10.28.5.235:8080/ws')
  ws.onopen = websocketOnSuccess
  ws.onmessage = websocketOnMessage
  ws.onerror = websocketOnError
  ws.onclose = websocketOnClose
}

onMounted(() => {
  initWebSocket()
});
</script>
<style lang="less" scoped>
.homeBox {
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 255, 255);

  .navTab {
    display: flex;
    color: #c6c7ca;
    height: 48px;
    width: 100%;
    background-color: #252a2f;

    .bgcImg {
      width: 120px;
      height: 100%;
      background-color: skyblue;
    }

    .titleBox {
      display: flex;
      align-items: center;
      padding: 0 20px;

      .titleItem {
        padding: 7px 10px;
        border-radius: 4px;
        cursor: pointer;
      }

      .titleItem:hover {
        background-color: #333844;
      }
    }
  }
}

.selectBox1 {
  position: absolute;
  right: 2%;
  display: flex;
  align-items: center;
  min-width: 150px;
  height: 100%;

}

:deep(.selectBox1 .el-select .el-input__inner) {
  color: #c6c7ca;
}

:deep(.selectBox1 .el-select) {
  border-color: "#333840" !important;
}

:deep(.selectBox1 .el-select .el-input__wrapper) {
  background-color: #333840;
  border: none;
  box-shadow: 0 0 0 0;
}
</style>

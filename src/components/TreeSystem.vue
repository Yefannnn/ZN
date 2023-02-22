<template>
  <div style="width: 100%">
    <el-tree :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false" indent="0"
      @node-click="nodeClickFun">
      <template #default="{ node, data }">
        <div class="customNode">
          <div>
            <div class="circleClass" :style="{
              border: `1px solid ${searchIndex(data, lengend)}`,
            }"></div>

            <span style="margin-left: 10px" :style="{
              color: data.is_error ? 'red' : '#606266',
              fontWeight: data.is_error ? 700 : 400,
            }">{{ node.label }}</span>
          </div>

          <div v-if="data.pid === undefined" :class="`echart${data.id}`"
            style="width: 700px; height: 45px; float: right"></div>
          <el-tooltip v-else class="box-item" effect="dark" placement="top-start">
            <template #content>
              <p>主机名称：{{ data.service }}</p>
              <p>时延：{{ data.delay }}ms</p>
            </template>
            <div :class="`echart${data.id}`" style="width: 700px; height: 60px; float: right"></div>
          </el-tooltip>

          <!-- <el-tooltip
            v-else
            class="box-item"
            effect="dark"
            placement="top-start"
          >
            <template #content>
              <p>主机名称：{{ data.service }}</p>
              <p>时延：{{ data.delay }}ms</p>
            </template>
            <el-progress
              color="#6e40aa"
              :percentage="computeDelayFun(data.delay)"
              :show-text="false"
            >
            </el-progress>
          </el-tooltip> -->
        </div>
      </template>
    </el-tree>


    <!-- 抽屉 -->
    <el-drawer ref="drawerRef" v-model="drawerDialog" title="跨度信息" :before-close="handleClose" direction="ltr"
      class="demo-drawer">
      <div class="demo-drawer__content">
        <div class="containterContent">
          <h2>节点信息</h2>
          <div class="NodeContentItem" v-for="(value, key, index) in drawerData.NodeMessage" :key="index">
            <div class="itemWithKey">{{ key }}</div>
            <div class="itemWithValue">{{ value }}</div>
          </div>
          <h2>服务实例信息</h2>
          <div class="NodeContentItem" v-for="(value, key, index) in drawerData.serviceInstanceMessage" :key="index">
            <div class="itemWithKey">{{ key }}</div>
            <div class="itemWithValue">{{ value }}</div>
          </div>
          <div v-if="drawerData.is_log">
            <h2>日志</h2>
            <div class="NodeContentItem" v-for="(value, key, index) in drawerData.logMessage" :key="index">
              <div class="itemWithKey">{{ key }}</div>
              <div class="itemWithValue">{{ value }}</div>
            </div>
          </div>


        </div>
        <div class="demo-drawer__footer">

        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import useStore from "@/store/index";
import { nanoid } from "nanoid";
import * as Echarts from "echarts";
const store = useStore();

const props = defineProps({
  dataSource: {
    type: Array,
    required: true,
  },
  globleColor: {
    type: Array,
    default: function () {
      return ["#cd4448", "#6e40aa", "#97ceff"];
    },
  },
  lengend: {
    type: Array,
  },
});

// 扁平数组
const newDataSource = ref([]);

// 时间轴
const delayMax = ref(50);
const delayMin = ref(0);
const startTime = ref("");



// 抽屉show
const drawerDialog = ref(false)

// 抽屉数据
const drawerData = ref({
  NodeMessage: {
    服务: 'service-edu',
    服务实例: '0202313202321021223.0@172.18.0.1',
    端点: '/ccccc/x/xx/x/xxx/dsdf/dfsgfadsg/fftt545656456',
    跨度类型: 'exit'
  },
  serviceInstanceMessage: {
    组件: 'Feign',
    Peer: '10.28.5.130:8007',
    失败: true,
    'http.method': 'GET',
    url: 'http://102.28.5.130:8007/hdgf/dfhdfg/dfgetr/cvbdbgfdb4'
  },
  logMessage: {
    time: '2023-01-07 14:24:52',
    event: 'error',
    "event.kind": 'java.net.SockTimeoutException',
    message: 'Read time out',
    stack: '09:25:28 [vite] hmr update /src/components/TreeSystem.vue?vue&type=style&index=0&scoped=6de9f940&lang.less'
  },
  is_log: true
})
// node点击
const nodeClickFun = (nodeData) => {
  drawerData.value.is_log = nodeData.isLog   // 用来判断是否有日志
  console.log('nodeData', nodeData.id, nodeData.isLog);
  drawerDialog.value = true
  if (nodeData.isLog) {
    // 发起请求
  }
}

// 初始化时延坐标轴
const initDelayTimeLine = () => {
  let targetObj = newDataSource.value.find((i) => i.pid === undefined);
  let Dom = document.querySelector(`.echart${targetObj.id}`);
  Echarts.dispose(Dom);
  let timeLineChart = Echarts.init(Dom);
  let option = {
    xAxis: {
      type: "value",
      name: "ms",
      left: "10%",
      bottom: 30,
      min: delayMin.value,
      max: delayMax.value,
      minInterval: 5,
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      max: 0,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: { show: false },
    },
    grid: {
      bottom: "50%",
      top: 0,
      show: false,
    },
    series: [
      {
        type: "scatter",
        coordinateSystem: "cartesian2d",
        data: [[0, 0]],
        itemStyle: {
          opacity: 0,
        },
      },
    ],
  };

  timeLineChart.setOption(option);
};

// 初始化所有时间线
const initTimeLineInstance = () => {
  // 默认柱状图 配置项
  let option = {
    tooltip: {
      show: true,
      confine: true,
      position: ["100%", "50%"],
      formatter(params) {
        return "时延时间：" + params.data[0] + "ms";
      },
    },
    xAxis: {
      type: "value",
      left: "10%",
      bottom: 30,
      min: delayMin.value,
      max: delayMax.value,
      minInterval: 5,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: { show: false },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      max: 0,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: { show: false },
    },
    grid: {
      bottom: "50%",
      top: 0,
      show: false,
    },
    series: [
      {
        type: "line",
        data: [
          [0, 0],
          [200, 0],
        ],
        lineStyle: {
          color: "#6e40aa",
          width: 8,
        },
        itemStyle: {
          color: "#6e40aa",
          borderColor: "6e40aa",
          borderWidth: 50,
          borderCap: "round",
          opacity: 0,
        },
        symbolSize: 10,
      },
    ],
  };

  newDataSource.value.forEach((item) => {
    if (item.pid === undefined) {
      return;
    }
    // 配置条形图
    let Dom = document.querySelector(`.echart${item.id}`);
    Echarts.dispose(Dom);
    let myChart = Echarts.init(Dom);
    // 开
    const startTimePort =
      +new Date(item.starttimestamp) - +new Date(startTime.value);
    option.series[0].data = [
      [startTimePort, 0],
      [startTimePort + item.delay, 0],
    ];
    myChart.setOption(option);
  });
};

const createDelayEchart = () => {
  delayMax.value = props.dataSource[0].children[0].duration;
  startTime.value = props.dataSource[0].children[0].parent.starttimestamp;
  newDataSource.value = props.dataSource.reduce(function func(
    pre,
    curr,
    index,
    arr
  ) {
    pre.push({
      id: curr.id,
      label: curr.label,
      is_error: curr.is_error,
      service: curr.service,
      pid: curr.pid,
      delay: curr.delay,
      starttimestamp: curr.starttimestamp,
    });

    curr.children &&
      curr.children.length &&
      curr.children.forEach((v) => {
        v.pid = curr.id;
        func(pre, v);
      });
    return pre;
  },
    []);

  console.log("newDataSource", newDataSource);

  //   确定delay波动范围
  // let sortArr = [];
  // newDataSource.value.forEach((i) => {
  //   if (i.delay && typeof i.delay === "number") {
  //     sortArr.push(i.delay);
  //   }
  // });
  // sortArr.sort();
  // delayMax.value = sortArr[sortArr.length - 1];
  // delayMin.value = sortArr[0];

  nextTick(() => {
    initDelayTimeLine();
    initTimeLineInstance();
  });
};

const searchIndex = (a, b) => {
  let index = b.findIndex((item) => item === a.service);
  if (index > -1) {
    return props.globleColor[index];
  }
};

defineExpose({
  createDelayEchart,
});
</script>
<style lang="less" scoped>
:deep(.el-tree-node__content) {
  height: 58px;
}

.customNode {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

:deep(.el-progress-bar) {
  margin-right: 35px;
  width: 595px;
}

:deep(.el-progress-bar__outer) {
  background-color: #fff;
}

:deep(.el-tree-node__content) {
  position: relative;

  .el-icon {
    opacity: 0;
  }
}

:deep(.el-tree-node) {
  position: relative;
  padding-left: 20px;
}

:deep(.el-tree-node::before) {
  display: inline-block;
  content: "";
  width: 1px;
  height: 100%;
  border-right: 1px solid rgb(160, 160, 160);
  position: absolute;
  left: 13px;
  top: 0;
}

:deep(.el-tree-node::after) {
  content: "";
  position: absolute;
  width: 15px;
  left: 15px;
  top: 30px;
  border-top: 1px solid rgb(148, 148, 148);
}

:deep(.el-tree-node > .el-tree-node__content > .custom-tree-node) {
  font-weight: 700;
}

:deep(.el-tree-node .el-tree__children .el-tree-node__label) {
  font-size: 12px;
}

.circleClass {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #fff;
  margin-left: -14px;
}

.popoverBox {
  padding: 10px;
}

.containterContent {
  .NodeContentItem {
    display: flex;
    font-size: 16px;
    padding: 20px 0px;

    .itemWithKey {
      flex: 0.6;
      color: #9da4b2;
    }

    .itemWithValue {
      flex: 1;
      color: #515a64;
    }
  }
}

:deep(.el-drawer) {
  width: 42% !important;

  .el-drawer__header span {
    color: #000;
    font-size: 20px;
    font-weight: 700;
  }
}
</style>

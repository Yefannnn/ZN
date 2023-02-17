<template>
  <!-- 节点和服务 -->
  <el-card class="box-card" v-for="item in NodeAndServiceData" :key="item.id">
    <template #header>
      <div class="card-header">
        <span>{{ item.showTitle }}</span>
      </div>
    </template>

    <div class="nodeAndServiceItem" v-for="it in item.data" :key="it.id">
      <p class="itemsBgc">{{ it.name }}</p>
      <el-tooltip class="box-item" effect="dark" placement="top">
        <template #content>
          {{ it[nodeAndServiceMap[item.title]] }}
        </template>
        <el-progress
          color="#bf99f8"
          :percentage="
            Math.ceil((it[nodeAndServiceMap[item.title]] / item.max) * 100)
          "
        >
          <img
            style="margin-left: 20px; cursor: pointer"
            src="@/assets/images/详情.png"
            alt=""
          />
        </el-progress>
      </el-tooltip>
    </div>
  </el-card>

  <!-- 服务实例 -->
  <el-card class="box-card" v-for="item in serviceInstanceData" :key="item.id">
    <template #header>
      <div class="card-header">
        <span>{{ item.title }}</span>
        <!-- <el-button class="button" text>111</el-button> -->
      </div>
    </template>
    <div :class="`echart_${item.id}`" class="tabBox"></div>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import * as Echarts from "echarts";
let props = defineProps({
  NodeAndServiceData: {
    type: Array,
  },
  serviceInstanceData: {
    type: Array,
  },
});

// 将元数据进行时延排序
const delaySort = (originData, field, rank) => {
  originData.data.sort((a, b) => {
    if (rank === "order") {
      if (a[field] < b[field]) {
        return a[field] - b[field];
      }
    } else {
      if (a[field] < b[field]) {
        return b[field] - a[field];
      }
    }
  });
  return originData;
};

// 映射
const nodeAndServiceMap = {
  慢节点排序: "delay",
  节点错误率排序: "error",
  高负载节点排序: "payload",
  慢服务排序: "payload",
  服务错误率排序: "errorRate",
  高负载服务排序: "servicePayload",
};

// 数据整理
const packageNodeSort = ref({
  slow_Data: {
    // yAxisData: [],
    //     slowSortData: [],
    min: 0,
    max: 0,
  },
  error_Data: {
    // yAxisData: [],
    // errorNodeData: [],
    min: 0,
    max: 0,
  },
  payload_Data: {
    // yAxisData: [],
    // payloadNodeData: [],
    min: 0,
    max: 0,
  },
  slowService_Data: {
    // yAxisData: [],
    // slowServiceData: [],
    min: 0,
    max: 0,
  },
  errorRate_Data: {
    // yAxisData: [],
    // errorRateData: [],
    min: 0,
    max: 0,
  },
  servicePayload_Data: {
    // yAxisData: [],
    // hightPayloadData: [],
    min: 0,
    max: 0,
  },
  serviceDistributeDelay_Data: {
    xAxisData: [],
    yAxisData: [],
    serviceDistributeDelay: [],
  },
  serviceInstanceError_Data: {
    xAxisData: [],
    yAxisData: [],
    serviceInstanceErrorData: [],
  },
  servicePayloadheatMap_Data: {
    xAxisData: [],
    yAxisData: [],
    servicePayloadheatMapData: [],
  },
});

const packageOptionData = () => {
  const findIndexFun = (originData, items) => {
    let index = originData.findIndex((item) => item === items);
    return index > -1 ? index : "";
  };

  //   // 满节点整理
  //   const sortNodeData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "慢节点排序"),
  //     "delay",
  //     "order"
  //   );
  //   sortNodeData.data.length &&
  //     sortNodeData.data.forEach((item) => {
  //       packageNodeSort.value.slow_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.slow_Data.slowSortData.push(item.delay);
  //     });

  //   // 节点错误率整理
  //   const errorNodeData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "节点错误率排序"),
  //     "error",
  //     "order"
  //   );
  //   errorNodeData.data.length &&
  //     errorNodeData.data.forEach((item) => {
  //       packageNodeSort.value.error_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.error_Data.errorNodeData.push(item.error);
  //     });

  //   // 高负载节点整理
  //   const payloadNodeData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "高负载节点排序"),
  //     "payload",
  //     "order"
  //   );
  //   payloadNodeData.data.length &&
  //     payloadNodeData.data.forEach((item) => {
  //       packageNodeSort.value.payload_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.payload_Data.payloadNodeData.push(item.payload);
  //     });

  //   // 慢服务排序
  //   const slowNodeData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "慢服务排序"),
  //     "delay",
  //     "order"
  //   );
  //   slowNodeData.data.length &&
  //     slowNodeData.data.forEach((item) => {
  //       packageNodeSort.value.slowService_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.slowService_Data.slowServiceData.push(item.payload);
  //     });

  //   // 服务错误率整理
  //   const errorRateData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "服务错误率排序"),
  //     "errorRate",
  //     "order"
  //   );
  //   errorRateData.data.length &&
  //     errorRateData.data.forEach((item) => {
  //       packageNodeSort.value.errorRate_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.errorRate_Data.errorRateData.push(item.errorRate);
  //     });

  //   // 高负载服务整理
  //   const hightPayloadData = delaySort(
  //     props.serviceInstanceData.find((item) => item.title === "高负载服务排序"),
  //     "servicePayload",
  //     "order"
  //   );
  //   hightPayloadData.data.length &&
  //     hightPayloadData.data.forEach((item) => {
  //       packageNodeSort.value.servicePayload_Data.yAxisData.push(item.name);
  //       packageNodeSort.value.servicePayload_Data.hightPayloadData.push(
  //         item.servicePayload
  //       );
  //     });

  // 服务实例响应时延分布整理
  //#region
  const serviceDistributeDelay = props.serviceInstanceData.find(
    (item) => item.title === "服务实例响应时延分布热图"
  );
  serviceDistributeDelay.data.length &&
    serviceDistributeDelay.data.forEach((item, index) => {
      packageNodeSort.value.serviceDistributeDelay_Data.xAxisData.push(
        item.time
      );
      packageNodeSort.value.serviceDistributeDelay_Data.yAxisData.push(
        item.value
      );
    });
  // sort Y
  packageNodeSort.value.serviceDistributeDelay_Data.yAxisData.sort(
    (a, b) => a - b
  );
  // data

  serviceDistributeDelay.data.length &&
    serviceDistributeDelay.data.forEach((item) => {
      packageNodeSort.value.serviceDistributeDelay_Data.serviceDistributeDelay.push(
        [
          findIndexFun(
            packageNodeSort.value.serviceDistributeDelay_Data.xAxisData,
            item.time
          ),
          findIndexFun(
            packageNodeSort.value.serviceDistributeDelay_Data.yAxisData,
            item.value
          ),
          item.degree || "-",
        ]
      );
    });

  //#endregion

  //   服务实例错误率分布热图
  //#region
  const serviceInstanceError = props.serviceInstanceData.find(
    (item) => item.title === "服务实例错误率分布热图"
  );
  serviceInstanceError.data.length &&
    serviceInstanceError.data.forEach((item, index) => {
      packageNodeSort.value.serviceInstanceError_Data.xAxisData.push(item.time);
      packageNodeSort.value.serviceInstanceError_Data.yAxisData.push(
        item.value
      );
    });
  // sort Y
  packageNodeSort.value.serviceInstanceError_Data.yAxisData.sort(
    (a, b) => a - b
  );
  // data

  serviceInstanceError.data.length &&
    serviceInstanceError.data.forEach((item) => {
      packageNodeSort.value.serviceInstanceError_Data.serviceInstanceErrorData.push(
        [
          findIndexFun(
            packageNodeSort.value.serviceInstanceError_Data.xAxisData,
            item.time
          ),
          findIndexFun(
            packageNodeSort.value.serviceInstanceError_Data.yAxisData,
            item.value
          ),
          item.degree || "-",
        ]
      );
    });

  //#endregion

  // 服务实例负载分布热图
  //#region
  const servicePayloadheatMap = props.serviceInstanceData.find(
    (item) => item.title === "服务实例负载分布热图"
  );
  servicePayloadheatMap.data.length &&
    servicePayloadheatMap.data.forEach((item, index) => {
      packageNodeSort.value.servicePayloadheatMap_Data.xAxisData.push(
        item.time
      );
      packageNodeSort.value.servicePayloadheatMap_Data.yAxisData.push(
        item.value
      );
    });
  // sort Y
  packageNodeSort.value.servicePayloadheatMap_Data.yAxisData.sort(
    (a, b) => a - b
  );
  // data

  servicePayloadheatMap.data.length &&
    servicePayloadheatMap.data.forEach((item) => {
      packageNodeSort.value.servicePayloadheatMap_Data.servicePayloadheatMapData.push(
        [
          findIndexFun(
            packageNodeSort.value.servicePayloadheatMap_Data.xAxisData,
            item.time
          ),
          findIndexFun(
            packageNodeSort.value.servicePayloadheatMap_Data.yAxisData,
            item.value
          ),
          item.degree || "-",
        ]
      );
    });

  //#endregion

  // 慢节点整理 111
  props.NodeAndServiceData.forEach((item) => {
    // item.data.length &&
    //   item.title === "慢节点排序" &&

    if (item.title === "慢节点排序" && item.data.length) {
      const sortNodeData = delaySort(item, "delay", "order");
      item.min = sortNodeData.data[0].delay;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].delay;
    } else if (item.title === "节点错误率排序" && item.data.length) {
      const sortNodeData = delaySort(item, "error", "order");
      item.min = sortNodeData.data[0].error;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].error;
    } else if (item.title === "高负载节点排序" && item.data.length) {
      const sortNodeData = delaySort(item, "payload", "order");
      item.min = sortNodeData.data[0].payload;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].payload;
    } else if (item.title === "慢服务排序" && item.data.length) {
      const sortNodeData = delaySort(item, "payload", "order");
      item.min = sortNodeData.data[0].payload;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].payload;
    } else if (item.title === "服务错误率排序" && item.data.length) {
      const sortNodeData = delaySort(item, "errorRate", "order");
      item.min = sortNodeData.data[0].errorRate;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].errorRate;
    } else if (item.title === "高负载服务排序" && item.data.length) {
      const sortNodeData = delaySort(item, "servicePayload", "order");
      item.min = sortNodeData.data[0].servicePayload;
      item.max = sortNodeData.data[sortNodeData.data.length - 1].servicePayload;
    }
  });
};

let options = {
  //   慢节点排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.slow_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "满节点排序",
  //         type: "bar",
  //         data: packageNodeSort.value.slow_Data.slowSortData,
  //       },
  //     ],
  //   },
  //   节点错误率排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.error_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "节点错误率",
  //         type: "bar",
  //         data: packageNodeSort.value.error_Data.errorNodeData,
  //       },
  //     ],
  //   },
  //   高负载节点排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.payload_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "高负载节点排序",
  //         type: "bar",
  //         data: packageNodeSort.value.payload_Data.payloadNodeData,
  //       },
  //     ],
  //   },

  //   慢服务排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.slowService_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "慢服务排序",
  //         type: "bar",
  //         data: packageNodeSort.value.slowService_Data.slowServiceData,
  //       },
  //     ],
  //   },
  //   服务错误率排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.errorRate_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "慢服务排序",
  //         type: "bar",
  //         data: packageNodeSort.value.errorRate_Data.errorRateData,
  //       },
  //     ],
  //   },
  //   高负载服务排序: {
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     grid: {
  //       top: "1%",
  //       left: "1%",
  //       right: "4%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.01],
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: packageNodeSort.value.servicePayload_Data.yAxisData,
  //     },
  //     series: [
  //       {
  //         name: "高负载服务",
  //         type: "bar",
  //         data: packageNodeSort.value.servicePayload_Data.hightPayloadData,
  //       },
  //     ],
  //   },
  服务实例响应时延分布热图: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      //   height: "50%",
      top: "1%",
      bottom: "10%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.serviceDistributeDelay_Data.xAxisData,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: packageNodeSort.value.serviceDistributeDelay_Data.yAxisData,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 20,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: [
      {
        name: "Punch Card",
        type: "heatmap",
        data: packageNodeSort.value.serviceDistributeDelay_Data
          .serviceDistributeDelay,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },
  服务实例错误率分布热图: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      //   height: "50%",
      top: "1%",
      bottom: "10%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.serviceInstanceError_Data.xAxisData,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: packageNodeSort.value.serviceInstanceError_Data.yAxisData,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 20,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: [
      {
        name: "Punch Card",
        type: "heatmap",
        data: packageNodeSort.value.serviceInstanceError_Data
          .serviceInstanceErrorData,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },
  服务实例负载分布热图: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      //   height: "50%",
      top: "1%",
      bottom: "10%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.servicePayloadheatMap_Data.xAxisData,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: packageNodeSort.value.servicePayloadheatMap_Data.yAxisData,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 20,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: [
      {
        name: "Punch Card",
        type: "heatmap",
        data: packageNodeSort.value.servicePayloadheatMap_Data
          .servicePayloadheatMapData,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },
};

const initNodeEchart = () => {
  // 获取数据并整理
  packageOptionData();
  props.serviceInstanceData.forEach((item) => {
    let Dom = document.querySelector(`.echart_${item.id}`);
    Echarts.dispose(Dom);
    let myChart = Echarts.init(Dom);
    myChart.setOption(options[item.title]);
  });
};

onMounted(() => {
  initNodeEchart();
});
</script>
<style lang="less" scoped>
.el-card {
  width: 580px;
  margin: 10px 13px;
  :deep(.el-card__header) {
    padding: 10px;
    background-color: #f3f4f9;
  }
  :deep(.el-card__body) {
    height: 210px;
    overflow: auto;
  }
}

.tabBox {
  width: 100%;
  height: 170px;
}

.itemsBgc {
  display: inline-block;
  padding: 2px 4px;
  background-color: #40454e;
  color: #fff;
  border-radius: 4px;
}
</style>

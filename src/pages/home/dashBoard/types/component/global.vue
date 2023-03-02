<template>
  <!-- 节点和服务 -->
  <el-card class="box-card" v-for="(item, index) in NodeAndServiceData" :key="index">
    <template #header>
      <div class="card-header">
        <span>{{ item.showTitle }}</span>
      </div>
    </template>

    <div class="nodeAndServiceItem" v-for="it in item.data" :key="it.id">
      <p class="itemsBgc">{{ it.name }}</p>
      <el-tooltip class="box-item" effect="dark" placement="top">
        <template #content>
          <div>
            {{ it[nodeAndServiceMap[item.title]] }}
          </div>
        </template>

        <el-progress color="#bf99f8" :percentage="
          Math.ceil((it[nodeAndServiceMap[item.title]] / item.max) * 100)
        ">
          <img style="margin-left: 20px; cursor: pointer" src="@/assets/images/详情.png" alt="" />
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
import { ref, onMounted, watch, nextTick } from "vue";
import * as Echarts from "echarts";
import { formatterTime } from "@/utils/Funs";
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
    min: 0,
    max: 0,
  },
  error_Data: {
    min: 0,
    max: 0,
  },
  payload_Data: {
    min: 0,
    max: 0,
  },
  slowService_Data: {
    min: 0,
    max: 0,
  },
  errorRate_Data: {
    min: 0,
    max: 0,
  },
  servicePayload_Data: {
    min: 0,
    max: 0,
  },
  serviceDistributeDelay_Data: {
    xAxisData: [],
    yAxisData: [50, 100, 150, 200, 250],
    serviceDistributeDelay: [],
  },
  serviceInstanceError_Data: {
    xAxisData: [],
    yAxisData: [20, 40, 60, 80, 100],

    serviceInstanceErrorData: [],
  },
  servicePayloadheatMap_Data: {
    xAxisData: [],
    yAxisData: [20, 40, 60, 80, 100],

    servicePayloadheatMapData: [],
  },
});

const packageOptionData = () => {
  const findIndexFun = (originData, items) => {
    let index = originData.findIndex((item) => item === items);
    return index > -1 ? index : "";
  };

  const findIndexWithServiceFun = (originData, item) => {
    let targetIndex = originData.length - 1;
    for (let index = 0; index < originData.length; index++) {
      if (item <= originData[index]) {
        targetIndex = index;
        break;
      }
    }
    return targetIndex;
  };

  watch(props.serviceInstanceData, (newValue) => {
    console.log("new", newValue);

    // 服务实例响应时延分布整理
    //#region
    const serviceDistributeDelay = newValue.find(
      (item) => item?.title === "服务实例响应时延分布热图"
    );
    serviceDistributeDelay &&
      serviceDistributeDelay.data.length &&
      serviceDistributeDelay.data.forEach((item, index) => {
        packageNodeSort.value.serviceDistributeDelay_Data.xAxisData.push(
          item.time
        );
      });

    // data
    let reducer1 =
      serviceDistributeDelay &&
      serviceDistributeDelay.data.length &&
      serviceDistributeDelay.data.reduce((pre, curr) => {
        pre[curr.time] ? (pre[curr.time] += 1) : (pre[curr.time] = 1);
        return pre;
      }, {});
    console.log("reducer1", reducer1);

    serviceDistributeDelay &&
      serviceDistributeDelay.data.length &&
      serviceDistributeDelay.data.forEach((item) => {
        packageNodeSort.value.serviceDistributeDelay_Data.serviceDistributeDelay.push(
          [
            findIndexFun(
              packageNodeSort.value.serviceDistributeDelay_Data.xAxisData,
              item.time
            ),
            findIndexWithServiceFun(
              packageNodeSort.value.serviceDistributeDelay_Data.yAxisData,
              item.value
            ),
            reducer1[item.time] || "-",
          ]
        );
      });
    console.log(
      "packageNodeSort.value.serviceDistributeDelay_Data.serviceDistributeDelay",
      packageNodeSort.value.serviceDistributeDelay_Data.serviceDistributeDelay
    );

    //#endregion

    //   服务实例错误率分布热图
    //#region

    const serviceInstanceError = newValue.find(
      (item) => item?.title === "服务实例错误率分布热图"
    );
    console.log(" serviceInstanceError.data", serviceInstanceError.data);
    serviceInstanceError &&
      serviceInstanceError.data.length &&
      serviceInstanceError.data.forEach((item, index) => {
        packageNodeSort.value.serviceInstanceError_Data.xAxisData.push(
          item.time
        );
      });

    // 错误率为空给默认坐标
    if (!serviceInstanceError.data.length) {
      serviceDistributeDelay &&
        serviceDistributeDelay.data.length &&
        serviceDistributeDelay.data.forEach((item, index) => {
          packageNodeSort.value.serviceInstanceError_Data.xAxisData.push(
            item.time
          );
        });
    }

    // data

    let reducer2 =
      serviceInstanceError &&
      serviceInstanceError.data.length &&
      serviceInstanceError.data.reduce((pre, curr) => {
        pre[curr.time] ? (pre[curr.time] += 1) : (pre[curr.time] = 1);
        return pre;
      }, {});

    serviceInstanceError &&
      serviceInstanceError.data.length &&
      serviceInstanceError.data.forEach((item) => {
        packageNodeSort.value.serviceInstanceError_Data.serviceInstanceErrorData.push(
          [
            findIndexFun(
              packageNodeSort.value.serviceInstanceError_Data.xAxisData,
              item.time
            ),
            findIndexWithServiceFun(
              packageNodeSort.value.serviceInstanceError_Data.yAxisData,
              item.value
            ),
            reducer2[item.time] || "-",
          ]
        );
      });

    //#endregion

    // 服务实例负载分布热图
    //#region
    const servicePayloadheatMap = newValue.find(
      (item) => item?.title === "服务实例负载分布热图"
    );
    servicePayloadheatMap &&
      servicePayloadheatMap.data.length &&
      servicePayloadheatMap.data.forEach((item, index) => {
        packageNodeSort.value.servicePayloadheatMap_Data.xAxisData.push(
          item.time
        );
      });

    // data

    let reducer3 =
      servicePayloadheatMap &&
      servicePayloadheatMap.data.length &&
      servicePayloadheatMap.data.reduce((pre, curr) => {
        pre[curr.time] ? (pre[curr.time] += 1) : (pre[curr.time] = 1);
        return pre;
      }, {});
    console.log("reducer3", reducer3);

    servicePayloadheatMap &&
      servicePayloadheatMap.data.length &&
      servicePayloadheatMap.data.forEach((item) => {
        packageNodeSort.value.servicePayloadheatMap_Data.servicePayloadheatMapData.push(
          [
            findIndexFun(
              packageNodeSort.value.servicePayloadheatMap_Data.xAxisData,
              item.time
            ),
            findIndexWithServiceFun(
              packageNodeSort.value.servicePayloadheatMap_Data.yAxisData,
              item.value
            ),
            reducer3[item.time] || "-",
          ]
        );
      });

    //#endregion
  });

  watch(props.NodeAndServiceData, (newValue) => {
    console.log('newValue', newValue);
    newValue.forEach((item) => {
      // item.data.length &&
      //   item.title === "慢节点排序" &&
      if (item.title === "慢节点排序" && item.data.length) {
        const sortNodeData = delaySort(item, "delay", "descending");
        item.max = sortNodeData.data[0].delay;
        item.min = sortNodeData.data[sortNodeData.data.length - 1].delay;
      } else if (item.title === "节点错误率排序" && item.data.length) {
        const sortNodeData = delaySort(item, "error", "descending");
        item.max = sortNodeData.data[0].error;
        item.min = sortNodeData.data[sortNodeData.data.length - 1].error;
      } else if (item.title === "高负载节点排序" && item.data.length) {
        const sortNodeData = delaySort(item, "payload", "descending");
        item.max = sortNodeData.data[0].payload;
        item.min = sortNodeData.data[sortNodeData.data.length - 1].payload;
      } else if (item.title === "慢服务排序" && item.data.length) {
        const sortNodeData = delaySort(item, "payload", "descending");
        item.max = sortNodeData.data[0].payload;
        item.min = sortNodeData.data[sortNodeData.data.length - 1].payload;
      } else if (item.title === "服务错误率排序" && item.data.length) {
        const sortNodeData = delaySort(item, "errorRate", "descending");
        item.max = sortNodeData.data[0].errorRate;
        item.min = sortNodeData.data[sortNodeData.data.length - 1].errorRate;
      } else if (item.title === "高负载服务排序" && item.data.length) {
        const sortNodeData = delaySort(item, "servicePayload", "descending");
        item.max = sortNodeData.data[0].servicePayload;
        item.min =
          sortNodeData.data[sortNodeData.data.length - 1].servicePayload;
      }
    });
  });
};

let options = {
  服务实例响应时延分布热图: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      //   height: "50%",
      top: "1%",
      bottom: "20%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.serviceDistributeDelay_Data.xAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
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
      bottom: "20%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.serviceInstanceError_Data.xAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
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
      bottom: "20%",
      left: "8%",
    },
    xAxis: {
      type: "category",
      data: packageNodeSort.value.servicePayloadheatMap_Data.xAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
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
  watch(props.serviceInstanceData, (newValue) => {
    newValue.forEach((item) => {
      nextTick(() => {
        let Dom = document.querySelector(`.echart_${item.id}`);
        Echarts.dispose(Dom);
        let myChart = Echarts.init(Dom);
        myChart.setOption(options[item.title]);
      });
    });
    console.log("opt", options);
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

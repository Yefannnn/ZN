<template>
  <div class="APMBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in paneTabData"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <div class="GlobalBox" v-if="item.name === 'Global'">
          <!-- 节点和服务 -->
          <el-card
            class="box-card"
            v-for="item in NodeAndServiceData"
            :key="item.id"
          >
            <template #header>
              <div class="card-header">
                <span>{{ item.title }}</span>
              </div>
            </template>

            <div
              class="nodeAndServiceItem"
              v-for="it in item.data"
              :key="it.id"
            >
              <p>{{ it.name }}</p>
              <el-progress
                color="#bf99f8"
                :percentage="
                  Math.ceil(
                    (it[nodeAndServiceMap[item.title]] / item.max) * 100
                  )
                "
              >
                <el-button text>按钮</el-button>
              </el-progress>
            </div>
          </el-card>

          <!-- 服务实例 -->
          <el-card
            class="box-card"
            v-for="item in serviceInstanceData"
            :key="item.id"
          >
            <template #header>
              <div class="card-header">
                <span>{{ item.title }}</span>
                <!-- <el-button class="button" text>111</el-button> -->
              </div>
            </template>
            <div :class="`echart_${item.id}`" class="tabBox"></div>
          </el-card>
        </div>
        <div class="ServiceBox" v-if="item.name === 'Service'">222</div>
        <div class="InstanceBox" v-if="item.name === 'Instance'">333</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { nanoid } from "nanoid";
import * as Echarts from "echarts";
const activeName = ref("Global");

const paneTabData = ref([
  {
    label: "Global",
    name: "Global",
  },
  {
    label: "Service",
    name: "Service",
  },
  {
    label: "Instance",
    name: "Instance",
  },
]);

// 节点和服务 数据
let NodeAndServiceData = ref([
  {
    id: nanoid(),
    title: "慢节点排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        delay: 20,
      },
      {
        id: nanoid(),
        name: "02",
        delay: 25,
      },
      {
        id: nanoid(),
        name: "03",
        delay: 22,
      },
      {
        id: nanoid(),
        name: "04",
        delay: 28,
      },
      {
        id: nanoid(),
        name: "05",
        delay: 36,
      },
    ],
  },
  {
    id: nanoid(),
    title: "节点错误率排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        error: 14,
      },
      {
        id: nanoid(),
        name: "02",
        error: 16,
      },
      {
        id: nanoid(),
        name: "03",
        error: 19,
      },
      {
        id: nanoid(),
        name: "04",
        error: 11,
      },
      {
        id: nanoid(),
        name: "05",
        error: 8,
      },
    ],
  },
  {
    id: nanoid(),
    title: "高负载节点排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        payload: 80,
      },
      {
        id: nanoid(),
        name: "02",
        payload: 85,
      },
      {
        id: nanoid(),
        name: "03",
        payload: 89,
      },
      {
        id: nanoid(),
        name: "04",
        payload: 98,
      },
      {
        id: nanoid(),
        name: "05",
        payload: 92,
      },
    ],
  },
  {
    id: nanoid(),
    title: "慢服务排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        payload: 82,
      },
      {
        id: nanoid(),
        name: "02",
        payload: 68,
      },
      {
        id: nanoid(),
        name: "03",
        payload: 101,
      },
      {
        id: nanoid(),
        name: "04",
        payload: 150,
      },
      {
        id: nanoid(),
        name: "05",
        payload: 260,
      },
    ],
  },
  {
    id: nanoid(),
    title: "服务错误率排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        errorRate: 10,
      },
      {
        id: nanoid(),
        name: "02",
        errorRate: 9,
      },
      {
        id: nanoid(),
        name: "03",
        errorRate: 8,
      },
      {
        id: nanoid(),
        name: "04",
        errorRate: 12,
      },
      {
        id: nanoid(),
        name: "05",
        errorRate: 5,
      },
    ],
  },
  {
    id: nanoid(),
    title: "高负载服务排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        servicePayload: 80,
      },
      {
        id: nanoid(),
        name: "02",
        servicePayload: 85,
      },
      {
        id: nanoid(),
        name: "03",
        servicePayload: 89,
      },
      {
        id: nanoid(),
        name: "04",
        servicePayload: 98,
      },
      {
        id: nanoid(),
        name: "05",
        servicePayload: 92,
      },
    ],
  },
]);

// 服务实例 数据
let serviceInstanceData = ref([
  {
    id: nanoid(),
    title: "服务实例响应时延分布热图",
    data: [
      {
        id: nanoid(),
        name: "01",
        time: "2023-2-15 15:06",
        value: 200,
        degree: 5,
      },
      {
        id: nanoid(),
        name: "02",
        time: "2023-2-15 15:46",
        value: 500,
        degree: 8,
      },
      {
        id: nanoid(),
        name: "03",
        time: "2023-2-15 20:46",
        value: 560,
        degree: 4,
      },
      {
        id: nanoid(),
        name: "04",
        time: "2023-2-15 22:46",
        value: 230,
        degree: 9,
      },
      {
        id: nanoid(),
        name: "05",
        time: "2023-2-16 15:46",
        value: 120,
        degree: 6,
      },
    ],
  },
  {
    id: nanoid(),
    title: "服务实例错误率分布热图",
    data: [
      {
        id: nanoid(),
        name: "01",
        time: "2023-2-15 15:06",
        value: 230,
        degree: 3,
      },
      {
        id: nanoid(),
        name: "02",
        time: "2023-2-15 15:46",
        value: 126,
        degree: 5,
      },
      {
        id: nanoid(),
        name: "03",
        time: "2023-2-15 20:46",
        value: 640,
        degree: 10,
      },
      {
        id: nanoid(),
        name: "04",
        time: "2023-2-15 22:46",
        value: 200,
        degree: 15,
      },
      {
        id: nanoid(),
        name: "05",
        time: "2023-2-16 15:46",
        value: 320,
        degree: 13,
      },
    ],
  },
  {
    id: nanoid(),
    title: "服务实例负载分布热图",
    data: [
      {
        id: nanoid(),
        name: "01",
        time: "2023-2-15 15:06",
        value: 200,
        degree: 5,
      },
      {
        id: nanoid(),
        name: "02",
        time: "2023-2-15 15:46",
        value: 20,
        degree: 8,
      },
      {
        id: nanoid(),
        name: "03",
        time: "2023-2-15 20:46",
        value: 58,
        degree: 4,
      },
      {
        id: nanoid(),
        name: "04",
        time: "2023-2-15 22:46",
        value: 130,
        degree: 9,
      },
      {
        id: nanoid(),
        name: "05",
        time: "2023-2-16 15:46",
        value: 150,
        degree: 6,
      },
    ],
  },
]);

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
  //     serviceInstanceData.value.find((item) => item.title === "慢节点排序"),
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
  //     serviceInstanceData.value.find((item) => item.title === "节点错误率排序"),
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
  //     serviceInstanceData.value.find((item) => item.title === "高负载节点排序"),
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
  //     serviceInstanceData.value.find((item) => item.title === "慢服务排序"),
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
  //     serviceInstanceData.value.find((item) => item.title === "服务错误率排序"),
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
  //     serviceInstanceData.value.find((item) => item.title === "高负载服务排序"),
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
  const serviceDistributeDelay = serviceInstanceData.value.find(
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
  const serviceInstanceError = serviceInstanceData.value.find(
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
  const servicePayloadheatMap = serviceInstanceData.value.find(
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

  // 慢节点整理 111
  NodeAndServiceData.value.forEach((item) => {
    // item.data.length &&
    //   item.title === "慢节点排序" &&

    if (item.title === "慢节点排序" && item.data.length) {
      item.data.forEach((it) => {
        it.delay > packageNodeSort.value.slow_Data.max
          ? (packageNodeSort.value.slow_Data.max = it.delay)
          : "";
        it.delay < packageNodeSort.value.slow_Data.min
          ? (packageNodeSort.value.slow_Data.min = it.delay)
          : "";
      });
      item.min = packageNodeSort.value.slow_Data.min;
      item.max = packageNodeSort.value.slow_Data.max;
    } else if (item.title === "节点错误率排序" && item.data.length) {
      item.data.forEach((it) => {
        it.error > packageNodeSort.value.error_Data.max
          ? (packageNodeSort.value.error_Data.max = it.error)
          : "";
        it.error < packageNodeSort.value.error_Data.min
          ? (packageNodeSort.value.error_Data.min = it.error)
          : "";
      });
      item.min = packageNodeSort.value.error_Data.min;
      item.max = packageNodeSort.value.error_Data.max;
    } else if (item.title === "高负载节点排序" && item.data.length) {
      item.data.forEach((it) => {
        it.payload > packageNodeSort.value.payload_Data.max
          ? (packageNodeSort.value.payload_Data.max = it.payload)
          : "";
        it.payload < packageNodeSort.value.payload_Data.min
          ? (packageNodeSort.value.payload_Data.min = it.payload)
          : "";
      });
      item.min = packageNodeSort.value.payload_Data.min;
      item.max = packageNodeSort.value.payload_Data.max;
    } else if (item.title === "慢服务排序" && item.data.length) {
      item.data.forEach((it) => {
        it.payload > packageNodeSort.value.slowService_Data.max
          ? (packageNodeSort.value.slowService_Data.max = it.payload)
          : "";
        it.payload < packageNodeSort.value.slowService_Data.min
          ? (packageNodeSort.value.slowService_Data.min = it.payload)
          : "";
      });
      item.min = packageNodeSort.value.slowService_Data.min;
      item.max = packageNodeSort.value.slowService_Data.max;
    } else if (item.title === "服务错误率排序" && item.data.length) {
      item.data.forEach((it) => {
        it.errorRate > packageNodeSort.value.errorRate_Data.max
          ? (packageNodeSort.value.errorRate_Data.max = it.errorRate)
          : "";
        it.errorRate < packageNodeSort.value.errorRate_Data.min
          ? (packageNodeSort.value.errorRate_Data.min = it.errorRate)
          : "";
      });
      item.min = packageNodeSort.value.errorRate_Data.min;
      item.max = packageNodeSort.value.errorRate_Data.max;
    } else if (item.title === "高负载服务排序" && item.data.length) {
      item.data.forEach((it) => {
        it.servicePayload > packageNodeSort.value.servicePayload_Data.max
          ? (packageNodeSort.value.servicePayload_Data.max = it.servicePayload)
          : "";
        it.servicePayload < packageNodeSort.value.servicePayload_Data.min
          ? (packageNodeSort.value.servicePayload_Data.min = it.servicePayload)
          : "";
      });
      item.min = packageNodeSort.value.servicePayload_Data.min;
      item.max = packageNodeSort.value.servicePayload_Data.max;
    }
  });
};
console.log("NodeAndServiceData", NodeAndServiceData);

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
      position: "top",
    },
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
      position: "top",
    },
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
      position: "top",
    },
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
  serviceInstanceData.value.forEach((item) => {
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
.APMBox {
  width: 100%;
  height: calc(100% - 48px - 50px);
  background-color: #fff;
  .GlobalBox {
    display: flex;
    flex-wrap: wrap;
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
  }
  .ServiceBox {
  }
  .InstanceBox {
  }
}

:deep(.el-tabs__nav-scroll) {
  background-color: #f3f4f9;
  padding: 0 20px;
}
:deep(.el-tabs__content) {
  padding: 0 20px;
}

:deep(.el-tabs__content .el-card:nth-child(n-3)) {
  margin-top: 0;
}

.tabBox {
  width: 100%;
  height: 170px;
}

:deep(::-webkit-scrollbar) {
  width: 5px;
  background-color: #ffffff;
}
:deep(::-webkit-scrollbar-thumb) {
  background-color: #409eff90;
}
</style>

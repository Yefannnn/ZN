<template>
  <div class="APMBox" v-loading="tabLoading">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane
        v-for="item in paneTabData"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <div class="GlobalBox" v-if="item.name === 'Global'">
          <Global
            :NodeAndServiceData="NodeAndServiceData"
            :serviceInstanceData="serviceInstanceData"
          ></Global>
        </div>
        <div class="ServiceBox" v-if="item.name === 'Service'">
          <Service
            style="width: 100%"
            ref="serviceInstance"
            :serviceNth3="serviceNth3"
            :serviceInstanceSort="serviceInstanceSort"
          ></Service>
        </div>
        <div class="InstanceBox" v-if="item.name === 'Instance'">
          <Instance
            ref="instance"
            :InstanceOriginData="InstanceOriginData"
          ></Instance>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { nanoid } from "nanoid";
import {
  slowNodeSortAPI,
  slowNodeErrorRateSortAPI,
  highPayloadSortAPI,
  serviceInstanceErrorAPI,
  serviceInstancePayloadAPI,
  serviceDelayAPI,
} from "@/api/index";

import Global from "./component/global.vue";
import Service from "./component/service.vue";
import Instance from "./component/Instance.vue";
import { ElLoading, ElMessage } from "element-plus";

const tabLoading = ref(false);

const activeName = ref("Global");

const serviceInstance = ref(null);
const instance = ref(null);
const handleClick = (name) => {
  if (activeName.value === "Service") {
    nextTick(() => {
      serviceInstance.value[0].initEcharsInstance();
    });
  } else if (activeName.value === "Instance") {
    nextTick(() => {
      instance.value[0].initEcharsInstance();
    });
  }
};

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

// Global -- 节点和服务 数据
let NodeAndServiceData = ref([]);

//#region
// let NodeAndServiceData = ref([
//   {
//     id: nanoid(),
//     title: "慢节点排序",
//     showTitle: "慢节点排序(ms)",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         delay: 20,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         delay: 25,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         delay: 22,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         delay: 28,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         delay: 36,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "节点错误率排序",
//     showTitle: "节点错误率排序(%)",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         error: 14,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         error: 16,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         error: 19,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         error: 11,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         error: 8,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "高负载节点排序",
//     showTitle: "高负载节点排序(CPM)",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         payload: 80,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         payload: 85,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         payload: 89,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         payload: 98,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         payload: 92,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "慢服务排序",
//     showTitle: "慢服务排序(ms)",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         payload: 82,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         payload: 68,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         payload: 101,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         payload: 150,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         payload: 260,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "服务错误率排序",
//     showTitle: "服务错误率排序(%)",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         errorRate: 10,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         errorRate: 9,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         errorRate: 8,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         errorRate: 12,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         errorRate: 5,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "高负载服务排序",
//     showTitle: "高负载服务排序(CPM)",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         servicePayload: 80,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         servicePayload: 85,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         servicePayload: 89,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         servicePayload: 98,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         servicePayload: 92,
//       },
//     ],
//   },
// ]);
//#endregion

// Global -- 服务实例 数据
let serviceInstanceData = ref([]);

//#region
// let serviceInstanceData = ref([
//   {
//     id: nanoid(),
//     title: "服务实例响应时延分布热图",
//     showTitle: "服务实例响应时延分布热图",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         time: "2023-2-15 15:06",
//         value: 200,
//         degree: 5,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         time: "2023-2-15 15:46",
//         value: 500,
//         degree: 8,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         time: "2023-2-15 20:46",
//         value: 560,
//         degree: 4,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         time: "2023-2-15 22:46",
//         value: 230,
//         degree: 9,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         time: "2023-2-16 15:46",
//         value: 120,
//         degree: 6,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "服务实例错误率分布热图",
//     showTitle: "服务实例错误率分布热图",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         time: "2023-2-15 15:06",
//         value: 230,
//         degree: 3,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         time: "2023-2-15 15:46",
//         value: 126,
//         degree: 5,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         time: "2023-2-15 20:46",
//         value: 640,
//         degree: 10,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         time: "2023-2-15 22:46",
//         value: 200,
//         degree: 15,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         time: "2023-2-16 15:46",
//         value: 320,
//         degree: 13,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "服务实例负载分布热图",
//     showTitle: "服务实例负载分布热图",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         time: "2023-2-15 15:06",
//         value: 200,
//         degree: 5,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         time: "2023-2-15 15:46",
//         value: 20,
//         degree: 8,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         time: "2023-2-15 20:46",
//         value: 58,
//         degree: 4,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         time: "2023-2-15 22:46",
//         value: 130,
//         degree: 9,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         time: "2023-2-16 15:46",
//         value: 150,
//         degree: 6,
//       },
//     ],
//   },
// ]);
//#endregion

// Service -- 时延 成功率 负载
// let serviceNth3 = ref([
//   {
//     id: nanoid(),
//     title: "平均响应时延",
//     showTitle: "平均响应时延(ms)",
//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [20, 60, 12, 65, 15, 35],
//     },
//   },
//   {
//     id: nanoid(),
//     title: "请求成功率",
//     showTitle: "请求成功率(%)",

//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [89, 91, 97, 95, 87, 89],
//     },
//   },
//   {
//     id: nanoid(),
//     title: "服务负载",
//     showTitle: "服务负载(CPM)",

//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [89, 91, 97, 95, 87, 89],
//     },
//   },
// ]);
let serviceNth3 = ref([]);

// Service -- 服务实例条形图

// let serviceInstanceSort = ref([
//   {
//     id: nanoid(),
//     title: "慢服务实例排序",
//     showTitle: "慢服务实例排序",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         value: 200,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         value: 158,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         value: 212,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         value: 245,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         value: 203,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "服务实例成功率排序",
//     showTitle: "服务实例成功率排序",
//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         value: 89,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         value: 92,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         value: 93,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         value: 98,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         value: 99,
//       },
//     ],
//   },
//   {
//     id: nanoid(),
//     title: "服务实例负载排序",
//     showTitle: "服务实例负载排序",

//     data: [
//       {
//         id: nanoid(),
//         name: "01",
//         value: 89,
//       },
//       {
//         id: nanoid(),
//         name: "02",
//         value: 92,
//       },
//       {
//         id: nanoid(),
//         name: "03",
//         value: 93,
//       },
//       {
//         id: nanoid(),
//         name: "04",
//         value: 98,
//       },
//       {
//         id: nanoid(),
//         name: "05",
//         value: 99,
//       },
//     ],
//   },
// ]);
let serviceInstanceSort = ref([]);

// let InstanceOriginData = ref([
//   {
//     id: nanoid(),
//     title: "平均响应时延",
//     showTitle: "平均响应时延(ms)",
//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [20, 60, 12, 65, 15, 35],
//     },
//   },
//   {
//     id: nanoid(),
//     title: "请求成功率",
//     showTitle: "请求成功率(%)",

//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [89, 98, 99, 87, 85, 94],
//     },
//   },
//   {
//     id: nanoid(),
//     title: "负载",
//     showTitle: "负载(CPM)",
//     data: {
//       xAxis: [
//         "2023-2-10 15:00",
//         "2023-2-10 16:00",
//         "2023-2-10 16:20",
//         "2023-2-10 16:30",
//         "2023-2-10 17:00",
//         "2023-2-10 17:10",
//       ],
//       realityData: [52, 88, 65, 69, 57, 78],
//     },
//   },
// ]);
let InstanceOriginData = ref([]);

// Global数据整理方法
const packageNodeAndServiceOrigin = (type, originData) => {
  switch (type) {
    case "慢节点排序":
      let useOrigin = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          delay: item.duration,
        };
      });
      let packageObj = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin,
      };
      NodeAndServiceData.value[0] = packageObj;
      break;
    case "节点错误率排序":
      let useOrigin1 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          error: item.percent * 100,
        };
      });
      let packageObj1 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin1,
      };
      NodeAndServiceData.value[1] = packageObj1;
      break;
    case "高负载节点排序":
      let useOrigin2 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          payload: item.load,
        };
      });
      let packageObj2 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin2,
      };
      NodeAndServiceData.value[2] = packageObj2;
      break;
    case "慢服务排序":
      let useOrigin3 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          payload: item.duration,
        };
      });
      let packageObj3 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin3,
      };
      NodeAndServiceData.value[3] = packageObj3;
      break;
    case "服务错误率排序":
      let useOrigin4 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          errorRate: item.percent * 100,
        };
      });
      let packageObj4 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin4,
      };
      NodeAndServiceData.value[4] = packageObj4;
      break;
    case "高负载服务排序":
      let useOrigin5 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          servicePayload: item.load,
        };
      });
      let packageObj5 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: useOrigin5,
      };
      NodeAndServiceData.value[5] = packageObj5;
      break;

    case "服务实例响应时延分布热图":
      let useOrigin8 = originData.map((item) => {
        return {
          id: nanoid(),
          name: nanoid(),
          time: item.time,
          value: item.duration,
        };
      });
      let packageObj8 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: useOrigin8,
      };
      serviceInstanceData.value[0] = packageObj8;
      break;
    case "服务实例错误率分布热图":
      let useOrigin6 = originData.map((item) => {
        return {
          id: nanoid(),
          name: nanoid(),
          time: item.start_time,
          value: item.error_percent,
        };
      });
      let packageObj6 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: useOrigin6,
      };
      serviceInstanceData.value[1] = packageObj6;
      break;
    case "服务实例负载分布热图":
      let useOrigin7 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          time: item.time,
          value: item.load,
        };
      });
      let packageObj7 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: useOrigin7,
      };
      serviceInstanceData.value[2] = packageObj7;
      break;

    default:
      break;
  }
};

//  Service数据整理
const packageServiceOrigin = (type, originData) => {
  switch (type) {
    case "平均响应时延":
      let targetObj = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj.data.xAxis.push(item.time);
        targetObj.data.realityData.push(item.duration);
      });
      serviceNth3.value[0] = targetObj;
      break;
    case "服务负载":
      let targetObj1 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(CPM)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj1.data.xAxis.push(item.time);
        targetObj1.data.realityData.push(item.load);
      });
      serviceNth3.value[2] = targetObj1;
      break;
    case "请求成功率":
      let targetObj2 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(%)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj2.data.xAxis.push(item.start_time);
        targetObj2.data.realityData.push(item.error_percent);
      });
      serviceNth3.value[1] = targetObj2;
      console.log(targetObj2);
      break;
    case "慢服务实例排序":
      let targetArr = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          value: item.duration,
        };
      });
      let targetObj3 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: targetArr,
      };
      serviceInstanceSort.value[0] = targetObj3;
      break;
    case "服务实例成功率排序":
      let targetArr1 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          value: item.percent * 100,
        };
      });
      let targetObj4 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: targetArr1,
      };
      serviceInstanceSort.value[1] = targetObj4;
      break;
    case "服务实例负载排序":
      let targetArr2 = originData.map((item) => {
        return {
          id: nanoid(),
          name: item.service_name,
          value: item.load,
        };
      });
      let targetObj5 = {
        id: nanoid(),
        title: type,
        showTitle: type,
        data: targetArr2,
      };
      serviceInstanceSort.value[2] = targetObj5;
      break;

    default:
      break;
  }
};

// instance 数据整理
const packageInstanceOrigin = (type, originData) => {
  switch (type) {
    case "平均响应时延":
      let targetObj = {
        id: nanoid(),
        title: type,
        showTitle: type + "(ms)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj.data.xAxis.push(item.time);
        targetObj.data.realityData.push(item.duration);
      });
      InstanceOriginData.value[0] = targetObj;
      break;

    case "负载":
      let targetObj1 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(CPM)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj1.data.xAxis.push(item.time);
        targetObj1.data.realityData.push(item.load);
      });
      InstanceOriginData.value[2] = targetObj1;
      break;
    case "请求成功率":
      let targetObj2 = {
        id: nanoid(),
        title: type,
        showTitle: type + "(%)",
        data: {
          xAxis: [],
          realityData: [],
        },
      };
      originData.forEach((item) => {
        targetObj2.data.xAxis.push(item.start_time);
        targetObj2.data.realityData.push(item.error_percent);
      });
      InstanceOriginData.value[1] = targetObj2;
      break;

    default:
      break;
  }
};

//

// 获取数据
const getGlobalOfServiceAndNodeData = async () => {
  try {
    tabLoading.value = true;
    // 慢节点/ 服务

    let slowNodeAndServiceOriginData = await slowNodeSortAPI();

    // 节点/服务 错误率

    let slowNodeErrorRateSortOriginData = await slowNodeErrorRateSortAPI({
      type: 0,
    });

    // 节点/服务  高负载

    let highPayloadSortOriginData = await highPayloadSortAPI();

    // 实例错误率热图

    let serviceInstanceErrorOriginData = await serviceInstanceErrorAPI({
      name: "server-previous",
      type: 0,
    });

    // 实例负载热图
    let serviceInstancePayloadOriginData = await serviceInstancePayloadAPI(
      "server-previous"
    );

    // 服务平均时延
    let serviceDelayOriginData = await serviceDelayAPI("server-next");

    let servicerequestSuccessOriginData = await serviceInstanceErrorAPI({
      name: "server-previous",
      type: 1,
    });

    // 服务实例成功率排序
    let serviceSuccessOriginData = await slowNodeErrorRateSortAPI({
      type: 1,
    });

    // -------------处理数据---------------------------------------
    // -----------------global--------------
    packageNodeAndServiceOrigin("慢节点排序", slowNodeAndServiceOriginData);
    packageNodeAndServiceOrigin(
      "节点错误率排序",
      slowNodeErrorRateSortOriginData
    );
    packageNodeAndServiceOrigin("高负载节点排序", highPayloadSortOriginData);
    packageNodeAndServiceOrigin("慢服务排序", slowNodeAndServiceOriginData);
    packageNodeAndServiceOrigin(
      "服务错误率排序",
      slowNodeErrorRateSortOriginData
    );
    packageNodeAndServiceOrigin("高负载服务排序", highPayloadSortOriginData);

    packageNodeAndServiceOrigin(
      "服务实例响应时延分布热图",
      serviceDelayOriginData
    );
    packageNodeAndServiceOrigin(
      "服务实例错误率分布热图",
      serviceInstanceErrorOriginData
    );

    packageNodeAndServiceOrigin(
      "服务实例负载分布热图",
      serviceInstancePayloadOriginData
    );

    // -----------service-------------

    packageServiceOrigin("平均响应时延", serviceDelayOriginData);

    packageServiceOrigin("服务负载", serviceInstancePayloadOriginData);

    packageServiceOrigin("请求成功率", servicerequestSuccessOriginData);

    packageServiceOrigin("慢服务实例排序", slowNodeAndServiceOriginData);

    packageServiceOrigin("服务实例成功率排序", serviceSuccessOriginData);

    packageServiceOrigin("服务实例负载排序", highPayloadSortOriginData);

    // -----------instance---------------
    packageInstanceOrigin("平均响应时延", serviceDelayOriginData);
    packageInstanceOrigin("请求成功率", servicerequestSuccessOriginData);
    packageInstanceOrigin("负载", serviceInstancePayloadOriginData);
    tabLoading.value = false;
    ElMessage.success("加载成功");
  } catch (error) {
    tabLoading.value = false;
    ElMessage.error("抱歉，加载失败 原因：" + error);
    console.log("Global网络错误", error);
  }
};

onMounted(() => {
  getGlobalOfServiceAndNodeData();
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
  }
  .ServiceBox {
    display: flex;
    flex-wrap: wrap;
  }
  .InstanceBox {
    display: flex;
    flex-wrap: wrap;
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

:deep(::-webkit-scrollbar) {
  width: 4px;
  background-color: #ffffff;
}
:deep(::-webkit-scrollbar-thumb) {
  background-color: #c5c6ca;
}
</style>

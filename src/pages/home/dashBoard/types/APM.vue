<template>
  <div class="APMBox">
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

import Global from "./component/global.vue";
import Service from "./component/service.vue";
import Instance from "./component/Instance.vue";

const activeName = ref("Global");

const serviceInstance = ref(null);
const instance = ref(null);
const handleClick = (name) => {
  console.log("name", name);
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
let NodeAndServiceData = ref([
  {
    id: nanoid(),
    title: "慢节点排序",
    showTitle: "慢节点排序(ms)",
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
    showTitle: "节点错误率排序(%)",
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
    showTitle: "高负载节点排序(CPM)",

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
    showTitle: "慢服务排序(ms)",

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
    showTitle: "服务错误率排序(%)",
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
    showTitle: "高负载服务排序(CPM)",

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

// Global -- 服务实例 数据
let serviceInstanceData = ref([
  {
    id: nanoid(),
    title: "服务实例响应时延分布热图",
    showTitle: "服务实例响应时延分布热图",
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
    showTitle: "服务实例错误率分布热图",

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
    showTitle: "服务实例负载分布热图",

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

// Service -- 时延 成功率 负载
let serviceNth3 = ref([
  {
    id: nanoid(),
    title: "平均响应时延",
    showTitle: "平均响应时延(ms)",
    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [20, 60, 12, 65, 15, 35],
    },
  },
  {
    id: nanoid(),
    title: "请求成功率",
    showTitle: "请求成功率(%)",

    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [89, 91, 97, 95, 87, 89],
    },
  },
  {
    id: nanoid(),
    title: "服务负载",
    showTitle: "服务负载(CPM)",

    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [89, 91, 97, 95, 87, 89],
    },
  },
]);

// Service -- 服务实例条形图
let serviceInstanceSort = ref([
  {
    id: nanoid(),
    title: "慢服务实例排序",
    showTitle: "慢服务实例排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        value: 200,
      },
      {
        id: nanoid(),
        name: "02",
        value: 158,
      },
      {
        id: nanoid(),
        name: "03",
        value: 212,
      },
      {
        id: nanoid(),
        name: "04",
        value: 245,
      },
      {
        id: nanoid(),
        name: "05",
        value: 203,
      },
    ],
  },
  {
    id: nanoid(),
    title: "服务实例成功率排序",
    showTitle: "服务实例成功率排序",
    data: [
      {
        id: nanoid(),
        name: "01",
        value: 89,
      },
      {
        id: nanoid(),
        name: "02",
        value: 92,
      },
      {
        id: nanoid(),
        name: "03",
        value: 93,
      },
      {
        id: nanoid(),
        name: "04",
        value: 98,
      },
      {
        id: nanoid(),
        name: "05",
        value: 99,
      },
    ],
  },
  {
    id: nanoid(),
    title: "服务实例负载排序",
    showTitle: "服务实例负载排序",

    data: [
      {
        id: nanoid(),
        name: "01",
        value: 89,
      },
      {
        id: nanoid(),
        name: "02",
        value: 92,
      },
      {
        id: nanoid(),
        name: "03",
        value: 93,
      },
      {
        id: nanoid(),
        name: "04",
        value: 98,
      },
      {
        id: nanoid(),
        name: "05",
        value: 99,
      },
    ],
  },
]);

// Instance -- 折线图
let InstanceOriginData = ref([
  {
    id: nanoid(),
    title: "平均响应时延",
    showTitle: "平均响应时延(ms)",
    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [20, 60, 12, 65, 15, 35],
    },
  },
  {
    id: nanoid(),
    title: "请求成功率",
    showTitle: "请求成功率(%)",

    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [89, 98, 99, 87, 85, 94],
    },
  },
  {
    id: nanoid(),
    title: "负载",
    showTitle: "负载(CPM)",
    data: {
      xAxis: [
        "2023-2-10 15:00",
        "2023-2-10 16:00",
        "2023-2-10 16:20",
        "2023-2-10 16:30",
        "2023-2-10 17:00",
        "2023-2-10 17:10",
      ],
      realityData: [52, 88, 65, 69, 57, 78],
    },
  },
]);
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

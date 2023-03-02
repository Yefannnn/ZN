<template>
  <div class="selectBox">
    <div class="items">
      <span style="margin-right: 20px; font-size: 16px">服务</span>
      <el-select v-model="serviceSelectData.selectedValue" class="m-2" placeholder=" " size="small"
        @change="serviceSelectDataChange">
        <el-option v-for="item in serviceSelectData.selectOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </div>
    <div class="items">
      <span style="margin-right: 20px; font-size: 16px">服务实例</span>
      <el-select v-model="instanceSelectData.selectedValue" class="m-2" placeholder=" " size="small"
        @change="instanceSelectDataChange">
        <el-option v-for="item in instanceSelectData.selectOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </div>

    <div class="items">
      <span>所属节点：{{ nodeName }}</span>
    </div>
  </div>
  <!-- 折线图 -->
  <el-card class="box-card" v-for="item in InstanceOriginData" :key="item.id">
    <template #header>
      <div class="card-header">
        <span>{{ item.showTitle }}</span>
      </div>
    </template>
    <div :class="`echart_${item.id}`" class="tabBox"></div>
  </el-card>
  <!-- 实例排序 -->
  <el-card class="box-card" v-for="item in serviceInstanceSort" :key="item.id">
    <template #header>
      <div class="card-header">
        <span>{{ item.title }}</span>
      </div>
    </template>

    <div class="nodeAndServiceItem" v-for="it in item.data" :key="it.id">
      <p>{{ it.name }}</p>

      <el-tooltip class="box-item" effect="dark" placement="top">
        <template #content>
          {{ it.value }}
        </template>
        <el-progress color="#bf99f8" :percentage="Math.ceil((it.value / item.max) * 100)">
          <el-button text>按钮</el-button>
        </el-progress>
      </el-tooltip>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { getServiceListAPI } from '@/api/index'
import * as Echarts from "echarts";
import { formatterTime } from "@/utils/Funs";
let props = defineProps({
  InstanceOriginData: {
    type: Array,
  },
  getInstanceOriginData: {
    type: Function
  }
});

// 服务选择框
const serviceSelectData = ref({
  selectedValue: "",
  selectOptions: [

  ],
});
// 实例选择框
const instanceSelectData = ref({
  selectedValue: "",
  selectOptions: [
    {
      label: "111",
      value: "111",
    },
    {
      label: "222",
      value: "222",
    },
    {
      label: "333",
      value: "333",
    },
  ],
});

// 所属节点
const nodeName = ref("k8s-master");

// 获取服务
const getServiceData = async () => {
  let data = await getServiceListAPI()
  data && data.length && data.forEach(item => {
    serviceSelectData.value.selectOptions.push({
      label: item,
      value: item
    })
  })
  serviceSelectData.value.selectedValue = data && data.length && data[0]
  serviceSelectDataChange(serviceSelectData.value.selectedValue)
}

// 服务类事件
const serviceSelectDataChange = async (e) => {
  console.log('选择的服务是', e);
  await props.getInstanceOriginData(e)
  nextTick(() => {
    initEcharsInstance()
  })
}
const instanceSelectDataChange = (e) => {
  console.log('服务下的实例是', e);
}


// 将数据进行时延排序
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

let afterOriginData = ref({
  averageDelay: {
    xAxis: [],
    data: [],
  },
  requestSuccess: {
    xAxis: [],
    data: [],
  },
  servicePayload: {
    xAxis: [],
    data: [],
  },
});

let options = {
  平均响应时延: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      top: 10,
      left: "4%",
      bottom: "18%",
    },
    xAxis: {
      type: "time",
      data: afterOriginData.value.averageDelay.xAxis,
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",

        data: afterOriginData.value.averageDelay.data,
        itemStyle: {
          opacity: 0,
          borderWidth: 0,
        },
        lineStyle: {
          color: "#ffcf56",
        },
      },
    ],
  },
  请求成功率: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      top: 10,
      left: "5%",
      bottom: "18%",
    },
    xAxis: {
      type: "time",
      data: afterOriginData.value.requestSuccess.xAxis,
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",

        data: afterOriginData.value.requestSuccess.data,
        itemStyle: {
          opacity: 0,
          borderWidth: 0,
        },
        lineStyle: {
          color: "#ff6a84",
        },
      },
    ],
  },
  负载: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      top: 10,
      left: "4%",
      bottom: "18%",
    },
    xAxis: {
      type: "time",
      data: afterOriginData.value.servicePayload.xAxis,
      axisLabel: {
        formatter(params) {
          let { y, m, d, hh, mm, ss } = formatterTime(params);
          return hh + ":" + mm + "\n" + m + "-" + d;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: afterOriginData.value.servicePayload.data,
        itemStyle: {
          opacity: 0,
          borderWidth: 0,
        },
        lineStyle: {
          color: "#74cfd0",
        },
      },
    ],
  },
};

const packageOriginData = () => {
  // 平均响应时间
  props.InstanceOriginData.forEach((item) => {
    if (item.title === "平均响应时延" && item.data) {
      afterOriginData.value.averageDelay.xAxis = item.data.xAxis;
      item.data.realityData.length &&
        item.data.realityData.forEach((it, index) => {
          afterOriginData.value.averageDelay.data.push([
            item.data.xAxis[index],
            it,
          ]);
        });
    } else if (item.title === "请求成功率" && item.data) {
      afterOriginData.value.requestSuccess.xAxis = item.data.xAxis;
      item.data.realityData.length &&
        item.data.realityData.forEach((it, index) => {
          afterOriginData.value.requestSuccess.data.push([
            item.data.xAxis[index],
            it,
          ]);
        });
    } else if (item.title === "负载" && item.data) {
      afterOriginData.value.servicePayload.xAxis = item.data.xAxis;
      item.data.realityData.length &&
        item.data.realityData.forEach((it, index) => {
          afterOriginData.value.servicePayload.data.push([
            item.data.xAxis[index],
            it,
          ]);
        });
    }
  });
};

const initEcharsInstance = async () => {
  afterOriginData.value = {
    averageDelay: {
      xAxis: [],
      data: [],
    },
    requestSuccess: {
      xAxis: [],
      data: [],
    },
    servicePayload: {
      xAxis: [],
      data: [],
    },
  };
  // 处理原始数据格式
  packageOriginData();

  // option赋值
  options["平均响应时延"].xAxis.data = afterOriginData.value.averageDelay.xAxis;
  options["平均响应时延"].series[0].data =
    afterOriginData.value.averageDelay.data;

  // 无数据处理
  console.log(
    "afterOriginData.value.requestSuccess",
    afterOriginData.value.requestSuccess
  );
  if (afterOriginData.value.requestSuccess.xAxis.length) {
    options["请求成功率"].xAxis.data =
      afterOriginData.value.requestSuccess.xAxis;
    options["请求成功率"].series[0].data =
      afterOriginData.value.requestSuccess.data;
  } else {
    options["请求成功率"].xAxis.data = afterOriginData.value.averageDelay.xAxis;
    options["请求成功率"].yAxis.data = [20, 40, 60, 80, 100];
    options["请求成功率"].xAxis.type = "category";
    options["请求成功率"].yAxis.type = "category";
  }
  options["负载"].xAxis.data = afterOriginData.value.servicePayload.xAxis;
  options["负载"].series[0].data = afterOriginData.value.servicePayload.data;

  props.InstanceOriginData.forEach((item) => {
    let Dom = document.querySelector(`.echart_${item.id}`);
    Echarts.dispose(Dom);
    let myChart = Echarts.init(Dom);
    myChart.setOption(options[item.title]);
  });
};

defineExpose({
  initEcharsInstance,
  getServiceData
});

onMounted(() => {
  // getServiceData()
})


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

.selectBox {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 50px;
  background-color: #fff;
  padding: 0 15px;

  .items {
    margin-right: 30px;
    font-size: 16px;
    color: #333840;
  }
}
</style>

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
      <span>服务实例个数：{{ instanceNumber }}</span>
    </div>
  </div>
  <!-- 折线图 -->
  <el-card class="box-card" v-for="item in serviceNth3" :key="item.id">
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
      <p class="itemsBgc">{{ it.name }}</p>

      <el-tooltip class="box-item" effect="dark" placement="top">
        <template #content>
          {{ it.value }}
        </template>
        <el-progress color="#bf99f8" :percentage="Math.ceil((it.value / item.max) * 100)">
          <img style="margin-left: 20px; cursor: pointer" src="@/assets/images/详情.png" alt="" />
        </el-progress>
      </el-tooltip>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { getServiceListAPI } from '@/api/index'
import * as Echarts from "echarts";
import { formatterTime } from "@/utils/Funs";
let props = defineProps({
  serviceNth3: {
    type: Array,
  },
  serviceInstanceSort: {
    type: Array,
  },
  getServiceOriginData: {
    type: Function
  }
});

// 选择框
const serviceSelectData = ref({
  selectedValue: "",
  selectOptions: [

  ],
});
// 实例个数
const instanceNumber = ref(2);

const getServiceData = async () => {
  // 加载服务
  try {
    let data = await getServiceListAPI()
    instanceNumber.value = data.length
    data.forEach(item => {
      serviceSelectData.value.selectOptions.push({
        label: item,
        value: item
      })
    })
    serviceSelectData.value.selectedValue = data.length ? data[0] : 'api_gateway'
    serviceSelectDataChange(serviceSelectData.value.selectedValue)
  } catch (error) {
    console.log('error', error);
  }
}
const serviceSelectDataChange = async (e) => {
  console.log('选择的服务', e);
  // 根据不同服务请求表单数据
  await props.getServiceOriginData(e)
  nextTick(() => {
    initEcharsInstance();
  })
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
      left: "8%",
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
      left: "8%",
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
      data: [20, 40, 60, 80, 100],
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
  服务负载: {
    tooltip: {
      trigger: "axis",
    },
    confine: true,
    grid: {
      top: 10,
      left: "8%",
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
      data: [20, 40, 60, 80, 100],
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
  props.serviceNth3.forEach((item) => {
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
    } else if (item.title === "服务负载" && item.data) {
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

  // 请求成功率做无数据处理
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
  options["服务负载"].xAxis.data = afterOriginData.value.servicePayload.xAxis;
  options["服务负载"].series[0].data =
    afterOriginData.value.servicePayload.data;

  props.serviceNth3.forEach((item) => {
    let Dom = document.querySelector(`.echart_${item.id}`);
    Echarts.dispose(Dom);
    let myChart = Echarts.init(Dom);
    myChart.setOption(options[item.title]);
  });
};

// 整理服务实例数据
const initServiceSort = () => {
  watch(props.serviceInstanceSort, (newValue) => {
    newValue &&
      newValue.length &&
      newValue.forEach((item) => {
        const sortArr =
          item.data &&
          item.data.length &&
          delaySort(item, "value", "descending");
        sortArr &&
          sortArr.data.length &&
          ((item.max = sortArr.data[0].value),
            (item.min = sortArr.data[sortArr.data.length - 1].value));
      });
  });
};

onMounted(() => {
  initServiceSort()
});

defineExpose({
  initEcharsInstance,
  getServiceData
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

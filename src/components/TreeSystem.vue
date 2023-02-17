<template>
  <div style="width: 100%">
    <el-tree
      :data="dataSource"
      node-key="id"
      default-expand-all
      :expand-on-click-node="true"
      indent="0"
    >
      <template #default="{ node, data }">
        <div class="customNode">
          <div>
            <!-- border:
                  globleColor[
                    lengend.findIndex((item) => item === data.service)
                  ], -->
            <span
              class="circleClass"
              :style="{
                border: `1px solid ${searchIndex(data, lengend)}`,
              }"
            >
            </span>
            <span style="margin-left: 10px">{{ node.label }}</span>
          </div>
          <div
            v-if="data.pid === undefined"
            :class="`echart${data.id}`"
            style="width: 700px; height: 45px; float: right"
          ></div>
          <el-tooltip
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
          </el-tooltip>
        </div>
      </template>
    </el-tree>
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
const delayMax = ref(0);
const delayMin = ref(50);

const computeDelayFun = (delay) => {
  return Math.ceil((delay / delayMax.value) * 100);
};

// 初始化时延坐标轴
const initDelayTimeLine = () => {
  let targetObj = newDataSource.value.find((i) => i.pid === undefined);
  let Dom = document.querySelector(`.echart${targetObj.id}`);
  let timeLineChart = Echarts.init(Dom);
  let option = {
    singleAxis: {
      name: "ms",
      type: "value",
      left: "10%",
      bottom: "50%",
      min: 0,
      max: delayMax.value,
      minInterval: 5,
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        type: "scatter",
        coordinateSystem: "singleAxis",
        data: [0],
        itemStyle: {
          opacity: 0,
        },
      },
    ],
  };

  timeLineChart.setOption(option);
};

const createDelayEchart = () => {
  newDataSource.value = props.dataSource.reduce(function func(
    pre,
    curr,
    index,
    arr
  ) {
    pre.push({
      id: curr.id,
      label: curr.label,
      service: curr.service,
      pid: curr.pid,
      delay: curr.delay,
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

  //   确定delay波动范围
  let sortArr = [];
  newDataSource.value.forEach((i) => {
    if (i.delay && typeof i.delay === "number") {
      sortArr.push(i.delay);
    }
  });
  sortArr.sort();
  delayMax.value = sortArr[sortArr.length - 1];
  delayMin.value = sortArr[0];

  nextTick(() => {
    initDelayTimeLine();
  });
};

const searchIndex = (a, b) => {
  let index = b.findIndex((item) => item === a.service);
  if (index > -1) {
    return props.globleColor[index];
  }
};

onMounted(() => {
  createDelayEchart();
});
</script>
<style lang="less" scoped>
:deep(.el-tree-node__content) {
  height: 50px;
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
  top: 25px;
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
</style>

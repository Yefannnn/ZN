<template>
  <div class="selectArea">
    <div class="selectItem selectItemCenter">
      <span style="marginbottom: 5px">开始时间</span>
      <div class="demo-datetime-picker">
        <div class="block">
          <el-date-picker format=" " v-model="startTime" type="datetime" :clearable="false" />
        </div>
      </div>
    </div>
    <div class="selectItem selectItemCenter">
      <span style="marginbottom: 5px">结束时间</span>
      <div class="demo-datetime-picker">
        <div class="block">
          <el-date-picker format=" " v-model="endTime" type="datetime" :clearable="false" />
        </div>
      </div>
    </div>
    <div class="selectItem selectItemCenter service" v-for="item in filterArea" :key="item">
      <span style="marginbottom: 5px">{{ item.title }}</span>
      <el-select v-model="item.selected" class="m-2" placeholder="Select" size="small" popper-class="selectBox">
        <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <span style="color: #c6c7ca; margin-left: 15px">时间范围：{{ formatTime(startTime) }} - {{ formatTime(endTime) }}</span>
    <div class="buttonGroup">
      <button class="clearBth" @click="resetAllBtn">清空</button>
      <button class="filterBth" style="margin-left: 10px" @click="filterBtn">
        筛选
      </button>
    </div>
  </div>
  <div class="containter" v-loading="traceLoading">
    <div class="LeftOfListBox">
      <div class="topPapg">
        <el-pagination v-model:current-page="pageSource.currentPage" :small="small" :disabled="disabled"
          :page-size="pageSource.pageSize" :total="pageSource.total" background="transparent"
          layout="prev,jumper, next,total" @current-change="handleCurrentChange" />
      </div>
      <div class="bottonContaninter">
        <ul>
          <li class="contaninterItem" v-for="item in serviceListDataSlice" :key="item"
            :style="{ backgroundColor: item.active ? '#ededed' : '' }" @click="changeActiveLis(item.id)">
            <div class="items">
              <p :style="{
                color: item._error ? 'red' : '#448dfe',
                fontWeight: item._error ? 700 : 400,
              }">
                {{ item.name }}
              </p>
              <p>
                <span class="delayItem">{{ item.delay }}</span><span style="margin-left: 20px; color: #b7aebb">{{
                  item.date
                }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="RightOfTreeBox">
      <div class="TitleBox">
        <h2>{{ headerData.title }}</h2>
        <div style="display: flex; margin-top: 5px">
          <div class="startPort">
            <span class="BoxBorder">起始点</span>
            <span>{{ headerData.orginPot }}</span>
          </div>
          <div class="startPort">
            <span class="BoxBorder">持续时间</span>
            <span>{{ headerData.duration }}</span>
          </div>
          <div class="startPort">
            <span class="BoxBorder">跨度</span>
            <span>{{ headerData.spanCount }}</span>
          </div>
        </div>
        <!-- 按钮组 -->
        <div class="buttonGroup">
          <button :style="{
            backgroundColor: selectedTab === '列表' ? '#448dfe' : '#7f7f7f',
          }" @click="changeTab('列表')">
            列表
          </button>
          <button :style="{
            backgroundColor: selectedTab === '图' ? '#448dfe' : '#7f7f7f',
          }" @click="changeTab('图')">
            图
          </button>
        </div>
      </div>
      <div class="TreeContainterBox">
        <div class="treeItem" v-if="selectedTab === '列表'">
          <div style="display: flex; margin-bottom: 20px">
            <div class="serviceType" v-for="(item, index) in lengend" :key="item" :style="{
              border: `1px solid ${globleColor[index]}`,
            }">
              <span class="serviceIcon" :style="{
                border: `2px solid ${globleColor[index]}`,
                color: globleColor[index],
              }"></span>
              <span :style="{
                color: globleColor[index],
              }">{{ item }}</span>
            </div>
          </div>
          <TreeSystem ref="TreeSystemDom" :dataSource="dataSource" :globleColor="globleColor" :lengend="lengend">
          </TreeSystem>
        </div>
        <div class="treeItem" v-else>
          <!-- <GraphChart /> -->
          <GraphTree ref="GraphTreeInstance" :graghOrigin="graghOrigin"></GraphTree>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { nanoid } from "nanoid";
import TreeSystem from "@/components/TreeSystem.vue";
import GraphChart from "./component/GraghChart.vue";
import GraphTree from "./component/GraphTree.vue";
import { getLinkListAPI, getServiceListAPI } from "@/api/index";
import { ElMessage } from "element-plus";
import useTraceStore from '@/store/trace'
import { storeToRefs } from 'pinia'

const traceStore = useTraceStore()
const { openTraceData, openTraceAllData } = storeToRefs(traceStore)

const traceLoading = ref(false);

const formatTime = (time) => {
  if (!time) {
    return;
  }
  let date = new Date(time);
  let y = date.getFullYear();
  let m =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh = date.getHours();
  let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
};

const startTime = ref("");

const endTime = ref("");

const filterArea = ref([
  {
    title: "服务",
    selected: "",
    options: [],
  },
  {
    title: "实例",
    selected: "",
    options: [],
  },
  {
    title: "状态",
    selected: "",
    options: [
      {
        label: "正常",
        value: false,
      },
      {
        label: "异常",
        value: true,
      },
    ],
  },
  {
    title: "断点名称",
    selected: "",
    options: [
      {
        label: "111",
        value: "111",
      },
      {
        label: "222",
        value: "222",
      },
    ],
  },
]);

const getServiceData = async () => {
  let data = await getServiceListAPI()
  data.forEach(item => {
    filterArea.value[0].options.push({
      label: item,
      value: item
    })
  })
}

// 清空
const resetAllBtn = () => {
  filterArea.value.forEach((item) => {
    item.selected = "";
  });
  startTime.value = "";
  endTime.value = "";
  getLinkList()
};

// 筛选
const filterBtn = () => {
  // 重新获取数据
  getLinkList();
};

// 调用链数据
const callChainData = ref([]);
// 当前选中id
const currentSelectedId = ref(null);
// 当前树下Data
const currentIdTreeData = ref({});
watch(
  currentSelectedId,
  (newId) => {
    let targetObj = callChainData.value.find((item) => {
      return item.id === newId;
    });
    targetObj && targetObj.id ? (currentIdTreeData.value = targetObj) : {};
  },
  {
    immediate: true,
  }
);

// title数据
const headerData = ref({
  title: "xxx",
  orginPot: "xxxxx",
  spanCount: "xxxxx",
  duration: "xxxxx",
});

// 整理树形结构
const packageTreeData = (treeObj) => {
  treeObj.id = treeObj.parent.spanContext.spanid;
  treeObj.label = treeObj.name;
  treeObj.service = treeObj.parent.spanContext.servicename;
  treeObj.delay = treeObj.parent.duration_nano;
  treeObj.starttimestamp = treeObj.parent.starttimestamp;
  treeObj.duration = treeObj.responseDuration;
  treeObj.is_error = treeObj.parent.tags.is_error;
  treeObj.isLog = treeObj.parent.tags.isLog;
  if (treeObj.children && treeObj.children.length) {
    treeObj.children.forEach((item) => {
      packageTreeData(item);
    });
  }
};

// 选择tab
const selectedTab = ref("列表");

let TreeSystemDom = ref(null);
let GraphTreeInstance = ref(null);

// 图例
const lengend = ref([]);
const globleColor = ["#cd4448", "#6e40aa", "#97ceff"];

watch(currentIdTreeData, (newValue) => {
  // title数据
  headerData.value = {
    title: newValue.name,
    orginPot: formatTime(newValue.parent.starttimestamp),
    spanCount: newValue.spanCount,
    duration: newValue.parent.duration_nano + "ms",
  };
  // 整理树形结构
  packageTreeData(newValue);

  dataSource.value[0] = {
    id: nanoid(),
    label: "调用树",
    children: [newValue],
  };
  nextTick(() => {
    if (selectedTab.value !== "列表") return;
    TreeSystemDom.value.createDelayEchart();
  });

  dataSource.value
    .reduce(function func(pre, curr, index, arr) {
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
    }, [])
    .forEach((item) => {
      if (!lengend.value.includes(item.service) && item.service !== undefined) {
        lengend.value.push(item.service);
      }
    });
});

// 列表全数据
const serviceListData = ref([]);
//  列表分页数据
const serviceListDataSlice = ref([]);
// 分页信息
const pageSource = ref({
  currentPage: 1,
  pageSize: 14,
  total: 0,
});
const handleCurrentChange = (e) => {
  pageSource.value.currentPage = e;
  serviceListDataSlice.value = serviceListData.value.slice(
    (e - 1) * pageSource.value.pageSize,
    e * pageSource.value.pageSize
  );

};

// 清空数据
const clearData = () => {
  serviceListData.value = []
  dataSource.value = []
  headerData.value = {
    title: "xxx",
    orginPot: "xxxxx",
    spanCount: "xxxxx",
    duration: "xxxxx",
  }
  lengend.value = []
  currentSelectedId.value = ''
}

// 进一步筛选
const estimateNeedFilter = (originData) => {
  console.log('originData111', originData);
  filterArea.value.forEach(item => {
    switch (item.title) {
      case '实例':
        if (item.selected) {
          // 筛选
        }
        break;
      case '状态':
        if (item.selected !== '') {
          // 筛选
          originData = originData.filter(it => it.error === item.selected)
        }
        break;
      case '断点名称':
        if (item.selected) {
          // 筛选
        }
        break;

      default:
        break;
    }
  })
  return originData

}

// 处理列表数据
const packageListData = (ListData) => {
  ListData.forEach((item, index) => {
    serviceListData.value.push({
      id: item.id,
      name: item.name,
      delay: item.duration + "ms",
      _error: item.error,
      date: formatTime(item.parent.tags._time),
      active: index === 0 ? true : false,
    });
    index === 0 ? (currentSelectedId.value = item.id) : null;
  });
  // 分页
  serviceListDataSlice.value = serviceListData.value.slice(
    0,
    pageSource.value.pageSize
  );
  pageSource.value.total = serviceListData.value.length;
};

const getLinkList = async () => {
  try {
    traceLoading.value = true;
    clearData()  // 清空数据
    // 携带参数
    console.log("start_time", startTime.value, "end_time", endTime.value);

    let start_time = startTime.value
      ? startTime.value.toISOString().replace(/Z/, "+08:00")
      : "";
    let end_time = endTime.value
      ? endTime.value.toISOString().replace(/Z/, "+08:00")
      : "";
    let params = {
      service_name: filterArea.value[0].selected,
      start_time,
      end_time,
      isUpdate: 'false'
    };
    let data = await getLinkListAPI(params);
    traceLoading.value = false;
    ElMessage.success("加载成功");
    data.map((item) => (item.id = item.parent.tags.span_id));

    // 判断是否需要进一步筛选
    let filterData = estimateNeedFilter(data)
    console.log('filterData', filterData);
    callChainData.value = filterData;
    // 处理数据
    packageListData(callChainData.value);
  } catch (error) {
    ElMessage.error("加载失败，原因是： " + error);
    traceLoading.value = false;
  }
};


const changeActiveLis = (id) => {
  currentSelectedId.value = id;
  serviceListData.value.forEach((item) => {
    item.id === id ? (item.active = true) : (item.active = false);
  });
};

// 树形数据
const dataSource = ref([]);

const changeTab = (tab) => {
  selectedTab.value = tab;
  if (tab === "列表") {
    nextTick(() => {
      TreeSystemDom.value.createDelayEchart();
    });
  }
};

// 图数据
let graghOrigin = {
  id: "Modeling Methods",
  serviceName: "1",
  children: [
    {
      id: "Classification",
      serviceName: "2",
      children: [
        {
          id: "Logistic regression",
          serviceName: "2",
        },
        {
          id: "Linear discriminant analysis",
          serviceName: "2",
        },
        {
          id: "Rules",
          serviceName: "2",
        },
        {
          id: "Decision trees",
          serviceName: "2",
        },
        {
          id: "Naive Bayes",
          serviceName: "2",
        },
        {
          id: "K nearest neighbor",
          serviceName: "3",
        },
      ],
    },
    {
      id: "Consensus",
      serviceName: "5",
      children: [
        {
          id: "Models diversity",
          serviceName: "3",

          children: [
            {
              id: "Different initializations",
              serviceName: "4",
            },
            {
              id: "Different parameter choices",
              serviceName: "4",
            },
            {
              id: "Different architectures",
              serviceName: "4",
            },
            {
              id: "Different modeling methods",
              serviceName: "4",
            },
          ],
        },
      ],
    },
    {
      id: "Regression",
      serviceName: "3",

      children: [
        {
          id: "Multiple linear regression",
          serviceName: "5",
        },
        {
          id: "Partial least squares",
          serviceName: "5",
        },
        {
          id: "Multi-layer feedforward neural network",
          serviceName: "5",
        },
      ],
    },
  ],
};


// 监听ws新数据
watch(openTraceData, (newValue) => {
  console.log('条件数据', newValue);
  clearData()
  newValue.map((item) => (item.id = item.parent.tags.span_id));
  let filterData = estimateNeedFilter(newValue)
  callChainData.value = filterData;
  packageListData(callChainData.value);
})

watch(openTraceAllData, (newValue) => {
  console.log('全部数据', newValue);
  clearData()
  newValue.map((item) => (item.id = item.parent.tags.span_id));
  callChainData.value = newValue;
  packageListData(callChainData.value);
})



onMounted(() => {
  // initWebSocket()
  // 获取服务列表
  getServiceData()
  getLinkList();
});
</script>
<style lang="less" scoped>
:deep(.el-pagination__jump .el-input) {
  width: 40px;
  height: 25px;
  border: none;
}

:deep(.el-pagination__goto) {
  display: none;
}

:deep(.selectItem .el-input) {
  width: 70px;
  height: 20px;
}

:deep(.el-input) {
  --el-input-focus-border: #333840;
  --el-input-transparent-border: 0 0 0 0px;
  --el-input-border-color: #333840;
  --el-input-hover-border: 0px !important;
  --el-input-hover-border-color: #333840;
  --el-input-focus-border-color: #333840;
  --el-input-clear-hover-color: #333840;
  box-shadow: 0 0 0 0px !important;
  --el-input-border: 0px;
}

// .el-select-dropdown {}

.selectArea {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 63px;
  width: 100%;
  background-color: #333840;

  .selectItem {
    width: 165px;
    height: 52px;
    color: #c6c7ca;
    border-right: 1px solid #000;
  }

  .selectItemCenter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :deep(.service .el-input) {
    width: 90%;
    margin-left: 5%;
    height: 20px;
    color: #fff;
  }

  :deep(.el-select .el-input__inner) {
    color: #c6c7ca;
  }

  :deep(.service .el-select) {
    border-color: "#333840" !important;
  }

  :deep(.el-select .el-input__wrapper) {
    background-color: #333840;
    border: none;
  }

  .buttonGroup {
    width: 10%;
    position: absolute;
    right: 0;

    .clearBth {
      padding: 3px 10px;
      background-color: #484b55;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }

    .clearBth:active {
      transform: translateY(-10%);
    }

    .filterBth {
      padding: 3px 10px;
      background-color: #484b55;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }

    .filterBth:active {
      transform: translateY(-10%);
    }
  }
}

.containter {
  display: flex;
  height: calc(100% - 63px - 48px);
  width: 100%;

  .LeftOfListBox {
    flex: 1;
    background-color: #fff;

    .topPapg {
      height: 35px;
      width: 100%;
      background-color: #f3f4f9;
    }

    .bottonContaninter {
      height: 785px;
      overflow: auto;

      .contaninterItem {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        padding: 8px 20px;
        cursor: pointer;

        .items {
          .delayItem {
            display: inline-block;
            padding: 0px 5px;
            height: 18px;
            line-height: 18px;
            border-radius: 4px;
            color: #fff;
            background-color: #333840;
          }
        }

        .items p:nth-of-type(1) {
          color: #6a8dfb;
          font-size: 14px;
        }
      }

      .contaninterItem:hover {
        background-color: #ededed;
      }
    }
  }

  .RightOfTreeBox {
    flex: 3;
    background-color: #ffffff;

    .TitleBox {
      position: relative;
      height: 95px;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e5e5e5;
      padding: 10px;
      margin-top: 10px;

      .startPort {
        padding: 6px 10px 6px 0px;
      }

      .BoxBorder {
        display: inline-block;
        padding: 4px 8px;
        color: #fff;
        background-color: #40454e;
        margin-right: 10px;
        border-radius: 4px;
      }

      .buttonGroup {
        position: absolute;
        right: 10px;
        bottom: 20px;

        button {
          margin: 0 5px;
          padding: 3px 8px;
          background-color: #7f7f7f;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #448dfe;
        }
      }
    }

    .TreeContainterBox {
      padding: 10px;

      .treeItem {
        .serviceType {
          padding: 3px 8px;
          border: 1px solid #cdcdcd;
          border-radius: 4px;
          margin: 0 5px;

          .serviceIcon {
            display: inline-block;
            width: 11px;
            height: 11px;
            border: 1px solid #000;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.selectBox {
  background-color: #252a2f;
  color: #eeeeee;

  .el-select-dropdown__item {
    color: #eeeeee;
    background-color: #252a2f;
  }

  .el-select-dropdown__item:hover {
    background-color: #40454e;
    color: #47b0ff;
  }

  .el-select-dropdown__item.selected {
    color: #409eff;
    font-weight: 700;
  }
}
</style>

<!-- 
    接口文档
    1 扁平列表
    {
        id: nanoid(),
        name: "Mysql/JDBI/Connection/close",  name 
        delay: "10ms",   duration 纳秒
        date: "2023-2-13 11:31:52",   tags._time
    }

    2 title数据
    {
      起始点：,  starttimestamp
      持续时间：，   duration_nano
      跨度：      spanCount
      title:''  name
    }

    3 树形
    {
      id: nanoid(),
    label: "根服务器",
    service: "service0",
    children: [
      {
        id: nanoid(),
        label: "1",   name 
        service: "service1",   servicename
        delay: 20,      duration_nano
        children: [...]  
    }


 -->

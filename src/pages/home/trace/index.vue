<template>
  <div class="selectArea">
    <div class="selectItem selectItemCenter">
      <span style="marginbottom: 5px">开始时间</span>
      <div class="demo-datetime-picker">
        <div class="block">
          <el-date-picker
            format=" "
            v-model="startTime"
            type="datetime"
            :clearable="false"
          />
        </div>
      </div>
    </div>
    <div class="selectItem selectItemCenter">
      <span style="marginbottom: 5px">结束时间</span>
      <div class="demo-datetime-picker">
        <div class="block">
          <el-date-picker
            format=" "
            v-model="endTime"
            type="datetime"
            :clearable="false"
          />
        </div>
      </div>
    </div>
    <div
      class="selectItem selectItemCenter service"
      v-for="item in filterArea"
      :key="item"
    >
      <span style="marginbottom: 5px">{{ item.title }}</span>
      <el-select
        v-model="item.selected"
        class="m-2"
        placeholder="Select"
        size="small"
        popper-class="selectBox"
      >
        <el-option
          v-for="item in item.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <span style="color: #c6c7ca; margin-left: 15px"
      >时间范围：{{ formatTime(startTime) }} - {{ formatTime(endTime) }}</span
    >
    <div class="buttonGroup">
      <button class="clearBth" @click="resetAllBtn">清空</button>
    </div>
  </div>
  <div class="containter">
    <div class="LeftOfListBox">
      <div class="topPapg">
        <el-pagination
          v-model:current-page="pageSource.currentPage"
          :small="small"
          :disabled="disabled"
          :page-size="pageSource.pageSize"
          :total="pageSource.total"
          background="transparent"
          layout="prev,jumper, next"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="bottonContaninter">
        <ul>
          <li
            class="contaninterItem"
            v-for="item in serviceListDataSlice"
            :key="item"
            :style="{ backgroundColor: item.active ? '#ededed' : '' }"
            @click="changeActiveLis(item.id)"
          >
            <div class="items">
              <p>{{ item.name }}</p>
              <p>
                <span class="delayItem">{{ item.delay }}</span
                ><span style="margin-left: 20px; color: #b7aebb">{{
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
          <button
            :style="{
              backgroundColor: selectedTab === '列表' ? '#448dfe' : '#7f7f7f',
            }"
            @click="changeTab('列表')"
          >
            列表
          </button>
          <button
            :style="{
              backgroundColor: selectedTab === '图' ? '#448dfe' : '#7f7f7f',
            }"
            @click="changeTab('图')"
          >
            图
          </button>
        </div>
      </div>
      <div class="TreeContainterBox">
        <div class="treeItem" v-if="selectedTab === '列表'">
          <div style="display: flex; margin-bottom: 20px">
            <div
              class="serviceType"
              v-for="(item, index) in lengend"
              :key="item"
              :style="{
                border: `1px solid ${globleColor[index]}`,
              }"
            >
              <span
                class="serviceIcon"
                :style="{
                  border: `2px solid ${globleColor[index]}`,
                  color: globleColor[index],
                }"
              ></span>
              <span
                :style="{
                  color: globleColor[index],
                }"
                >{{ item }}</span
              >
            </div>
          </div>
          <TreeSystem
            ref="TreeSystemDom"
            :dataSource="dataSource"
            :globleColor="globleColor"
            :lengend="lengend"
          ></TreeSystem>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { nanoid } from "nanoid";
import TreeSystem from "@/components/TreeSystem.vue";
import { getLinkListAPI } from "@/api/index";

const startTime = ref();

const endTime = ref();

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
  console.log(y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss);
  return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
};

const filterArea = ref([
  {
    title: "服务",
    selected: "All",
    options: [
      {
        label: "All",
        value: "All",
      },
      {
        label: "111",
        value: "111",
      },
    ],
  },
  {
    title: "实例",
    selected: "All",
    options: [
      {
        label: "All",
        value: "All",
      },
      {
        label: "111",
        value: "111",
      },
    ],
  },
  {
    title: "状态",
    selected: "All",
    options: [
      {
        label: "All",
        value: "All",
      },
      {
        label: "111",
        value: "111",
      },
    ],
  },
  {
    title: "断点名称",
    selected: "All",
    options: [
      {
        label: "All",
        value: "All",
      },
      {
        label: "111",
        value: "111",
      },
    ],
  },
]);

// 清空
const resetAllBtn = () => {
  console.log("清空所有筛选项");
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
      console.log("item", item.id, "newId", newId);
      return item.id === newId;
    });
    console.log("targetObj1111111", targetObj);
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
  if (treeObj.children && treeObj.children.length) {
    treeObj.children.forEach((item) => {
      packageTreeData(item);
    });
  }
};

let TreeSystemDom = ref(null);

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
  pageSize: 13,
  total: serviceListData.value.length,
});
const handleCurrentChange = (e) => {
  pageSource.value.currentPage = e;
  serviceListDataSlice.value = serviceListData.value.slice(
    e * pageSource.size + 1,
    (e + 1) * pageSource.size
  );
};

// 处理列表数据
const packageListData = (ListData) => {
  ListData.forEach((item, index) => {
    serviceListData.value.push({
      id: item.id,
      name: item.name,
      delay: item.duration + "ms",
      date: formatTime(item.parent.tags._time),
      active: index === 0 ? true : false,
    });
    index === 0 ? (currentSelectedId.value = item.id) : null;

    // 分页
    serviceListDataSlice.value = serviceListData.value.slice(
      0,
      pageSource.pageSize
    );
  });
};

const getLinkList = async () => {
  let data = await getLinkListAPI();
  data.map((item) => (item.id = item.parent.tags.span_id));
  callChainData.value = data;
  // 处理数据
  packageListData(callChainData.value);
};

const changeActiveLis = (id) => {
  currentSelectedId.value = id;
  serviceListData.value.forEach((item) => {
    item.id === id ? (item.active = true) : (item.active = false);
  });
};

// 树形数据
//#region
// const dataSource = ref([
//   {
//     id: nanoid(),
//     label: "根服务器",
//     service: "service0",
//     children: [
//       {
//         id: nanoid(),
//         label: "1",
//         service: "service1",
//         delay: 20,
//         children: [
//           {
//             id: nanoid(),
//             label: "2-1",
//             service: "service1",
//             delay: 20,
//           },
//           {
//             id: nanoid(),
//             label: "1-2",
//             service: "service1",
//             delay: 20,
//             children: [
//               {
//                 id: nanoid(),
//                 label: "1-1-1",
//                 service: "service1",
//                 delay: 40,
//               },
//               {
//                 id: nanoid(),
//                 label: "1-1-2",
//                 service: "service1",
//                 delay: 35,
//               },
//               {
//                 id: nanoid(),
//                 label: "1-1-3",
//                 service: "service1",
//                 delay: 43,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: nanoid(),
//         label: "2",
//         service: "service2",
//         delay: 20,
//         children: [
//           {
//             id: nanoid(),
//             label: "2-1",
//             service: "service2",
//             delay: 22,
//           },
//           {
//             id: nanoid(),
//             label: "2-2",
//             service: "service2",
//             delay: 30,
//             children: [
//               {
//                 id: nanoid(),
//                 label: "2-1-1",
//                 service: "service2",
//                 delay: 38,
//               },
//               {
//                 id: nanoid(),
//                 label: "2-1-2",
//                 service: "service2",
//                 delay: 35,
//               },
//               {
//                 id: nanoid(),
//                 label: "2-1-3",
//                 service: "service2",
//                 delay: 45,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

//#endregion

const dataSource = ref([]);

// 选择tab
const selectedTab = ref("列表");

const changeTab = (tab) => {
  selectedTab.value = tab;
  if (tab === "列表") {
    nextTick(() => {
      TreeSystemDom.value.createDelayEchart();
    });
  }
};

onMounted(() => {
  getLinkList();
});
</script>
<style lang="less" scoped>
:deep(.el-pagination__jump .el-input) {
  width: 35px;
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
      margin-top: 2px;
      padding: 3px 10px;
      background-color: #484b55;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
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

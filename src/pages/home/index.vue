<template>
  <div class="homeBox">
    <div class="navTab">
      <div class="bgcImg">
        <img src="" alt="" />
      </div>
      <div class="titleBox" v-for="(item, index) in tabData" :key="index">
        <div
          class="titleItem"
          :style="{ backgroundColor: item.active ? '#333844' : '' }"
          @click="changeActive(item.title, item.name)"
        >
          <img :src="item.imgUrl" alt="" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const tabData = ref([
  {
    title: "仪表盘",
    name: "dashBoard",
    imgUrl: "",
    active: true,
  },
  {
    title: "拓补图",
    name: "gplot",
    imgUrl: "",
    active: false,
  },
  {
    title: "追踪",
    name: "trace",
    imgUrl: "",
    active: false,
  },
  {
    title: "日志",
    name: "log",
    imgUrl: "",
    active: false,
  },
]);

const changeActive = (title, name) => {
  tabData.value.forEach((item) => {
    item.active = false;
  });
  let targetObj = tabData.value.find((item) => item.title === title);
  targetObj ? (targetObj.active = true) : "";

  router.push({
    name,
  });
};

onMounted(() => {});
</script>
<style lang="less" scoped>
.homeBox {
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 255, 255);

  .navTab {
    display: flex;
    color: #c6c7ca;
    height: 48px;
    width: 100%;
    background-color: #252a2f;

    .bgcImg {
      width: 120px;
      height: 100%;
      background-color: skyblue;
    }

    .titleBox {
      display: flex;
      align-items: center;
      padding: 0 20px;

      .titleItem {
        padding: 7px 10px;
        border-radius: 4px;
        cursor: pointer;
      }

      .titleItem:hover {
        background-color: #333844;
      }
    }
  }
}
</style>

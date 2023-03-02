<template>
  <div class="dashBoardType">
    <div class="typeItems" v-for="item in types" :key="item" @click="changeTypes(item.title)">
      <div :class="{ prex: item.active }"></div>
      <span>{{ item.showTitle }}</span>
    </div>

  </div>
  <router-view></router-view>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const types = ref([
  {
    title: "APM",
    showTitle: '服务',
    active: true,
  },
  {
    title: "Database",
    showTitle: '数据库',
    active: false,
  },
  {
    title: "Istio",
    showTitle: '容器',
    active: false,
  },

  // {
  //   title: "K8s",
  //   active: false,
  // },
]);

// changeTypes
const changeTypes = (type) => {
  types.value.forEach((item) => {
    item.title === type ? (item.active = true) : (item.active = false);
  });
  router.push({
    name: type,
  });
};



onMounted(() => {
  changeTypes("APM");
});
</script>
<style lang="less" scoped>
.dashBoardType {
  position: relative;
  display: flex;
  align-items: center;
  color: #a7a5b0;
  height: 50px;
  width: 100%;
  background-color: #333840;
  padding-left: 10px;

  .typeItems {
    position: relative;
    height: 25px;
    padding: 3px 10px;
    background-color: #41464d;
    border-radius: 4px;
    margin: 0 8px;
    cursor: pointer;

    .prex {
      position: absolute;
      left: 2px;
      top: 25%;
      width: 4px;
      height: 50%;
      background-color: #448dfe;
      border-radius: 4px;
    }
  }
}
</style>

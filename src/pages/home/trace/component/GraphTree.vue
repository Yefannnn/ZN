<template>
    <div class="enter">
        <div id="container">
        </div>
        <div class="rightLegend">
            <div class="legendItem" v-for="(item, i) in legendData" :key="i">
                <div class="serviceLabel">服务器名称：{{ item.label }}</div>
                <div class="serviceImg">
                    <img :src="`src/assets/images/${item.type}.png`" alt="">
                </div>
            </div>
        </div>
</div>
</template>
<script setup>
import G6 from "@antv/g6";
import { find } from "lodash";
import { onMounted, ref, nextTick, watch } from "vue";


let props = defineProps({
    graghOrigin: {
        type: Object
    }
})

const treeData = ref({});
const legendData = ref([])

const getTreeOriginData = () => {


    // map type => service
    let Services = [];
    let nodeType = ["star", "triangle", "diamond", "rect", "circle"];
    let findServiceArr = (data) => {
        Services.includes(data.serviceName) ? "" : Services.push(data.serviceName);
        if (!data.children) return;
        data.children.length &&
            data.children.forEach((item) => {
                findServiceArr(item);
            });
    };
    findServiceArr(props.graghOrigin);
    console.log('Services', Services);

    //   增加type
    let addStyleToData = (data) => {
        let index = Services.findIndex(it => it === data.serviceName);
        index > -1
            ? (data.type = nodeType[index], data.size = 15)
            : console.log("addStyle时未找到服务对应的索引");
        if (!data.children) return
        data.children.forEach((item) => {
            addStyleToData(item);
        });
    };

    addStyleToData(props.graghOrigin)

    // 将处理完的数据交给全局treeData
    treeData.value = props.graghOrigin
    console.log('treeData.value', treeData.value);

    //  legend数据
    let legendDataOrigin = []
    Services.forEach((item, index) => {
        legendDataOrigin.push({
            label: item,
            type: nodeType[index]
        })
    })
    legendData.value = legendDataOrigin
};

const initTreeChart = () => {
    const container = document.getElementById("container");
    const width = container.scrollWidth;
    const height = container.scrollHeight || 600;
    const graph = new G6.TreeGraph({
        container: "container",
        width,
        height,
        modes: {
            default: [
                {
                    type: "collapse-expand",
                    onChange: function onChange(item, collapsed) {
                        const data = item.getModel();
                        data.collapsed = collapsed;
                        return true;
                    },
                },
                "drag-canvas",
                "zoom-canvas",
            ],
        },
        defaultNode: {
            size: 26,
            anchorPoints: [
                [0, 0.5],
                [1, 0.5],
            ],
        },
        defaultEdge: {
            type: "cubic-horizontal",
        },
        layout: {
            type: "compactBox",
            direction: "LR",
            getId: function getId(d) {
                return d.id;
            },
            getHeight: function getHeight() {
                return 16;
            },
            getWidth: function getWidth() {
                return 16;
            },
            getVGap: function getVGap() {
                return 10;
            },
            getHGap: function getHGap() {
                return 100;
            },
        },
    });

    graph.node(function (node) {
        return {
            label: node.id,
            labelCfg: {
                offset: 10,
                position: node.children && node.children.length > 0 ? "left" : "right",
            },
        };
    });
    graph.data(treeData.value);
    graph.render();
    graph.fitView();

    if (typeof window !== "undefined")
        window.onresize = () => {
            if (!graph || graph.get("destroyed")) return;
            if (!container || !container.scrollWidth || !container.scrollHeight)
                return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
};

onMounted(() => {
    getTreeOriginData();
    initTreeChart();
});

defineExpose({
    initTreeChart,
});
</script>
<style lang="less" scoped>
.enter {
    display: flex;
}

#container {
    width: 1300px;
    height: 600px;
}

.rightLegend {
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .legendItem {
        padding: 20px 0;

        .serviceLabel {
            display: flex;
            justify-content: center;
        }

        .serviceImg {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 0;
        }
    }
}
</style>

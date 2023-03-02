<template >
    <div id="container">

    </div>
</template>
<script setup>
import G6 from '@antv/g6';
import { ref, onMounted, nextTick, watch } from 'vue'


let data = {}
// cache the initial combo children infomation
let comboChildrenCache = {};
// cache the initial parent infomation
let itemComboMap = {};
// cache the initial node and combo info
let itemMap = {};
// cache the combo related edges
let comboEdges = {};

let contextMenu = null

// 原始数据
const getOriginData = () => {
    data = {
        nodes: [
            {
                id: '0',
                comboId: 'a',
            },
            {
                id: '1',
                comboId: 'a',
            },
            {
                id: '2',
                comboId: 'a',
            },
            {
                id: '3',
                comboId: 'a',
            },
            {
                id: '4',
                comboId: 'a',
            },
            {
                id: '5',
                comboId: 'a',
            },
            {
                id: '6',
                comboId: 'a',
            },
            {
                id: '7',
                comboId: 'a',
            },
            {
                id: '8',
                comboId: 'a',
            },
            {
                id: '9',
                comboId: 'a',
            },
            {
                id: '10',
                comboId: 'a',
            },
            {
                id: '11',
                comboId: 'a',
            },
            {
                id: '12',
                comboId: 'a',
            },
            {
                id: '13',
                comboId: 'a',
            },
            {
                id: '14',
                comboId: 'a',
            },
            {
                id: '15',
                comboId: 'a',
            },
            {
                id: '16',
                comboId: 'b',
            },
            {
                id: '17',
                comboId: 'b',
            },
            {
                id: '18',
                comboId: 'b',
            },
            {
                id: '19',
                comboId: 'b',
            },
            {
                id: '23',
                comboId: 'c',
            },
            {
                id: '24',
                comboId: 'a',
            },

            {
                id: '27',
                comboId: 'c',
            },
            {
                id: '28',
                comboId: 'c',
            },
            {
                id: '29',
                comboId: 'c',
            },
            {
                id: '30',
                comboId: 'c',
            },
            {
                id: '31',
                comboId: 'c',
            },
        ],
        edges: [

            {
                source: 'a',
                target: '33',
                label: 'Combo-Node',
                size: 3,
                labelCfg: {
                    autoRotate: true,
                    style: {
                        stroke: '#fff',
                        lineWidth: 5,
                        fontSize: 20,
                    },
                },
                style: {
                    stroke: 'blue',
                },
            },
            {
                source: '0',
                target: '1',
            },
            {
                source: '19',
                target: '23',
                style: {
                    endArrow: {
                        path: G6.Arrow.triangle(10, 20, 25), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                        d: 25,
                        fill: '#e2e2e2',
                        lineWidth: 3,
                    },
                }
            },
            {
                source: '0',
                target: '2',
            },
            {
                source: '0',
                target: '3',
            },
            {
                source: '0',
                target: '4',
            },
            {
                source: '0',
                target: '5',
            },
            {
                source: '0',
                target: '7',
            },
            {
                source: '0',
                target: '8',
            },
            {
                source: '0',
                target: '9',
            },
            {
                source: '0',
                target: '10',
            },
            {
                source: '0',
                target: '11',
            },
            {
                source: '0',
                target: '13',
            },
            {
                source: '0',
                target: '14',
            },
            {
                source: '0',
                target: '15',
            },
            {
                source: '0',
                target: '16',
            },
            {
                source: '2',
                target: '3',
            },
            {
                source: '4',
                target: '5',
            },
            {
                source: '4',
                target: '6',
            },
            {
                source: '5',
                target: '6',
            },
            {
                source: '7',
                target: '13',
            },
            {
                source: '8',
                target: '14',
            },
            {
                source: '9',
                target: '10',
            },
            {
                source: '10',
                target: '22',
            },
            {
                source: '10',
                target: '14',
            },
            {
                source: '10',
                target: '12',
            },
            {
                source: '10',
                target: '24',
            },
            {
                source: '10',
                target: '21',
            },
            {
                source: '10',
                target: '20',
            },
            {
                source: '11',
                target: '24',
            },
            {
                source: '11',
                target: '22',
            },
            {
                source: '11',
                target: '14',
            },
            {
                source: '12',
                target: '13',
            },
            {
                source: '16',
                target: '17',
            },
            {
                source: '16',
                target: '18',
            },
            {
                source: '16',
                target: '21',
            },
            {
                source: '16',
                target: '22',
            },
            {
                source: '17',
                target: '18',
            },
            {
                source: '17',
                target: '20',
            },
            {
                source: '18',
                target: '19',
            },
            {
                source: '19',
                target: '20',
            },
            {
                source: '19',
                target: '33',
            },
            {
                source: '19',
                target: '22',
            },
            {
                source: '19',
                target: '23',
            },
            {
                source: '20',
                target: '21',
            },
            {
                source: '21',
                target: '22',
            },
            {
                source: '22',
                target: '24',
            },
            {
                source: '22',
                target: '25',
            },
            {
                source: '22',
                target: '26',
            },
            {
                source: '22',
                target: '23',
            },
            {
                source: '22',
                target: '28',
            },
            {
                source: '22',
                target: '30',
            },
            {
                source: '22',
                target: '31',
            },
            {
                source: '22',
                target: '32',
            },
            {
                source: '22',
                target: '33',
            },
            {
                source: '23',
                target: '28',
            },
            {
                source: '23',
                target: '27',
            },
            {
                source: '23',
                target: '29',
            },
            {
                source: '23',
                target: '30',
            },
            {
                source: '23',
                target: '31',
            },
            {
                source: '23',
                target: '33',
            },
            {
                source: '32',
                target: '33',
            },
        ],
        combos: [
            {
                id: 'a',
                label: 'Combo A',
            },
            {
                id: 'b',
                label: 'Combo B',
            },
            {
                id: 'c',
                label: 'Combo C',
            },

        ],
    };
    packageOriginData()
}

const packageOriginData = () => {
    // 将node combo 全部整理成对象的形式，key 为 id 或者combo
    (data.nodes.concat(data.combos)).forEach(item => {
        const { id, comboId, parentId } = item;
        const parentComboId = comboId || parentId;
        if (parentComboId) {
            if (!comboChildrenCache[parentComboId]) comboChildrenCache[parentComboId] = [];
            comboChildrenCache[parentComboId].push(id);
            itemComboMap[id] = parentComboId;
        }
        itemMap[id] = { ...item };
    });
    console.log('itemMap', itemMap);

    // 将combos边整理成对象形式
    const comboIds = data.combos.map(combo => combo.id);
    console.log('comboIds', comboIds);
    data.edges.forEach(edge => {
        const { source, target } = edge;
        [source, target].forEach(endId => {
            if (comboIds.includes(endId)) {
                if (!comboEdges[endId]) comboEdges[endId] = [];
                comboEdges[endId].push(edge);
            }
        })
    });
    console.log('comboEdges', comboEdges);
    colorizeData()
}

const colorizeData = () => {
    // colorize the nodes and combos
    const subjectColors = [
        '#5F95FF', // blue
        '#61DDAA',
        '#65789B',
        '#F6BD16',
        '#7262FD',
        '#78D3F8',
        '#9661BC',
        '#F6903D',
        '#008685',
        '#F08BB4',
    ];
    const backColor = '#fff';
    const theme = 'default';
    const disableColor = '#777';
    // 生成调色盘
    const colorSets = G6.Util.getColorSetsBySubjectColors(
        subjectColors,
        backColor,
        theme,
        disableColor,
    );
    console.log('colorSets', colorSets);
    // combo 调整样式
    data.combos.forEach((combo, i) => {
        const color = colorSets[i % colorSets.length];
        combo.style = {
            stroke: color.mainStroke,
            fill: color.mainFill,
            opacity: 0.8
        }
        itemMap[combo.id].style = { ...combo.style }
    })
    console.log('data.combos', data.combos);

    // node 跟随comboParent颜色变化    
    console.log('itemComboMap', itemComboMap);
    data.nodes.forEach(node => {
        const comboId = itemComboMap[node.id];
        const parentCombo = itemMap[comboId];
        if (parentCombo) {
            node.style = {
                stroke: parentCombo.style.stroke,
                fill: parentCombo.style.fill
            }
        }
    })

    contextMenu = new G6.Menu({
        itemTypes: ['combo', 'node'],
        shouldBegin: (evt) => {
            // avoid showing up context menu in some situations
            const type = evt.item.getType();
            const { id, comboId, collapsed } = evt.item.getModel();
            if (collapsed) return false;

            const hasOriComboId = Object.values(comboChildrenCache).find(childrenIds => childrenIds.includes(id));
            if (type === 'node' && (comboId || !hasOriComboId)) return false;
            return true;
        },
        getContent: (evt) => {
            const type = evt.item.getType();
            const { id, comboId, parentId, collapsed } = evt.item.getModel();
            const hasOriComboId = Object.values(comboChildrenCache).find(childrenIds => childrenIds.includes(id));

            if (type === 'combo') {
                // no context menu for collapsed combo
                if (collapsed) return ''
                // does not have parent currently but had parent at initial
                if (hasOriComboId && !parentId) return `<span id="uncombo">uncombo</span><br/><span id="re-combo">re-combo</span>`;
                // did not have parent at initail
                return `<span id="uncombo">uncombo</span>`;
            }

            // has combo currently
            if (comboId) return '';
            // does not have combo but had combo at initial
            if (hasOriComboId) return `<span id="recombo">re-combo</span>`;
            return '';
        },
        handleMenuClick: (target, item) => {
            if (target.innerHTML === 'uncombo') {
                graph.uncombo(item);
                graph.layout();
            } else {
                const id = item.getID();
                const comboId = itemComboMap[id];
                if (comboId) {
                    const childrenIds = comboChildrenCache[comboId].filter(cid => !!graph.findById(cid));
                    graph.createCombo({
                        ...itemMap[comboId]
                    }, childrenIds);
                    // add the related edges back
                    comboEdges[comboId]?.forEach(edge => {
                        const { source, target } = edge;
                        const otherEnd = source === comboId ? target : source;
                        // add it back only when the other end of the edge exist currently
                        if (graph.findById(otherEnd)) {
                            graph.addItem('edge', edge);
                        }
                    });
                    graph.layout();
                }
            }
        },
    })
    // 数据样式就位，初始化
    initChartWithTrace()
}


const initChartWithTrace = () => {
    const container = document.getElementById('container');
    const width = container.scrollWidth;
    const height = (container.scrollHeight || 700);
    const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitView: true,
        fitViewPadding: 100,
        animate: true,
        minZoom: 0.00000001,
        plugins: [contextMenu],
        layout: {
            type: 'comboCombined',
            spacing: 5,
            outerLayout: new G6.Layout['forceAtlas2']({
                kr: 15,

            }),

            // type: 'comboForce',

            // preventNodeOverlap: true,
            // nodeSpacing: 30,

            // preventComboOverlap: true,
            // comboSpacing: 30,

        },
        defaultNode: {
            size: 30,
            style: {
                lineWidth: 2,
                fill: '#C6E5FF',
            },
        },
        defaultEdge: {
            size: 3,
            color: '#e2e2e2',
        },
        defaultCombo: {
            collapsedSubstituteIcon: {
                show: true,
                img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IEQFS5VtXX8AAAAAAAAAAABkARQnAQ',
                width: 68,
                height: 68,
            },
        },
        modes: {
            default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas', 'collapse-expand-combo'],
        },
    });
    graph.data(data);
    graph.render();
    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
}


onMounted(() => {
    // 获取数据
    getOriginData()

})




</script>
<style lang="less" scoped>
#container {
    width: 100%;
    height: 700px;
}
</style>
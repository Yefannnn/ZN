<template >
    <div class="containter"></div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { Graph } from '@antv/x6';
import { nanoid } from 'nanoid'

// 指定布局范围
let layoutScopeX = [200, 1700]
let layoutScopeY = [200, 500]
let deepY = 750

// 模拟原始数据
/**
 *          id: string,  // 节点id
            label: string,  // 节点label
            position: string,  // 节点位置
            type: string  // 节点类型 用于映射图片
            order：number   // 同层级排序
 */
let originData = {
    nodes: [
        {
            id: '111',  // 节点id
            label: '111',  // 节点label
            position: 'left',  // 节点位置
            type: 'ground'  // 节点类型 用于映射图片
        },
        {
            id: '222',
            label: '222',
            position: 'right',
            type: 'ground'
        },
        {
            id: '333',
            label: '333',
            position: 'bottom',
            order: 1,
            type: 'air'
        },
        {
            id: '444',
            label: '444',
            position: 'bottom',
            order: 2,
            type: 'air'
        },
        {
            id: '555',
            label: '555',
            position: 'bottom',
            order: 3,
            type: 'air'
        },
        {
            id: '666',
            label: '666',
            position: 'bottom',
            order: 4,
            type: 'air'
        },
        {
            id: '777',
            label: '777',
            position: 'bottom',
            order: 5,
            type: 'air'
        },
        {
            id: '888',
            label: '888',
            position: 'top',
            order: 1,
            type: 'air'
        },
        {
            id: '999',
            label: '999',
            position: 'top',
            order: 2,
            type: 'air'
        },
        {
            id: '1010',
            label: '1010',
            position: 'top',
            order: 3,
            type: 'air'
        },
        {
            id: '1111',
            label: '1111',
            position: 'top',
            order: 4,
            type: 'air'
        },
        {
            id: '1212',
            label: '1212',
            position: 'deep',
            order: 1,
            type: 'air'
        },
        {
            id: '1313',
            label: '1313',
            position: 'deep',
            order: 2,
            type: 'air'
        },
        {
            id: '1414',
            label: '1414',
            position: 'deep',
            order: 3,
            type: 'air'
        },
        {
            id: '1515',
            label: '1515',
            position: 'deep',
            order: 4,
            type: 'air'
        },
        {
            id: '1616',
            label: '1616',
            position: 'deep',
            order: 5,
            type: 'air'
        },
        {
            id: '1717',
            label: '1717',
            position: 'deep',
            order: 6,
            type: 'air'
        },
        {
            id: '1818',
            label: '1818',
            position: 'deep',
            order: 7,
            type: 'air'
        },

    ],
    edge: [
        {
            "source": "111",
            "target": "333",
            type: 1
        },
        {
            "source": "333",
            "target": "444",
            type: 1
        },
        {
            "source": "444",
            "target": "555",
            type: 1

        },
        {
            "source": "555",
            "target": "666",
            type: 1

        },
        {
            "source": "666",
            "target": "777",
            type: 1

        },
        {
            "source": "777",
            "target": "222",
            type: 1

        },
        {
            "source": "222",
            "target": "888",
            type: 1

        },
        {
            "source": "888",
            "target": "999",
            type: 1

        },
        {
            "source": "999",
            "target": "1010",
            type: 1

        },
        {
            "source": "1010",
            "target": "1111",
            type: 1

        },
        {
            "source": "1111",
            "target": "111",
            type: 1

        },
        {
            "source": "111",
            "target": "1212",
            type: 2

        },
        {
            "source": "111",
            "target": "1313",
            type: 2

        },
        {
            "source": "111",
            "target": "1414",
            type: 2

        },
        {
            "source": "111",
            "target": "1212",
            type: 2

        },
        {
            "source": "111",
            "target": "1313",
            type: 2

        },

        {
            "source": "1616",
            "target": "111",
            type: 1
        },
        {
            "source": "1717",
            "target": "111",
            type: 1
        },
        {
            "source": "1818",
            "target": "111",
            type: 1
        },
    ]
}

// type => url 映射
let maptypetoUrl = {
    'air': new URL('src/assets/images/img/444.png', window.location.href).href,
    ground: new URL('src/assets/images/img/222.png', window.location.href).href,
}

// 对数据进行整理
let leftArr,
    rightArr,
    topArr,
    bottomArr,
    deepArr
const packageOriginDataWithNodes = () => {
    leftArr = originData.nodes.filter(item => item.position === 'left')
    rightArr = originData.nodes.filter(item => item.position === 'right')
    bottomArr = originData.nodes.filter(item => item.position === 'bottom')
    topArr = originData.nodes.filter(item => item.position === 'top')
    deepArr = originData.nodes.filter(item => item.position === 'deep')

    leftArr = leftArr.map(item => {
        return {
            ...item,
            shape: 'html',
            html() {
                const wrap = document.createElement('div')
                wrap.style.width = '100%'
                wrap.style.height = '100%'
                let image = document.createElement('img')
                image.src = maptypetoUrl[item.type]
                image.style.width = '100%'
                wrap.appendChild(image)
                let pp = document.createElement('div')
                pp.style.width = '100%'
                pp.style.backgroundColor = '#cdcdcd'
                pp.style.display = 'flex'
                pp.style.justifyContent = 'center'
                pp.style.alignItems = 'center'
                pp.innerText = item.label
                wrap.appendChild(pp)
                return wrap
            },
            width: 120,   // Number，可选，节点大小的 width 值
            height: 50,  // Number，可选，节点大小的 height 值
            x: layoutScopeX[0],
            y: (layoutScopeY[1] - layoutScopeY[0]) / 2 + layoutScopeY[0],
            attrs: {
                label: {
                    refX: 8,
                    refY: 8,
                    textAnchor: 'start',
                    textVerticalAnchor: 'top',
                    opacity: 0
                },
            },
        }
    })
    rightArr = rightArr.map(item => ({
        ...item,
        shape: 'html',
        html() {
            const wrap = document.createElement('div')
            wrap.style.width = '100%'
            wrap.style.height = '100%'
            let image = document.createElement('img')
            image.src = maptypetoUrl[item.type]
            image.style.width = '100%'
            wrap.appendChild(image)
            let pp = document.createElement('div')
            pp.style.width = '100%'
            pp.style.backgroundColor = '#cdcdcd'
            pp.style.display = 'flex'
            pp.style.justifyContent = 'center'
            pp.style.alignItems = 'center'
            pp.innerText = item.label
            wrap.appendChild(pp)
            return wrap
        },
        width: 120,   // Number，可选，节点大小的 width 值
        height: 50,  // Number，可选，节点大小的 height 值
        x: layoutScopeX[1],
        y: (layoutScopeY[1] - layoutScopeY[0]) / 2 + layoutScopeY[0],
        attrs: {
            label: {
                refX: 8,
                refY: 8,
                textAnchor: 'start',
                textVerticalAnchor: 'top',
                opacity: 0
            },
        },
    }))
    let bottomLength = bottomArr.length
    bottomArr = bottomArr.map((item, index) => ({
        ...item,
        shape: 'html',
        html() {
            const wrap = document.createElement('div')
            wrap.style.width = '100%'
            wrap.style.height = '100%'
            let image = document.createElement('img')
            image.src = maptypetoUrl[item.type]
            image.style.width = '100%'
            wrap.appendChild(image)
            let pp = document.createElement('div')
            pp.style.width = '100%'
            pp.style.backgroundColor = '#cdcdcd'
            pp.style.display = 'flex'
            pp.style.justifyContent = 'center'
            pp.style.alignItems = 'center'
            pp.innerText = item.label
            wrap.appendChild(pp)
            return wrap
        },
        width: 60,   // Number，可选，节点大小的 width 值
        height: 60,  // Number，可选，节点大小的 height 值
        x: ((layoutScopeX[1] - layoutScopeX[0]) / (bottomLength + 1)) * (index + 1) + layoutScopeX[0],
        y: layoutScopeY[1],
        attrs: {
            label: {
                refX: 8,
                refY: 8,
                textAnchor: 'start',
                textVerticalAnchor: 'top',
                opacity: 0
            },
        },
    }))

    let topLength = topArr.length
    topArr = topArr.map((item, index) => ({
        ...item,
        shape: 'html',
        html() {
            const wrap = document.createElement('div')
            wrap.style.width = '100%'
            wrap.style.height = '100%'
            let image = document.createElement('img')
            image.src = maptypetoUrl[item.type]
            image.style.width = '100%'
            wrap.appendChild(image)
            let pp = document.createElement('div')
            pp.style.width = '100%'
            pp.style.backgroundColor = '#cdcdcd'
            pp.style.display = 'flex'
            pp.style.justifyContent = 'center'
            pp.style.alignItems = 'center'
            pp.innerText = item.label
            wrap.appendChild(pp)
            return wrap
        },
        width: 60,   // Number，可选，节点大小的 width 值
        height: 60,  // Number，可选，节点大小的 height 值
        x: layoutScopeX[1] - ((layoutScopeX[1] - layoutScopeX[0]) / (topLength + 1)) * (index + 1),
        y: layoutScopeY[0],
        attrs: {
            label: {
                refX: 8,
                refY: 8,
                textAnchor: 'start',
                textVerticalAnchor: 'top',
                opacity: 0
            },
        },
    }))

    let deepLength = deepArr.length
    deepArr = deepArr.map((item, index) => ({
        ...item,
        shape: 'html',
        width: 65,
        height: 65,
        // imageUrl: maptypetoUrl[item.type],
        html() {
            const wrap = document.createElement('div')
            wrap.style.width = '100%'
            wrap.style.height = '100%'
            let image = document.createElement('img')
            image.src = maptypetoUrl[item.type]
            image.style.width = '100%'
            wrap.appendChild(image)
            let pp = document.createElement('div')
            pp.style.width = '100%'
            pp.style.backgroundColor = '#cdcdcd'
            pp.style.display = 'flex'
            pp.style.justifyContent = 'center'
            pp.style.alignItems = 'center'
            pp.innerText = item.label
            wrap.appendChild(pp)
            return wrap
        },
        x: ((layoutScopeX[1] - layoutScopeX[0]) / (deepLength + 1)) * (index + 1) + layoutScopeX[0],
        y: deepY,
        attrs: {
            label: {
                refX: 8,
                refY: 8,
                textAnchor: 'start',
                textVerticalAnchor: 'top',
                opacity: 0
            },
        },
    }))

    return [...leftArr, ...rightArr, ...bottomArr, ...topArr, ...deepArr]
}

const packageOriginDataWithEdges = () => {
    let readyIds = []
    readyIds = originData.edge.reduce((pre, curr, index, arr) => {
        let opt = {
            ...curr,
            connector: {
                name: 'rounded',
                args: { radius: 10 },
            },
            attrs: {
                line: {
                    stroke: '#1890ff',
                    // strokeDasharray: 5,
                    targetMarker: 'classic',
                    style: {
                        animation: 'ant-line 30s infinite linear',
                    },
                },
            },
            zIndex: -1,
        }
        if (curr.type === 1) {
            opt.attrs.line.stroke = '#1890ff' // type => lineStyle
            pre.push(opt)
        } else {
            opt.attrs.line.stroke = '#73d13d' // type => lineStyle
            pre.push(opt)
        }

        return pre
    }, [])
    return readyIds
}

// 初始化画布
const initGragh = () => {
    let readyNodesData = packageOriginDataWithNodes()
    let readyEdgesData = packageOriginDataWithEdges()
    let graph = new Graph({
        container: document.querySelector('.containter'),
        width: document.querySelector('.containter').scrollWidth || 1920,
        height: document.querySelector('.containter').scrollHeight || 900,
    });
    // add Node
    readyNodesData.forEach(item => {
        graph.addNode({
            ...item
        })
    })

    readyEdgesData.forEach(item => {
        graph.addEdge({
            ...item
        })
    })

}

onMounted(() => {
    initGragh()
})


</script>
<style lang="less" scoped>
.containter {
    width: 1920px;
    height: 935px;
    background-color: rgb(45, 46, 119);
}
</style>
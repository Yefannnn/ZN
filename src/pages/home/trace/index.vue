<template >
    <div class="selectArea">
        <div class="selectItem selectItemCenter">
            <span style="marginBottom:5px">开始时间</span>
            <div class="demo-datetime-picker">
                <div class="block">
                    <el-date-picker format=" " v-model="startTime" type="datetime" :clearable="false" />
                </div>
            </div>
        </div>
        <div class="selectItem selectItemCenter">
            <span style="marginBottom:5px">结束时间</span>
            <div class="demo-datetime-picker">
                <div class="block">
                    <el-date-picker format=" " v-model="endTime" type="datetime" :clearable="false" />
                </div>
            </div>
        </div>
        <div class="selectItem  selectItemCenter service" v-for="item in filterArea" :key="item">
            <span style="marginBottom:5px">{{ item.title }}</span>
            <el-select v-model="item.selected" class="m-2" placeholder="Select" size="small" popper-class="selectBox">
                <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <span style="color: #c6c7ca;margin-left: 15px;">时间范围：{{ formatTime(startTime) }} - {{
            formatTime(endTime)
        }}</span>
        <div class="buttonGroup">
            <button class="clearBth">清空</button>

        </div>

    </div>
    <div class="containter">
        <div class="LeftOfListBox">
            <div class="topPapg">
                <el-pagination v-model:current-page="pageSource.currentPage" :small="small" :disabled="disabled"
                    :page-size="pageSource.pageSize" :total="pageSource.total" background="transparent"
                    layout="prev,jumper, next" @current-change="handleCurrentChange" />
            </div>
            <div class="bottonContaninter">
                <ul>
                    <li class="contaninterItem" v-for="item in serviceListData" :key="item"
                        :style="{ backgroundColor: item.active ? '#ededed' : '' }" @click="changeActiveLis(item.id)">
                        <div class="items">
                            <p>{{ item.name }}</p>
                            <p><span class="delayItem">{{ item.delay }}</span><span
                                    style="margin-left:20px;color:#b7aebb">{{
    item.date
                                    }}</span></p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="RightOfTreeBox"></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'
const startTime = ref()

const endTime = ref()

const formatTime = (time) => {
    if (!time) {
        return
    }
    let date = new Date(time)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let hh = date.getHours()
    let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    console.log(y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss);
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
}


const filterArea = ref([
    {
        title: '服务',
        selected: 'All',
        options: [
            {
                label: 'All',
                value: 'All'
            },
            {
                label: '111',
                value: '111'
            }
        ]
    },
    {
        title: '实例',
        selected: 'All',
        options: [
            {
                label: 'All',
                value: 'All'
            },
            {
                label: '111',
                value: '111'
            }
        ]
    },
    {
        title: '状态',
        selected: 'All',
        options: [
            {
                label: 'All',
                value: 'All'
            },
            {
                label: '111',
                value: '111'
            }
        ]
    },
    {
        title: '断点名称',
        selected: 'All',
        options: [
            {
                label: 'All',
                value: 'All'
            },
            {
                label: '111',
                value: '111'
            }
        ]
    }
])


// 列表数据
const serviceListData = ref([
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: true
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false

    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false

    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
    {
        id: nanoid(),
        name: 'Mysql/JDBI/Connection/close',
        delay: '10ms',
        date: '2023-2-13 11:31:52',
        active: false
    },
])

// 分页信息
const pageSource = ref({
    currentPage: 1,
    pageSize: 10,
    total: 30
})

const handleCurrentChange = (e) => {
    pageSource.value.currentPage = e
}


const changeActiveLis = (id) => {
    serviceListData.value.forEach(item => {
        item.id === id ?
            (item.active = true) : (item.active = false)

    })

}


onMounted(() => {

})

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
        border-color: '#333840' !important
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
                        width: 35px;
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
        background-color: #cdcdcd;
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
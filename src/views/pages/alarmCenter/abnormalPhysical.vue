<template>
     
    <div class="body">
        <div class="search_box flex_space_between bg-#fff mb-20px">
            <div class="flex_start gap-20px">
                <div class="search_item flex_start">
                    <div class="search_label">设备CCID：</div>
                    <div> <el-input size="large" v-model="search_form.ccid" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">告警时间：</div>
                    <div>
                        <el-date-picker size="large" class="date_picker_width" v-model="search_form.start" type="date"
                            placeholder="请选择起始时间" :disabled-date="start_date_diabled" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" />
                    </div>
                    <div class="range_text">--</div>
                    <div>
                        <el-date-picker size="large" class="date_picker_width" v-model="search_form.end" type="date"
                            placeholder="请选择结束时间" :disabled-date="end_date_diabled" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" />
                    </div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">告警类型：</div>
                    <div class="select_width w-200px">
                        <el-select v-model="search_form.alarm_type" size="large">
                            <el-option :key="item.value" v-for="item in alarm_types" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_btn_box">
                    <el-button type="primary" size="large" @click="search">查询</el-button>
                    <el-button type="info" size="large" @click="reset">重置</el-button>
                </div>
            </div>
        </div>
        <div class="table_box">
            <el-table :data="tableData" border  size="large" v-loading="tableLoading" class="tableshadow">
                <el-table-column label="序号" align="center">
                    <template #default="props">
                        {{ props.$index + (pageQuery.perPage * (pageQuery.page - 1) + 1) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="birthday" label="年龄" align="center">
                    <template #default="props">
                        {{ props.row.birthday ?
                            ((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 < 365 ?
                                Math.floor((new Date().getTime() - new Date(props.row.birthday).getTime()) / 86400000) + '天'
                                : Math.floor(((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 /
                                    365) + '周岁' : "" }} </template>
                </el-table-column>
                <el-table-column prop="bed_number" label="床位号" align="center">
                    <template #default="props">
                        {{ props.row.bed_number ? props.row.bed_number + '' : "" }}
                    </template>
                </el-table-column>
                <el-table-column prop="alarm_type_name" label="告警类型" align="center"></el-table-column>
                <el-table-column label="告警时间" align="center" width="220">
                    <template #default="props">
                        {{ props.row.alarm_time ? dateFtt('yyyy-mm-dd hh:MM:ss', new Date(props.row.alarm_time * 1000)) : "" }}
                    </template>
                </el-table-column>

            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import WarningApi from '@/api/warning';
import bus from '@/eventBus/eventBus';
import type { Pagination, WarningTableItem } from '@/interface/interface';
import { dateFtt } from '@/utils/date/dateFtt';
import { onMounted, reactive, ref } from 'vue';

// 搜索
const search_form = reactive({
    name: "",
    ccid: "",
    start: '',
    end: '',
    alarm_type: ""
})

const alarm_types = [
    {
        value: 266,
        label: "连续低血氧告警"
    },
    {
        value: 267,
        label: "连续高心率告警"
    },
    {
        value: 268,
        label: "连续低心率告警"
    }
    // ,{
    //     value: 69,
    //     label: "离院告警"
    // },
]

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
     tableLoading.value = true
    fetchData()

}
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
      tableLoading.value = true
    search_form.ccid = ''
    search_form.name = ''
    search_form.start = ''
    search_form.end = ''
    search_form.alarm_type = ""
    fetchData()
}

const start_date_diabled = (date: Date) => {
    if (!search_form.end) return false
    if (new Date(search_form.end + ' 23:59:59') < date) return true
}
const end_date_diabled = (date: Date) => {
    if (!search_form.start) return false
    if (new Date(search_form.start + ' 00:00:00') > date) return true

}
// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 10,
    total: 0
})

const handleSizeChange = (val: number) => {
    pageQuery.perPage = val
     tableLoading.value = true
    fetchData()
}
const handleCurrentChange = (val: number) => {
    pageQuery.page = val
     tableLoading.value = true
    fetchData()
}

//列表

const tableLoading = ref<boolean>(false)
let tableData = reactive<WarningTableItem[]>([])
const fetchData = async () => {
   
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        name: search_form.name,
        ccid: search_form.ccid,
        start: search_form.start ? new Date(search_form.start + ' 00:00:00').getTime() / 1000 : '',
        end: search_form.end ? new Date(search_form.end + ' 23:59:59').getTime() / 1000 : '',
        alarm_type: search_form.alarm_type
    }
    const result = (await WarningApi.getWarningList(data)).data.result
    if (result) {
        bus.emit('refreshData')
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
        tableData.forEach((item, index) => {
            alarm_types.forEach(e => {
                if (e.value == item.alarm_type) {
                    tableData[index]!.alarm_type_name = e.label
                }
            })
        })
    }

}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.range_text {
    font-size: 12px;
    margin: 0 8px;
    font-weight: 500;
    color: #929FAF;
}

.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.body{
    padding: 24px;
}
</style>

<template>
    <div class="body">
        <div class="search_box flex_space_between bg-#fff mb-20px">
            <div class="flex_start gap-20px">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">设备CCID：</div>
                    <div> <el-input size="large" v-model="search_form.ccid" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_btn_box">
                    <el-button type="primary" size="large" @click="search">查询</el-button>
                    <el-button type="info" size="large" @click="reset">重置</el-button>
                </div>
            </div>
        </div>
        <div class="table_box">
            <el-table :data="tableData" border size="large" v-loading="tableLoading" class="tableshadow">
                <el-table-column label="序号" align="center" width="110">
                    <template #default="props">
                        {{ props.$index + (pageQuery.perPage * (pageQuery.page - 1) + 1) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center" width="220"></el-table-column>
                <el-table-column prop="bed_number" label="床位号" align="center">
                    <template #default="props">
                        {{ props.row.bed_number ? props.row.bed_number + '号床' : "" }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="birthday" label="年龄" align="center">
                    <template #default="props">
                        {{ props.row.birthday ?
                            ((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 < 365 ?
                                Math.floor((new Date().getTime() - new Date(props.row.birthday).getTime()) / 86400000) + '天'
                                : Math.floor(((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 /
                                    365) + '周岁' : "" }} </template>
                </el-table-column>
                <el-table-column label="佩戴异常时间" align="center" width="220">
                    <template #default="props">
                        {{ props.row.insert_time ? dateFtt('yyyy-mm-dd hh:MM:ss', new Date(props.row.insert_time *
                            1000))
                            : "" }}
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
import WearApi from '@/api/wear';
import type { WearTableItem, Pagination } from '@/interface/interface';
import { dateFtt } from '@/utils/date/dateFtt';
import { onMounted, reactive, ref } from 'vue';

// 搜索
const search_form = reactive({
    name: "",
    ccid: "",
})

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()

}
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.ccid = ''
    search_form.name = ''
    fetchData()
}

// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 10,
    total: 0
})

const handleSizeChange = (val: number) => {
    pageQuery.perPage = val
    fetchData()
}
const handleCurrentChange = (val: number) => {
    pageQuery.page = val
    fetchData()
}

//列表

const tableLoading = ref<boolean>(false)
let tableData = reactive<WearTableItem[]>([])
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        name: search_form.name,
        ccid: search_form.ccid,
    }
    const result = (await WearApi.getWearList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
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

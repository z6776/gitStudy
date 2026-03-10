<template>
     <header class="header">
   
 </header>
    <div class="patientjournal">
        <div class="search_box flex_space_between">
            <div class="flex_start">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.patient_name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">设备CCID：</div>
                    <div> <el-input size="large" v-model="search_form.ccid" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_btn_box">
                    <el-button type="success" size="large" @click="search">查询</el-button>
                    <el-button type="warning" size="large" @click="reset">重置</el-button>
                </div>
            </div>
            <div class="flex_r">
                <div class="flex_r_text">今日已提交：{{ is_number }}</div>
                <div class="flex_r_text">今日未提交：{{ not_number }}</div>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
                <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="patient_num" label="住院号" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID号" align="center"></el-table-column>
                <el-table-column prop="created_at" label="提交时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="props">
                        <el-button type="success" plain @click="toH5(props.row)">查看日志详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>

    <!-- <custom-dialog v-model="bor" append-to-body class="_loading" title="患者日志" :show-close="false"
    :width="`${383*2/3}px`" :height="`${640*2/3}px`" top="10vh">
        <iframe :src="iframe_src" :width="`${383*2/3}px`" :height="`${640*2/3}px`" ></iframe>
    </custom-dialog> -->
    <custom-dialog v-model="bor" append-to-body class="_loading" title="人员日志" :show-close="false"
    :width="`${350/1920*100}%`" top="10vh">
        <iframe :src="iframe_src" class="_iframe" ></iframe>
        <div class="sf_btn" @click="bor=false">
            关闭
        </div>
    </custom-dialog>
    
    
</template>

<script setup lang='ts'>
import PatientjournalApi from '@/api/patientjournal';
import type { WearTableItem,CallTableItem, Pagination,Timer } from '@/interface/interface';
import { onMounted, reactive,onUnmounted, ref } from 'vue';
import { myInterval } from '@/utils/interval/interval';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage } from 'element-plus';
import bus from '@/eventBus/eventBus';

// 搜索
const search_form = reactive({
    patient_name: "",
    ccid: "",
})

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()

}
const iframe_src = ref<string>('')

const bor = ref<boolean>(false);
const toH5 =(row: any)=>{
    let data = JSON.stringify(row)
    bor.value = true;
    iframe_src.value = `${import.meta.env.VITE_API_URL_H5RUL}wxsf/#/logDetail?fromWeb=1&data=${data}`
}
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.ccid = ''
    search_form.patient_name = ''
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
const is_number = ref<number>(0)
const not_number = ref<number>(0)
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        patient_name: search_form.patient_name,
        ccid: search_form.ccid,
    }
    const result = (await PatientjournalApi.apiList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }

    const result_apiDaySubmit = (await PatientjournalApi.apiDaySubmit()).data.result
  

    if (result_apiDaySubmit) {
        is_number.value = result_apiDaySubmit.is_number
        not_number.value = result_apiDaySubmit.not_number
        
    }
}
onMounted(() => {
    fetchData()
})
const timer: Timer = {
    id: undefined
}
myInterval(() => {
    fetchData()
}, 60000, timer)()
onUnmounted(() => {
    clearTimeout(timer.id)
})
</script>

<style scoped>
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.patientjournal{
    width: 97%;
    margin: 0 auto;
    /* height: 90px; */
}
.patientjournal .table_box{
     margin-top:30px;
}
.flex_r{
    font-size: 20px;
    display: flex;
    font-size: 16px;

}
.flex_r_text{
    margin-right: 40px;
}
._iframe{
    width: 100%;
    height: 748px;
}
.sf_btn{
    width: 100%;
    height: 48px;
    font-size: 16px;
    text-align: center;
    line-height: 48px;
    color: white;
    background-color: #1ab8cc;
    position: absolute;
    bottom:-2px;
}
</style>
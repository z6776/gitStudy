<template>
    <div class="wearConditionManagement">
        <div class="search_box flex_space_between bg-#fff m-[20px_0px]">
            <div class="flex_start gap-20px">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.patient_name" placeholder="请输入"></el-input></div>
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
            <div>
                <el-button :type="bor ? 'primary' : 'info'"  size="large" @click="getTuo">
                    待脱组
                     {{ num }}
                </el-button>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border   size="large" v-loading="tableLoading" class="rounded-12px">
                <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                <el-table-column prop="ccid" label="脱组类型" align="center">
                    <template #default="props">
                        <div>
                            {{ filters(props.row.group_status)  }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="group_end" label="脱组时间" align="center"></el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <custom-dialog v-model="bor" append-to-body class="_loading" title="待脱组" 
            :width="`${768 / 1920 * 100}%`">
            <div class="tuo_table">
                <div class="text">
                    以下人员连续7天佩戴未超过50小时
                </div>
                <div class="table_box">
                    <el-table :data="tuotableData" border  size="large" v-loading="tableLoadingTuo">
                        <el-table-column prop="patient_name" label="姓名" width="120px" align="center"></el-table-column>
                        <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                        <el-table-column prop="group_end" label="脱组时间" align="center">
                            <template #default="props">
                                <el-button type="primary" @click="setTuo(props.row)" color="#F22727" plain>脱组</el-button>
                                <el-button type="primary" @click="escTuo(props.row)" color="#929FAF" plain>忽略</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <elc-pagination v-model:current-page="pageQuerytuo.page" v-model:page-size="pageQuerytuo.perPage"
                        :page-sizes="[5,10,15]" layout="total, sizes, prev, pager, next, jumper"
                        :total="pageQuerytuo.total" @size-change="tuohandleSizeChange"
                        @current-change="tuohandleCurrentChange" />
                </div>
            </div>

        </custom-dialog>
    </div>
</template>

<script setup lang='ts'>
import WearConditionManagement from '@/api/wearConditionManagement';
import type { WearTableItem, CallTableItem, Pagination } from '@/interface/interface';
import { onMounted, reactive, ref } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage } from 'element-plus';
import bus from '@/eventBus/eventBus';
import { setTextRange } from 'typescript';

// 搜索
const search_form = reactive({
    patient_name: "",
    ccid: "",
})

const num = ref<number>(0)
const bor = ref<boolean>(false)


const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
    

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
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        patient_name: search_form.patient_name,
        ccid: search_form.ccid,
    }
    const result = (await WearConditionManagement.apiList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
        tuoData()
    }

}

const filters = (txt:number) => {
        if(txt==1){
            return '入组'
        }else if(txt == 2){
            return '手动脱组'
        }else if(txt == 3){
            return '自动脱组'
        }else if(txt == 4){
            return '待脱组'
        }
}

// 待脱组数量
const getTuo = () => {
    pageQuerytuo.page = 1
    pageQuerytuo.perPage = 5
    bor.value = true
    tuoData()
}
// 分页器
const pageQuerytuo = reactive<Pagination>({
    page:1,
    perPage:5,
    total:0
})
// 获取待脱组列表
let tuotableData = reactive<any>([])
let tableLoadingTuo = ref<boolean>(false)
const tuoData = async() =>{
    tableLoadingTuo.value = true
    let data = {
        page: pageQuerytuo.page,
        perPage: pageQuerytuo.perPage,
        group_status:4,
    }
    const result = (await WearConditionManagement.apiList(data)).data.result
    if (result) {
        tableLoadingTuo.value = false
        pageQuerytuo.total = result.total
        tuotableData = result.data
        num.value = result.total 
    }
}
// 脱组
const setTuo = async (row:any) => {
    const data = {id:row.id}
    const result = (await WearConditionManagement.groupEnd(data)).data.result
    if (result) {
        pageQuerytuo.page = 1
        pageQuerytuo.perPage = 5
        ElMessage({
                    type: 'success',
                    message: '操作成功',
                })
        tuoData()
    }
}
// 忽略
const escTuo = async (row:any) => {
    const data = {id:row.id}
    const result = (await WearConditionManagement.ignore(data)).data.result
    if (result) {
        pageQuerytuo.page = 1
        pageQuerytuo.perPage = 5
        ElMessage({
                    type: 'success',
                    message: '操作成功',
                })
        tuoData()
    }
}
const tuohandleSizeChange = (val: number) => {
    pageQuery.perPage = val
    tuoData()
}
const tuohandleCurrentChange = (val: number) => {
    pageQuery.page = val
    tuoData()
}

onMounted(() => {
    fetchData()
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

.wearConditionManagement {
    padding: 0 24px;
}

.num {
    width: 22px;
    height: 22px;
    background-color: #009224;
    color: #fff;
    border-radius: 22px;
    line-height: 22px;
    margin-left: 8px;
}
.tuo_table{
    padding: 24px;
}
.text{
    margin-bottom: 24px;
}
</style>
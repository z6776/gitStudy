<template>
    <div class="call">
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
                <div class="search_item flex_start">
                    <div class="search_label">处理状态：</div>
                    <div class="select_width w-200px">
                        <el-select v-model="search_form.status" size="large" >
                            <el-option key="0" value="2" label="已处理"></el-option>
                            <el-option key="1" value="1" label="未处理"></el-option>
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
                <el-table-column prop="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID号" width="220" align="center"></el-table-column>
                <el-table-column prop="bind" label="处理状态" align="center">
                    <template #default="props">
                        <div v-if="props.row.status == 2" style="color:#07C160;" class="flex justify-center items-center">
                            <img class="w-18px h-18px" src="@/assets/images/call_icon_y.png">
                            已处理
                       </div>

                        <div v-else style="color:#E24040;"  class="flex justify-center items-center"> <img class="w-18px h-18px" src="@/assets/images/call_icon_n.png">未处理</div>
                    </template>
                </el-table-column>
                <el-table-column label="呼叫时间" align="center">
                    <template #default="props">
                        {{ props.row.alarm_time ? dateFtt('yyyy-mm-dd hh:MM:ss', new Date(props.row.alarm_time * 1000))
                            : "" }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="props">
                        <el-button type="primary" v-if="props.row.status == 1" @click="processing(props.row)"
                            plain>处理</el-button>
                        <el-button type="primary" v-if="props.row.status == 2" @click="processingRecord(props.row,)"
                            plain>处理日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
    <custom-dialog title="处理" append-to-body class="_loading" v-model="processingDialogVisible" :show-close="false"
        :width="`${(580 / 1920) * 100}%`" top="25vh">
        <div class="custom_form_box p-[24px_75px]">
            <div class="processing_title mb_16">处理内容：</div>
            <div class="flex_start mb_16">
                <div class="radio_item " @click="processingForm.type = '1'"
                    :class="{ active_radio_item: processingForm.type == '1' }">误触</div>
                <div class="radio_item " @click="processingForm.type = '2'"
                    :class="{ active_radio_item: processingForm.type == '2' }">突遇不适</div>
                <div class="radio_item " @click="processingForm.type = '3'"
                    :class="{ active_radio_item: processingForm.type == '3' }">换药拔针</div>
            </div>
            <el-input type="textarea" maxlength="200" show-word-limit style="width: 100%;"  
                placeholder="对处理情况做简单描述吧（非必填）" v-model="processingForm.remark" :rows="5"></el-input>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="processingDialogVisible = false">取消</el-button>
                <el-button size="large" type="primary" @click="submitProcessing()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog title="处理日志" append-to-body class="_loading" v-model="recordDialogVisible" :show-close="false"
        :width="`${(580 / 1920) * 100}%`" top="25vh">
        <div class="custom_form_box  p-[24px_75px]">
            <div class="processing_title mb_16">处理内容：</div>
            <div class="flex_start mb_16">
                <div class="radio_item active_radio_item" v-if="processingForm.type == '1'">误触</div>
                <div class="radio_item active_radio_item" v-if="processingForm.type == '2'">突遇不适</div>
                <div class="radio_item active_radio_item" v-if="processingForm.type == '3'">换药拔针</div>
            </div>

            <div class="record_remark">{{ processingForm.remark }}</div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="recordDialogVisible = false">关闭</el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import CallApi from '@/api/call';
import type { CallTableItem, Pagination } from '@/interface/interface';
import { onMounted, reactive, ref } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage } from 'element-plus';
import bus from '@/eventBus/eventBus';
import { useTopNums } from "@/stores/topNums";
const { jianTopNums }  = useTopNums();
// 搜索
const search_form = reactive<any>({
    name: "",
    ccid: "",
    status: ''
})
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()

}
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.name = ''
    search_form.ccid = ''
    search_form.status = ''
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

// 列表

const tableLoading = ref<boolean>(false)
let tableData = reactive<CallTableItem[]>([])
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        status: search_form.status,
        ccid: search_form.ccid,
        name: search_form.name,
    }
    const result = (await CallApi.getCallList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total;
        let _arr =  (result.data || []).map((item:any,index:number)=>{
            item.index = (index+1) + (pageQuery.page - 1) * pageQuery.perPage;
            return item;
        })
        tableData = _arr;
    }

}



// table按钮事件

// 处理
const processingDialogVisible = ref(false)
const processingForm = reactive({
    id: "",
    type: "",
    remark: ""
})
const processing = (item: any) => {
    processingForm.id = item.id
    processingForm.type = ''
    processingForm.remark = ''
    processingDialogVisible.value = true
}
const emit = defineEmits()
const submitProcessing = async () => {
    if (!processingForm.type) {
        ElMessage.error('请选择处理内容！')
        return
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = (await CallApi.processingCall(processingForm)).data.result
        if (result) {
            Formloading.close()
            processingDialogVisible.value = false
            ElMessage.success('处理成功')
            jianTopNums("sos_count");
            bus.emit('refreshData')
            fetchData()
        }
    } catch (error) {
        Formloading.close()
    }

}
// 处理日志
const recordDialogVisible = ref(false)
const processingRecord = (item: any) => {
    processingForm.type = ''
    processingForm.remark = ''
    recordDialogVisible.value = true
    setTimeout(async () => {
        const Formloading = ElLoading.service({
            target: '._loading'
        })
        try {
            const result = (await CallApi.processingCallLog({ id: item.id })).data.result
            if (result) {
                processingForm.type = result.type
                processingForm.remark = result.remark
                Formloading.close()
            }
        } catch (error) {
            Formloading.close()
        }
    }, 100);

}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.record_remark {
    font-size: 14px;
    color: #636676;
}

:deep(
.ep-textarea__inner){
    height: 100px;
}

.processing_title {
    color: #636676;
    font-size: 16px;
}

.mb_16 {
    margin-bottom: 16px;
}

.radio_item {
    margin-right: 12px;
    height: 24px;
    display: flex;
    align-items: center;
    /* 垂直居中 */
    font-size: 12px;
    border: 1px solid #929FAF;
    border-radius: 24px;
    color: #929FAF;
    padding: 0 8px;
    cursor: pointer;
}

.active_radio_item {
    border-color: #07C160;
    color: #07C160;
}

.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.call{
    padding: 24px;
}
</style>

<template>
    <div class="call">
        <div class="table_box">
            <el-table :data="tableData" border size="large" v-loading="tableLoading">
                <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="patient_num" label="住院号" align="center"></el-table-column>
                <el-table-column prop="title" label="问题标题" align="center"></el-table-column>
                <el-table-column prop="content" label="正文内容" align="center" width="300">
                    <template #default="props">
                        <div class="conetent_text" @click="openConetentDetail(props.row.content)">{{ props.row.content
                            }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="反馈时间" align="center"></el-table-column>

                <el-table-column prop="bind" label="处理状态" align="center">
                    <template #default="props">
                        <div v-if="props.row.type == 1"><span class="icon_status"
                                style="background-color: #07C160;"></span>已回复
                        </div>
                        <div v-else> <span class="icon_status" style="background-color: #E24040;"></span>待回复</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="props">
                        <el-button type="primary" v-if="props.row.type == 0" @click="processing(props.row)"
                            plain>回复</el-button>
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
        <div class="custom_form_box">
            <div class="processing_title mb_16">回复内容</div>
            <el-input type="textarea" maxlength="300" show-word-limit style="width: 100%;"
                placeholder="对处理情况做简单描述吧（非必填）" v-model="processingForm.zone_reply" :rows="5" ></el-input>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="processingDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitProcessing()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog title="正文内容" append-to-body class="_loading" v-model="showContent" :show-close="false"
        :width="`${(580 / 1920) * 100}%`" top="25vh">
        <div class="content_detail_box">
            {{ contentText }}
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="showContent = false">关闭</el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import CallApi from '@/api/call';
import FeedbackApi from '@/api/feedback';
import type { CallTableItem, Pagination } from '@/interface/interface';
import { onMounted, reactive, ref } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage } from 'element-plus';
import bus from '@/eventBus/eventBus';
// 搜索
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()

}
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
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
    }
    const result = (await FeedbackApi.getFeedbackList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }

}
const contentText = ref('')
const showContent = ref(false)
const openConetentDetail = (content: string) => {
    contentText.value = content
    showContent.value = true
}

// table按钮事件

// 处理
const processingDialogVisible = ref(false)
const processingForm = reactive({
    id: "",
    zone_reply: ""
})
const processing = (item: any) => {
    processingForm.id = item.id
    processingForm.zone_reply = ''
    processingDialogVisible.value = true
}
const emit = defineEmits()
const submitProcessing = async () => {
    if (!processingForm.zone_reply) {
        ElMessage.error('请填写回复内容！')
        return
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = (await FeedbackApi.handleFeedback(processingForm)).data.result
        if (result) {
            Formloading.close()
            processingDialogVisible.value = false
            ElMessage.success('回复成功')
            bus.emit('refreshData')
            fetchData()
        }
    } catch (error) {
        Formloading.close()
    }

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
.call{
    margin: 24px;
}

.processing_title {
    color: #636676;
    font-size: 16px;
    position: relative;
    padding-left: 16px;
}

.processing_title::before {
    content: '*';
    color: red;
    position: absolute;
    left: 0px;
    top: 4px;
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

.icon_status {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    margin-right: 4px;
    /* margin-top: 2px; */
    transform: translateY(1px)
}

.content_detail_box {
    padding: 24px 152px;
}

.conetent_text {
    width: 100%;
    cursor: pointer;
    color: #0076F6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}
</style>

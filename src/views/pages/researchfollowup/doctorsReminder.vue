<template>
    <header class="header">

    </header>
    <div class="doctorNote">
        <div class="search_box flex_space_between">
            <div class="flex_start">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">住院号：</div>
                    <div> <el-input size="large" v-model="search_form.patient_num" placeholder="请输入"></el-input></div>
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
                <el-button type="success" size="large" @click="noteQuery">下发提醒</el-button>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
                <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="patient_num" label="住院号" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                <el-table-column prop="content" label="提醒内容"  align="center">
                    <template #default="props">
                        <div class="text_btn">
                            <div type="primary" @click="changeDailog(props.row)" link>
                                {{
                            textContent(props.row.content) }}</div>
                        </div>
                     
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="提醒时间" align="center"></el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <custom-dialog v-model="bindDailogVisible" append-to-body class="_loading" title="下发提醒" :show-close="false"
            :width="`${(750 / 1920) * 100}%`" top="25vh">
            <div class="patient_form_box">
                <el-form :model="noteForm" :rules="noteFormRules" label-width="auto" ref='patientFormRef'
                    label-position="right">
                    <el-row>
                        <el-col :span="12">
                            <div class="note_form_box">
                                <div class="note_form_title">选择提醒人员</div>
                                <div class="note_form_conent" style="align-items: start;">
                                    <el-form-item label="" prop="start">
                                        <el-input class="patient_input_width inp" v-model="filterText" maxlength="18"
                                            type="text" :prefix-icon="Search" placeholder="请输入姓名和住院号"></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item label="" prop="start"> -->
                                    <el-tree ref="treeRef" @check="treeChange" :data="treeData" v-loading="noteLoading"
                                        node-key="id" :props="defaultProps" default-expand-all
                                        :filter-node-method="filterNode"
                                        :default-expanded-keys="[0]" show-checkbox />
                                    <!-- </el-form-item> -->
                                </div>
                            </div>

                        </el-col>

                        <el-col :span="12">
                            <div class="note_form_box">
                                <div class="note_form_title">提醒内容</div>
                                <div class="note_form_conent">
                                    <el-form-item label="" prop="id_card">
                                        <el-input class="textarea_text"
                                            type="textarea"  v-model="content"   show-word-limit :maxlength="300" placeholder="请输入要提醒的内容"></el-input>
                                    </el-form-item>
                                </div>

                            </div>

                        </el-col>
                    </el-row>
                </el-form>

            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button size="large" type="success" @click="noteAdd">
                        下发
                    </el-button>
                    <el-button size="large" type="info" @click="bindDailogVisible = false">取消</el-button>
                </div>
            </template>
        </custom-dialog>


        <custom-dialog v-model="dialogVisible" append-to-body class="_loading" title="医生提醒" :show-close="false"
        :width="`${(612 / 1920) * 100}%`" top="25vh">
            <div class="_tips">{{dialogText}}</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="dialogVisible = false">确认</el-button>
            </div>
        </template>
    </custom-dialog>
    </div>

</template>

<script setup lang='ts'>
import DoctorNoteApi from '@/api/doctorNote';
import type { WearTableItem, CallTableItem, Pagination, PatientTableItem, treeDataItem } from '@/interface/interface';
import { onMounted, reactive, ref, computed, watch } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage, ElTree, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import type { Action } from 'element-plus'
import bus from '@/eventBus/eventBus';
import { Calendar, Search } from '@element-plus/icons-vue'
interface Tree {
    id: number
    name: string
    patient_num: string
    children?: Tree[]
}
// 搜索
const search_form = reactive({
    name: "",
    ccid: "",
    patient_num:''
})

const noteForm = reactive({
    text: '',
    ids: '',
})

const noteFormRules = reactive<FormRules>({
    text: [{ required: true, message: "请输入提醒内容", trigger: 'blur' }],
    ids: [{ required: true, message: "请输入提醒内容", trigger: 'blur' }],
})

const dialogVisible = ref<boolean>(false);
const dialogText = ref<string>('');
const bindDailogVisible = ref<boolean>(false);
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

// 新增下发提醒
const content = ref<string>(''); //提醒内容
const patient_id = ref<string>(''); // 患者id逗号分割
const defaultProps = {
    children: 'children',
    label: 'name',
    disabled: 'disabled',
}
let treeData: Tree[] = [
    {
        id: 0,
        name: '全部',
        patient_num: '1',
        children: [
        ],
    },
]

const noteLoading = ref<boolean>(false)
const noteData = async () => {
    noteLoading.value = true
    let data = {};
    const result = (await DoctorNoteApi.getPatient(data)).data.result;
    if (result) {
        noteLoading.value = false;
        //拼接住院号
        let _result = result.filter((res: { name: string; patient_num: string }) => {
            res.name = res.patient_num ? `${res.name}(${res.patient_num})` : res.name
            return res
        })
        let _treeData = [{
            id: 0,
            name: '全部',
            patient_num: '1',
            children: _result,
        },]
        treeData = _treeData
    }
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
watch(filterText, (val) => {
    treeRef.value!.filter(val)
})

const filterNode = (value: any, data: any) => {
    if (!value) return true
    return data.name.includes(value)
}

const noteQuery = () => {
    content.value = ''
    bindDailogVisible.value = true;
    noteData();
}

const treeChange = (item: object, items: { checkedKeys: any }) => {
    // patient_id.value = items.checkedKeys.join(',')
}

const noteAdd = async () => {
    patient_id.value = treeRef.value!.getCheckedKeys(false).join(',');
    let data = {
        patient_id: patient_id.value,
        content: content.value
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = (await DoctorNoteApi.postPatientadd(data)).data.result;
        if (result) {
            Formloading.close()
            ElMessage.success('操作成功')
            bindDailogVisible.value = false;
            fetchData()
        }
    } catch (error) {
        Formloading.close()
        bindDailogVisible.value = false;
    }

}

const textContent = computed(() => {
    return (itemText: string) => {
        if (itemText.length <= 30) {
            return itemText
        } else {

            return itemText.substring(0, 30) + '...';
        }
    }
})

// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 10,
    total: 0
})

const changeDailog = (item: PatientTableItem) => {
    dialogVisible.value = true;
    dialogText.value = item.content;
}

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
        patient_num:search_form.patient_num
    }
    const result = (await DoctorNoteApi.getDoctorNoteList(data)).data.result;

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
.patientjournal {
    height: 90px;
    width: 100%;
    background-color: #fff;
}

.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}

.doctorNote{
    width:97%;
    margin:0 auto;
}

.flex_r {
    font-size: 20px;
    display: flex;
    margin-right: 40px;

}

.patient_form_box {
    padding: 20px 40px;
}

.patient_form_title {
    position: relative;
    font-size: 16px;
    color: #384951;
    padding-left: 10px;
    font-weight: bold;
    margin-bottom: 20px;
}

.patient_form_title::before {
    content: "";
    width: 3px;
    height: 16px;
    background-color: #07C160;
    position: absolute;
    left: 0;
    border-radius: 3px;
    top: 3px;
}

.textarea_text {
    /* height: 300px; */
    width: 100%;
}

.note_form_box {
    width: 300px;
    height: 360px;
    border: 1px solid #F5F7FB;
    margin-top: 44px;
    margin-bottom: 20px;
}

.note_form_title {
    width: 300px;
    height: 40px;
    background: #F5F7FB;
    border-radius: 0px 0px 0px 0px;
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: 400;
    font-size: 16px;
    color: #636676;
    line-height: 16px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    line-height: 40px;
}

.note_form_conent {
    height: 320px;
    overflow: auto;
}

.inp {
    margin: auto;
    width: 252px !important;
    height: 40px;
    margin-top: 12px;
}
._dailog{
    text-align: center;
}

:deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px;
    height: 320px;
}

:deep(.el-textarea__inner:hover) {
    box-shadow: 0 0 0 0px;
    height: 320px;
}

:deep(.el-textarea__inner:focus) {
    box-shadow: 0 0 0 0px;
    height: 320px;
}

._tips{
    text-align: center;
    padding: 27px 34px;
    font-size: 18px;
    color: #636676;
}
.text_btn{
    box-sizing: border-box;
    color: #0076F6;
    cursor: pointer;
}
</style>
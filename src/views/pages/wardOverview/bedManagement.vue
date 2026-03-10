<template>
      <header class="header">
        <div class="add_btn_box">
                <el-button type="success" size="large" @click="addBed">
                    <img src="@/assets/images/bed_add_icon.png" class="btn_icon">创建床位</el-button>
            </div>

      </header>
    <div class="bed">
        <div class="search_box flex_space_between">
            <div class="flex_start">
                <div class="search_item flex_start">
                    <div class="search_label">住院状态：</div>
                    <el-radio-group
                        style="--el-button-text-color:#07C160;--el-color-primary:#07C160;--el-border:0.0125rem solid #07C160;"
                        v-model="search_form.use" fill="#07C160" size="large" @change="search">
                        <el-radio-button label="未使用" :value="1" />
                        <el-radio-button label="使用中" :value="2" />
                        <el-radio-button label="全部" :value="0" />
                    </el-radio-group>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">床位号：</div>
                    <div> <el-input size="large" v-model="search_form.bed_number" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_btn_box">
                    <el-button type="success" size="large" @click="search">查询</el-button>
                    <el-button type="warning" size="large" @click="reset">重置</el-button>
                </div>
            </div>
            
        </div>

        <div class="table_box">
            
            <!-- <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
                <el-table-column prop="use" label="床位状态" align="center">
                    <template #default="props">
                        <span v-if="props.row.use == 2" style="color:#07C160;">使用中</span>
                        <span v-else style="color:#9296AF;">未使用</span>
                    </template>
</el-table-column>
<el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
<el-table-column prop="room_number" label="房间号" align="center"></el-table-column>
<el-table-column prop="remark" label="备注说明" align="center"></el-table-column>
<el-table-column prop="name" label="所住患者姓名" align="center"></el-table-column>
<el-table-column prop="birthday" label="年龄" align="center">
    <template #default="props">
                        {{ props.row.birthday ?
                            ((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 < 365 ? Math.floor
                                ((new Date().getTime() - new Date(props.row.birthday).getTime()) / 86400000) + '天' :
                                Math.floor(((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 /
                                    365) + '周岁' : "" }} </template>
</el-table-column>
<el-table-column prop="create_time" label="创建时间" align="center">
    <template #default="props">
                        {{ dateFtt('yyyy-mm-dd hh:MM:ss', props.row.create_time * 1000) }}
                    </template>
</el-table-column>
<el-table-column label="操作" align="center">
    <template #default="props">
                        <el-button type="primary" @click="editBed(props.row)" plain>编辑</el-button>
                        <el-button type="danger" v-if="props.row.use == 1" @click="deleteBed(props.row)"
                            plain>删除</el-button>
                    </template>
</el-table-column>
</el-table> -->
            <div class="data_list" v-loading="tableLoading">
                <div class="table_item" v-for="(item, index) in tableData" :key="item.id" >
                    <div class="item_head">
                        <div class="item_bed_number">{{ item.bed_number }}床</div>
                        <div class="item_head_btn_box">
                            <el-button type="success" size='default' @click="bedManage(item)">床位管理</el-button>
                            <el-button type="primary" size='default' @click="deviceManage(item)"
                                v-if="item.use == 2">设备管理</el-button>
                        </div>
                    </div>
                    <div class="item_content" @click="handleBedDetail(item)">
                        <div v-if="item.use == 2">
                            <div class='flex_space_between mb_24'>
                                <div class="flex_start " style="align-items: end;">
                                    <div class="name">{{ item.name }}</div>
                                    <div class="age">{{ computedAge(item.birthday) }} </div>
                                    <div class="room_number" v-if="item.room_number">{{ item.room_number }}号房</div>
                                </div>
                                <div class="flex_start">
                                    <div class="level_of_care" v-if="item.level_of_care">{{ item.level_of_care ?
                                        level_of_cares[item.level_of_care - 1] : "" }}</div>
                                    <div class="situation green" v-if="item.situation == 3">重</div>
                                    <div class="situation red" v-if="item.situation == 2">危</div>
                                </div>
                            </div>
                            <div class="flex_start content_text mb_12">
                                <img src="@/assets/images/bed_device_icon.png" alt="">
                                <div>佩戴设备:</div>
                                <div>{{ item.ccid ? item.ccid : "--" }}</div>
                            </div>
                            <div class="flex_start content_text mb_24">
                                <img src="@/assets/images/bed_date_icon.png" alt="">
                                <div>入院时间:</div>
                                <div>{{ item.start }}</div>
                            </div>

                        </div>
                        <div v-else class="no_use_bed">
                            空闲中，可安人员入住~
                        </div>
                        <div class="remark_text flex_end" v-if="item.remark" @click.stop="showRemarkDetail(item.remark)">
                            <img src="@/assets/images/bed_remark_icon.png" alt="">
                            <div>备注说明</div>
                        </div>
                    </div>
                </div>
            </div>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[8, 12, 16]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
    <custom-dialog v-model="dialogVisible" append-to-body class="_loading" :title="dialogTitle" :show-close="false"
        :width="`${(612 / 1920) * 100}%`" top="25vh">
        <div class="form_box">
            <el-form :model="bedForm" :rules="bedFormRules" label-width="auto" ref='bedFormRef' label-position="right">
                <el-form-item label="床位号" prop="bed_number">
                    <el-input maxlength="10" :disabled="editBedItem.item.use === 2" type="text"
                        v-model="bedForm.bed_number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="序号" prop="num">
                    <el-input oninput="if(value.length>10)value=value.slice(0,10)"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"
                        v-model="bedForm.num" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="房间号" prop="room_number">
                    <el-input oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                        :disabled="editBedItem.item.use === 2" v-model="bedForm.room_number"
                        placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input maxlength="300" :rows="4" type="textarea" show-word-limit v-model="bedForm.remark"
                        placeholder="对床位信息进行补充"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="dialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitForm()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog v-model="remarkDialogVisible" title="备注说明" :width="`${(612 / 1920) * 100}%`" top="25vh"
        :show-close="false">
        <div class="remark_content">{{ remarkContent }}</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="remarkDialogVisible = false">关闭</el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog v-model="bedManageDialogVisible" title="床位管理" class="show_close" :width="`${(612 / 1920) * 100}%`"
        top="25vh">
        <div class="bed_dialog_btn_content flex_space_around">
            <div class="bed_btn_box bed_success_btn" @click="editBed">
                <img src="@/assets/images/bed_edit_icon.png" alt="">
                <div>编辑床位</div>
            </div>
            <div class="bed_btn_box bed_danger_btn" @click="unBindPatient"
                v-if="handelTableListItem.use == 2 && !handelTableListItem.ccid">
                <img src="@/assets/images/bed_unbind_icon.png" alt="">
                <div>人员解绑床位</div>
            </div>
            <div class="bed_btn_box bed_danger_btn" v-if="handelTableListItem.use == 1" @click="deleteBed">
                <img src="@/assets/images/bed_delete_icon.png" alt="">
                <div>删除床位</div>
            </div>
        </div>
    </custom-dialog>
    <custom-dialog v-model="deviceManageDialogVisible" title="设备管理" class="show_close" :width="`${(612 / 1920) * 100}%`"
        top="25vh">
        <div class="bed_dialog_btn_content flex_space_around">
            <div class="bed_btn_box bed_primary_btn" v-if="!handelTableListItem.ccid" @click="openBindDialog">
                <img src="@/assets/images/bed_device_bind_icon.png">
                <div>分配设备</div>
            </div>
            <div class="bed_btn_box bed_primary_btn" v-if="handelTableListItem.ccid" @click="openChangeDeviceDialog">
                <img src="@/assets/images/bed_device_change_icon.png">
                <div>更换设备</div>
            </div>
            <div class="bed_btn_box bed_danger_btn" v-if="handelTableListItem.ccid" @click="unbindCcid">
                <img src="@/assets/images/bed_device_unbind_icon.png" alt="">
                <div>解绑设备</div>
            </div>
        </div>
    </custom-dialog>
    <custom-dialog v-model="bindDailogVisible" append-to-body class="_loading" title="绑定设备" :show-close="false"
        :width="`${(600 / 1920) * 100}%`" top="25vh">
        <div>
            <div class="bind_head">未分配设备</div>
            <div class="ccid_list" v-loading="unbindTableLoading">
                <div class="ccid_item" v-for="item in unBindCcidList.list" @click="setCcidRadioChoose(item.ccid)">
                    <el-radio :value="item.ccid" v-model="chooseBindCcid" name="bindCcid"></el-radio>
                    {{ item.ccid }}
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="bindDailogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitBind()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog v-model="changeDailogVisible" append-to-body class="_loading" title="更换设备" :show-close="false"
        :width="`${(734 / 1920) * 100}%`" top="15vh">
        <div class="flex_space_between change_device_box">
            <div class="change_left">
                <div class="bind_head">当前设备</div>
                <div class="change_ccid_list">
                    <div class="change_ccid_item">{{ changePatinet.old_ccid }}</div>
                </div>
            </div>
            <div class="change_icon">
                <img src="@/assets/images/patient_change_icon.png">
            </div>
            <div class="change_right">
                <div class="bind_head">更换设备</div>
                <div class="change_ccid_list" v-loading="unbindTableLoading">
                    <div class="change_ccid_item" v-for="item in unBindCcidList.list"
                        @click="setChangeCcidRadioChoose(item.ccid)">
                        <el-radio :value="item.ccid" v-model="changePatinet.ccid" name="changeCcid"></el-radio>
                        {{ item.ccid }}
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="changeDailogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitChange()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>

     <transition name="slide" mode="out-in">
            <div class="bed_detail" v-if='showDetail'>
                <BedDetail :bed-item="handleBedItem" @close="closeDetail" @reloadBedList='fetchData'></BedDetail>
            </div>
        </transition>



</template>

<script setup lang='ts'>
import BedDetail from '@/components/BedDetail.vue'
import BedApi from '@/api/bed';
import { type Pagination, type BedTableItem, type BedForm, type BedTableQueryData } from '@/interface/interface';
import { onMounted, reactive, ref } from 'vue';
import { ElLoading, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import PatientApi from '@/api/patient';


// 床位item点击
const handleBedItem = ref<any>({})
const showDetail = ref(false)
const handleBedDetail = (item: any) => {
    if (item.use == 2) {
        handleBedItem.value = item
        showDetail.value = true
    }
}
const closeDetail = () => {
    handleBedItem.value = {}
    showDetail.value = false
}

// 搜索
const search_form = reactive({
    use: 0,
    bed_number: "",
    name: ""
})
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 8
    fetchData()
}
const reset = () => {
    search_form.use = 0
    search_form.bed_number = ''
    search_form.name = ''
    pageQuery.page = 1
    pageQuery.perPage = 8
    fetchData()
}
// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 8,
    total: 0
})
const level_of_cares = ['一', '二', '三', '特']
const handleSizeChange = (val: number) => {
    pageQuery.perPage = val
    pageQuery.page = 1
    fetchData()
}
const handleCurrentChange = (val: number) => {
    pageQuery.page = val
    fetchData()
}
// 列表
const tableLoading = ref<boolean>(false)
let tableData = reactive<BedTableItem[]>([])
const fetchData = async () => {
    tableLoading.value = true
    let data: BedTableQueryData = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        bed_number: search_form.bed_number,
        use: search_form.use,
        name: search_form.name,
    }
    data.use === 0 && (delete data.use)
    // data.bed_number === '' && (delete data.bed_number)
    // data.name === '' && (delete data.name)
    const result = (await BedApi.getBedList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }

}
// 表单（新增/编辑） 
const bedForm = reactive<BedForm>({
    bed_number: "",
    room_number: "",
    remark: "",
    num: ""
})
const editBedItem = reactive<any>({
    item: {}
})
const dialogTitle = ref('')
const dialogVisible = ref<boolean>(false)
const bedFormRef = ref<FormInstance>()

const checkNum = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('请输入从1开始的整数'))
        } else {
            if (value == 0) {
                callback(new Error('请输入从1开始的整数'))
            } else {
                callback()
            }
        }
    }, 200)
}
const bedFormRules = reactive<FormRules<typeof bedForm>>({
    bed_number: [
        { required: true, message: "请输入床位号", trigger: 'blur' }
    ],
    num: [
        { required: true, message: "请输入序号", trigger: 'blur' },
        { validator: checkNum, trigger: 'blur' }
    ],
    remark: [{ required: false }],
})
const editBed = () => {
    bedForm.id = handelTableListItem.value.id
    bedManageDialogVisible.value = false
    for (const key in bedForm) {
        if (Object.prototype.hasOwnProperty.call(bedForm, key)) {
            bedForm[key] = handelTableListItem.value[key]
        }
    }
    editBedItem.item = handelTableListItem.value
    dialogTitle.value = '编辑床位'
    dialogVisible.value = true
    bedFormRef.value?.clearValidate()
}
const addBed = () => {
    bedForm.id && delete bedForm.id
    for (const key in bedForm) {
        if (Object.prototype.hasOwnProperty.call(bedForm, key)) {
            bedForm[key] = ''
        }
    }
    editBedItem.item = {}
    dialogTitle.value = '新增床位'
    dialogVisible.value = true
    bedFormRef.value?.clearValidate()
}
const unBindPatient = () => {
    ElMessageBox.confirm(
        `确定要将床位${handelTableListItem.value.bed_number}与人员解绑吗?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            confirmButtonClass: "delete_btn",
        }
    )
        .then(async () => {
            let data = {
                id: handelTableListItem.value.patient_id,
                bed_id: '',
                old_bed_id: handelTableListItem.value.id,
            }
            try {
                const result = await PatientApi.editPatientBed(data)
                if (result) {
                    ElMessage.success('操作成功')

                    bedManageDialogVisible.value = false
                    fetchData()
                }
            } catch (error) {
                bedManageDialogVisible.value = false
            }
            // const result = await BedApi.deleteBed({ id: handelTableListItem.value.id })
            // if (result) {
            //     bedManageDialogVisible.value = false
            //     ElMessage({
            //         type: 'success',
            //         message: '解绑成功',
            //     })
            //     fetchData()
            // }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
}
const deleteBed = () => {
    ElMessageBox.confirm(
        `确定要删除床位${handelTableListItem.value.bed_number}吗，删除后不可恢复?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            confirmButtonClass: "delete_btn",
        }
    )
        .then(async () => {
            const result = await BedApi.deleteBed({ id: handelTableListItem.value.id })
            if (result) {
                bedManageDialogVisible.value = false
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                fetchData()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
}
const submitForm = () => {
    const formEl = bedFormRef.value //elform实例
    if (!formEl) return
    formEl.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let data = Object.assign({}, bedForm)
            try {
                const result = await BedApi.editBed(data)
                if (result) {
                    Formloading.close()
                    ElMessage.success('操作成功')
                    dialogVisible.value = false
                    reset()
                }
            } catch (error) {
                Formloading.close()
            }

        }
    })
}
// 计算年龄
const computedAge = (birthday: string) => {
    return birthday ?
        ((new Date().getTime() - new Date(birthday).getTime())) / 86400000 < 365 ?
            Math.floor((new Date().getTime() - new Date(birthday).getTime()) /
                86400000) + '天' : Math.floor(((new Date().getTime() - new
                    Date(birthday).getTime())) / 86400000 / 365) + '岁' : ""
}
// 备注说明
const remarkContent = ref('')
const remarkDialogVisible = ref(false)
const showRemarkDetail = (remark: string) => {
    remarkContent.value = remark
    remarkDialogVisible.value = true
}
// 床位管理
const bedManageDialogVisible = ref(false)
const handelTableListItem = ref<any>(tableData[0])
const bedManage = (item: BedTableItem) => {
    bedManageDialogVisible.value = true
    handelTableListItem.value = item
}
// 设备管理
const deviceManageDialogVisible = ref(false)
const deviceManage = (item: BedTableItem) => {
    deviceManageDialogVisible.value = true
    handelTableListItem.value = item
}

// 解绑设备
const unbindCcid = () => {
    ElMessageBox.confirm(
        `是否将设备${handelTableListItem.value.ccid}与该人员进行解绑？`,
        '解绑设备',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            confirmButtonClass: "delete_btn",
        }
    )
        .then(async () => {
            let data = { ccid: handelTableListItem.value.ccid, bind: 2, patient_id: handelTableListItem.value.patient_id }
            const result = await PatientApi.editBedDevice(data)
            if (result) {
                ElMessage({
                    type: 'success',
                    message: '解绑成功',
                })
                deviceManageDialogVisible.value = false
                fetchData()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
}
// 分配设备
let unBindCcidList = reactive<any>({
    list: []
})
const unbindTableLoading = ref(false)
const fetchUnBindCcidList = async () => {
    unbindTableLoading.value = true
    unBindCcidList.list = (await PatientApi.getUnBindCcidList({ bind: 2 })).data.result
    if (unBindCcidList.list) {
        unbindTableLoading.value = false
    }

}
const bindDailogVisible = ref(false)
const bindPatient = reactive({
    ccid: "",
    patient_id: 0
})
const openBindDialog = () => {
    bindPatient.ccid = handelTableListItem.value.ccid
    bindPatient.patient_id = handelTableListItem.value.patient_id
    fetchUnBindCcidList()
    chooseBindCcid.value = ''
    bindDailogVisible.value = true
    deviceManageDialogVisible.value = false
}
const chooseBindCcid = ref('')

const setCcidRadioChoose = (ccid: string) => {
    chooseBindCcid.value = ccid
}
const submitBind = async () => {
    if (!chooseBindCcid.value) {
        ElMessage.error('请先选择设备')
        return
    }

    let data = {
        ccid: chooseBindCcid.value,
        bind: 1,
        patient_id: bindPatient.patient_id
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await PatientApi.editBedDevice(data)
        if (result) {
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            bindDailogVisible.value = false
            Formloading.close()
            fetchData()
        }
    } catch (error) {
        Formloading.close()
    }
}


// 更换设备
const changeDailogVisible = ref(false)
const changePatinet = reactive({
    patient_id: 0,
    old_ccid: "",
    ccid: ""
})
const openChangeDeviceDialog = () => {
    changePatinet.patient_id = handelTableListItem.value.patient_id
    changePatinet.old_ccid = handelTableListItem.value.ccid
    changePatinet.ccid = ''
    fetchUnBindCcidList()
    changeDailogVisible.value = true
    deviceManageDialogVisible.value = false
}
const setChangeCcidRadioChoose = (ccid: string) => {
    changePatinet.ccid = ccid
}
const submitChange = async () => {
    if (!changePatinet.ccid) {
        ElMessage.error('请先选择设备')
        return
    }
    let data = {
        ccid: changePatinet.ccid,
        id: changePatinet.patient_id,
        old_ccid: changePatinet.old_ccid
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await PatientApi.changePatientDevice(data)
        if (result) {
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            Formloading.close()
            changeDailogVisible.value = false
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
.bed_detail {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #F5F7FB;
    z-index: 999;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform .3s linear;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(100%);
}

.data_list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 24px;
    min-height: 200px;
}

.table_item {
    background: linear-gradient(to right, #EBFAF3, #FFFFFF);
    border-radius: 8px;
    overflow: hidden;
}

.item_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 19px 24px;
    font-size: 22px;
    font-weight: bold;
    color: #384951;
}

.item_content {
    background-color: #FFFFFF;
    padding: 24px 24px 32px;
    height: 180px;
    position: relative;
}

.no_use_bed {
    color: #636676;
    text-align: center;
    font-size: 16px;
    line-height: 139px;
    /* margin-bottom: 22px; */
}

.name {
    font-weight: bold;
    margin-right: 12px;
    font-size: 24px;
    color: #07C160;
}

.age,
.room_number {
    font-size: 16px;
    color: #929FAF;
    margin-right: 12px;
    /* vertical-align: bottom; */
    padding-bottom: 2px;
}

.content_text {
    font-size: 16px;
    color: #636676;
}

.mb_24 {
    margin-bottom: 20px;
}

.mb_12 {
    margin-bottom: 12px;
}

.content_text img {
    width: 24px;
    margin-right: 12px;
}

.remark_text {
    font-size: 14px;
    color: #07C160;
    text-align: right;
    cursor: pointer;
    position: absolute;
    right: 24px;
    bottom: 16px;
}

.remark_text img {
    width: 20px;
    margin-right: 5px;
}

.remark_content {
    padding: 48px 0;
    text-align: center;
    font-size: 16px;
    color: #636676;
}

.bed_dialog_btn_content {
    padding: 60px 130px;
}

.bed_btn_box {
    width: 150px;
    padding: 24px 0;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
}

.bed_btn_box img {
    width: 40px;
    margin: 0 auto;
    margin-bottom: 8px;

}

.bed_btn_box div {
    font-size: 16px;
    font-weight: 400;
}

.bed_success_btn {
    color: #07C160;
    background-color: #EBFAF3;
}

.bed_danger_btn {
    color: #E24040;
    background-color: #FDF0F0;
}

.bed_primary_btn {
    color: #0076F6;
    background-color: #EBF4FF;
}


.bind_head {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #F5F7FB;
    border-top: 1px solid #e3e3e3;
}

.ccid_list {
    max-height: 250px;
    min-height: 40px;
    overflow-y: scroll;
}

.ccid_list::-webkit-scrollbar,
.change_ccid_list::-webkit-scrollbar {
    width: 4px !important;
}

.ccid_list::-webkit-scrollbar-track,
.change_ccid_list::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* 设置轨道的背景颜色 */
}

.ccid_list::-webkit-scrollbar-thumb,
.change_ccid_list::-webkit-scrollbar-thumb {
    background: #c3c3c3;
    /* 设置轨道的背景颜色 */
    border-radius: 5px;
}

.ccid_item {
    height: 44px;
    line-height: 44px;
    background: #FFFFFF;
    border-top: 1px solid #F5F7FB;
    padding: 0 20px;
    cursor: pointer;
}

.change_device_box {
    padding: 64px 48px;
}

.change_left,
.change_right {
    width: 240px;
    text-align: center;
}

.change_left .bind_head,
.change_right .bind_head {
    border: none;
}

.change_ccid_list {
    height: 260px;
    overflow-y: auto;
}

.change_ccid_item {
    height: 44px;
    line-height: 44px;
    border: 1px solid #F5F7FB;
    border-top: none;
    cursor: pointer;
}
.change_icon img {
    width: 66px;
}
.device_data_title {
    height: 24px;
    font-weight: bold;
    font-size: 16px;
    color: #384951;
    line-height: 24px;
    margin-bottom: 10px;
}

.level_of_care {
    width: 28px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    background-color: #6377F5;
    border-radius: 4px;
    color: #fff;
}

.situation {
    width: 28px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    margin-left: 12px;
}

.green {
    background-color: #00B528;
}

.red {
    background-color: #F7413D;
}
.header{
    height: 86px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
}
.bed{
    padding: 20px;
}
</style>

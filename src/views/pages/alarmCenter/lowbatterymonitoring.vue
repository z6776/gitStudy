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
                <!-- <div class='search_tips'>注：通过关注久乐健康服务号，登录胸外科专项后，可以实时收到设备低电量的提醒通知。</div> -->
            </div>
        </div>
        <div class="table_box">
            <el-table :data="tableData" border size="large" v-loading="tableLoading" class="tableshadow">
                <el-table-column label="序号" align="center">
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
                <el-table-column prop="bat" label="电量" align="center">
                    <template #default="props">
                        {{ props.row.bat ? props.row.bat + '%' : "" }}
                    </template>
                </el-table-column>
                <el-table-column label="电量同步时间" align="center" width="220">
                    <template #default="props">
                        {{ props.row.insert_time ? dateFtt('yyyy-mm-dd hh:MM:ss', new Date(props.row.insert_time *
                            1000))
                            : "" }}
                    </template>
                </el-table-column>
                <el-table-column prop="bat" label="操作" align="center">
                    <template #default="props">
                        <!-- editStatus(props.row) -->
                        <el-button type="success" @click="openChangeDeviceDialog(props.row)" plain>更换设备</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>

      <custom-dialog v-model="changeDailogVisible" append-to-body class="_loading" title="更换设备" :show-close="false"
        :width="`${(734 / 1920) * 100}%`" top="25vh">
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
</template>

<script setup lang='ts'>
import BatApi from '@/api/bat';
import bus from '@/eventBus/eventBus';
import type { BatTableItem, Pagination } from '@/interface/interface';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import PatientApi from '@/api/patient';
import { ElLoading } from 'element-plus';
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
let tableData = reactive<BatTableItem[]>([])
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        name: search_form.name,
        ccid: search_form.ccid,
    }
    const result = (await BatApi.getBatList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }

}
const editStatus = (item: BatTableItem) => {
    ElMessageBox.confirm(
        `已为${item.ccid}进行充电？`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            confirmButtonClass: "delete_btn",
        }
    )
        .then(async () => {
            const result = await BatApi.editBatStatus({ ccid: item.ccid })
            if (result) {
                ElMessage({
                    type: 'success',
                    message: '操作成功',
                })
                bus.emit('refreshData')
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


//绑定设备
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

// 更换设备
const changeDailogVisible = ref(false)
const changePatinet = reactive({
    patient_id: '',
    old_ccid: "",
    ccid: ""
})
const openChangeDeviceDialog = (item: any) => {
    changePatinet.patient_id = item.id
    changePatinet.old_ccid = item.ccid
    changePatinet.ccid = ''
    fetchUnBindCcidList()
    changeDailogVisible.value = true
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

.change_device_box {
    padding: 64px 48px;
}
.range_text {
    font-size: 12px;
    margin: 0 8px;
    font-weight: 500;
    color: #929FAF;
}
.search_tips {
    color:red;
    font-size:16px;
    margin-left:20px;
}
.body{
    padding: 24px;
}
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
</style>

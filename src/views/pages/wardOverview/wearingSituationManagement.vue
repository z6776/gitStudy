<template>

    <div class="wearManage">
         <div class="flex">
        <div class="peibox">
            <div class="search_box bg-[#fff]  mr-20px w-273px flex">
                <img src="@/assets/images/V2/watchpd.png" class="w-48px h-48px" alt="" srcset="">
                <div class="text-[16px] line-height-[16px] ">
                        今日佩戴总人数：                    
                </div>
                      
                <div class="peibox_item_rigth flex items-end gap-5px">
                    <div class="color-[#384951] text-[24px] line-height-[24px] font-bold">
                       {{ wearPeiItem.wear_total || "--"}}
                    </div>
                    <div class="text-14px color-[#384951] line-height-[14px]">
                        人
                    </div>
                </div>
            </div>
            <div class="search_box bg-[#fff] mr-20px">
                  <img src="@/assets/images/V2/totalpd.png" class="w-48px h-48px" alt="" srcset="">
                <div class="peibox_item_left">
                    <div class="color-[#636676] text-[16px] line-height-[16px]">
                        今日佩戴率：
                    </div>
                </div>
                <div class="peibox_item_rigth flex items-end gap-5px">
                    <div class="color-[#384951] text-[24px] line-height-[24px] font-bold">
                        {{ wearPeiItem.wear_percentage || "--" }}
                    </div>
                    <div class="text-14px color-[#384951] line-height-[14px]">
                         %
                    </div>
                </div>
            </div>
        </div>
        <div class="search_box flex_space_between bg-#fff mb-20px flex-1">
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
        </div>
        </div>
        <!-- <div class="peibox">
            <div class="peibox_item">
                <div class="peibox_item_left">
                    <div class="peibox_item_left_h1">
                        今日佩戴总人数
                    </div>
                    <div class="peibox_item_left_h2">
                        {{ wearPeiItem.data}}
                    </div>
                </div>
                <div class="peibox_item_rigth">
                    <div class="peibox_item_rigth_num">
                        {{ wearPeiItem.wear_total }}
                    </div>
                    <div class="peibox_item_rigth_unit">
                        人
                    </div>
                </div>
            </div>
            <div class="peibox_item">
                <div class="peibox_item_left">
                    <div class="peibox_item_left_h1">
                        今日佩戴率
                    </div>
                    <div class="peibox_item_left_h2">
                        {{ wearPeiItem.data}}
                    </div>
                </div>
                <div class="peibox_item_rigth">
                    <div class="peibox_item_rigth_num">
                        {{ wearPeiItem.wear_percentage }}
                    </div>
                    <div class="peibox_item_rigth_unit">
                         %
                    </div>
                </div>
            </div>
        </div>
        <div class="search_box flex_space_between bg-#fff mb-20px">
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
        </div> -->

        <div class="table_box">
            <el-table :data="tableData" border size="large" v-loading="tableLoading" class="rounded-12px">
                <el-table-column prop="patient_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                <el-table-column prop="wear_date" label="佩戴天数" align="center"></el-table-column>
                <el-table-column prop="wear_hour" label="平均每天佩戴时长(h)" align="center"></el-table-column>
                <el-table-column prop="wear_percentage" label="佩戴率" align="center"></el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
    
</template>

<script setup lang='ts'>
import WearManage from '@/api/wearManage';
import type { WearTableItem,WearPeiItem,CallTableItem, Pagination, Timer } from '@/interface/interface';
import { onMounted, reactive, ref, onUnmounted } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import { ElLoading, ElMessage } from 'element-plus';
import bus from '@/eventBus/eventBus';
import { myInterval } from '@/utils/interval/interval';

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
const wearPeiItem = reactive<WearPeiItem>({
    data:'--',
    wear_percentage:'0',
    wear_total:'0'
})
const fetchData = async () => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        patient_name: search_form.patient_name,
        ccid: search_form.ccid,
    }
    const result = (await WearManage.getApiList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
        const _result = (await WearManage.getApiNumber(data)).data.result
        if (_result) {
            wearPeiItem.data = _result.data
            wearPeiItem.wear_percentage = _result.wear_percentage.length > 1 ? _result.wear_percentage.substring(0,_result.wear_percentage.length-1) : _result.wear_percentage
            wearPeiItem.wear_total = _result.wear_total
        }
    }

  

}
onMounted(() => {
    fetchData()
})

// const timer: Timer = {
//     id: undefined
// }
// myInterval(() => {
//     fetchData()
// }, 50000, timer)()
// onUnmounted(() => {
//     clearTimeout(timer.id)
// })

</script>

<style scoped>
.wearManage{
    margin: 24px;
}
.header{
    height: 86px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 24px;
}
.patientjournal{
    height: 90px;
    width: 100%;
    background-color: #fff;
}

.peibox {
    display: flex;
    /* align-items: center; */
    /* width: 321px;
    height: 104px; */
    /* background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    margin: 32px; */
}
.peibox_item{
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 18px;
    margin-bottom: 24px;
    margin-right: 24px;
}
.peibox_item_left{
    margin-right: 48px;
    font-size: 18px;    
    justify-content: space-between;
}
.peibox_item_left_h2{
    color: #929FAF;
}
.peibox_item_rigth{
 
    
}
.peibox_item_rigth_unit{
    /* font-size: 28px; */
    
}
</style>
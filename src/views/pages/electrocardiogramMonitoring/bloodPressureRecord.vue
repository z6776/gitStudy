<template>
  <div class='electrocardiogramMonitoringplannew p-20px'>
        <HeaderSeach v-model="date" @selectDate="getPlanGroup" yesterday/>
        
        <div class="mt-20px">
            <el-table :data="tableData" row-class-name="h64px" v-loading="tableLoading" border class="rounded-12px tableshadow">
     <el-table-column prop="totalStep" label="序号" align="center">
         <template #default="scope">
          <div>
               <span>{{ (scope.$index + 1)+(queryParams.page - 1) * queryParams.perPage}}</span>
          </div>
         </template>
      </el-table-column>
 <el-table-column prop="name" label="采集时间" align="center"> 
     <template #default="props">
      <div>
        {{ dateFtt("hh:MM",props.row.insert_time) }}
      </div>
     </template>
   
 </el-table-column>
      <el-table-column prop="sbp" label="收缩压" align="center">
          
      </el-table-column>
       <el-table-column prop="dbp" label="舒张压" align="center">
          
      </el-table-column>
       <el-table-column prop="diff" label="脉压差" align="center">
          
      </el-table-column>
      
      
    </el-table>

          <elc-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.perPage" :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
           
  </div>
</template>
<script setup lang="ts">
  import dynamicMonitoringApi from "@/api/dynamicMonitoring";
import { ref ,reactive, toRefs,onMounted} from 'vue'
import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
import {usePaientInfo } from "@/stores/paientinfo";
const { paientInfo } = toRefs(usePaientInfo()) ;
import { dateFtt } from '@/utils/date/dateFtt';
const date = ref('');
     const tableData = ref([
     ]);

     const tableLoading = ref(false);
const queryParams = reactive({
  inOrOut: "",
  bindStatus: "",
  name: "",
  bedNumber: "",
  page:1,
  perPage:10
});

const handleSizeChange = (val: number) => {
    queryParams.perPage = val
    getPlanGroup()
}
const handleCurrentChange = (val: number) => {
    queryParams.page = val
    getPlanGroup()
}
let total = ref(0);
async function getPlanGroup() {
  try {
    tableLoading.value = true;
    let res = await dynamicMonitoringApi.getrecordbp({
      patient_id: paientInfo.value!.id || "",
      ccid: paientInfo.value!.ccid || "",
      date:dateFtt("yyyymmdd", date.value),
    });
    if (Array.isArray(res.data?.result?.data)) {
          // <td>{{ dateFtt("hh:MM",item.insert_time) }}</td>
    //           <td>{{ item.sbp }}</td>
    //             <td>{{ item.dbp }}</td>
    //           <!-- <td>{{  item.rate  }}</td> -->
    //           <td>{{ item.diff }}</td>
      tableData.value = res.data?.result?.data
    
    }
    total.value = res.data?.result?.total;
    tableLoading.value = false;
  } catch (error) {
    tableLoading.value = false;
  }
}

onMounted(() => {
  getPlanGroup()
})
</script>
<style scoped>
</style>
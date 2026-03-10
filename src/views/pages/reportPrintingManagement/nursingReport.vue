<template>
     <nav class="nav">
      <div>
        <span>在院/离院:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in inOrOutOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>绑定状态:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.bind"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in bindStatusOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
       <div>
        <span>打印状态:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.printStatus"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in printOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>姓名:</span>
        <el-input v-model="queryParams.name" placeholder="请输入" class="cusinput"></el-input>
      </div>
      <div>
        <el-button   type="primary" size="large" ghost @click="fetchData()">查询</el-button>
        <el-button  type="info" size="large" ghost @click="initList()">重置</el-button>
      </div>
    </nav>
      <div class="p-[20px]">
            <el-table :data="tableData" border size="large" v-loading="tableLoading" class="rounded-12px">
                 <el-table-column prop="index" label="序号" align="center" width="100">
                      <template #default="props">
                        <div>
                           {{ (pageQuery.page-1)*10+(props.$index + 1) }}
                        </div>
                      </template>
                 </el-table-column>
                <el-table-column prop="name" label="患者姓名" align="center"></el-table-column>
                  <el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
                    <el-table-column prop="patient_num" label="患者ID" align="center"></el-table-column>
                <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                  <el-table-column prop="start" label="开始佩戴时间" align="center"></el-table-column>
 <el-table-column prop="patient_name" label="打印状态" align="center">
       <template #default="props">
                         <div>
                            <div v-if="props.row.bind===2" class="line-height-16px flex justify-center items-center">
                                   <span class="color-[#24B287] text-[16px]">已打印</span>
                            </div>
                           <div v-else class="line-height-16px flex justify-center items-center">
                                   <span class="color-[#F04A4B] text-[16px]">未打印</span>
                            </div>
                         </div>
                    </template>
 </el-table-column>
  <el-table-column prop="patient_name" label="历史监测项目" align="center">
       <template #default="props">
           <div>
              {{ getTxt(props.row.history) }}
           </div>
       </template>
  </el-table-column>
      
                <el-table-column label="操作" align="center" width="300">
                    <template #default="props">
                        <div class="flex justify-center items-center gap-10px">
                          <!-- printReport(props.row) -->
                            <el-button type="primary" @click="exportSetForm(props.row),exportShow(),getTimeLists(props.row)" plain class="p-[0_15px] h-32px border-none" >导出报告</el-button>
                            <el-button type="primary" @click="openEditDataDialog(props.row)"  color="#0477E0"  plain class="p-[0_15px] h-32px border-none">数值核对</el-button>
                             <el-button type="primary" @click=""  color="#0477E0"  plain class="p-[0_15px] h-32px border-none">上传数值</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        
      </div>
       <elc-pagination :current-page="pageQuery.page" :page-size="pageQuery.perPage" :page-sizes="[10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
<!--                 
          <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->

      <custom-dialog
        v-model="exportVisible"
        append-to-body
        class="_loading"
        title="导出报告"
        :width="`${(640 / 1920) * 100}%`"
        top="10vh"
      >
      <div v-loading="reportloading">
        <div class="report p-[24px_40px] h-540px overflow-y-auto">
        <div class="line-height-1 text-[14px] color-[#F04A4B]">*多选可合并报告进行导出</div>
        <div class="color-[#384951] text-[16px] font-bold mb-12px mt-24px">心率、血氧</div>
        <div v-for="(value, index) in timeRange.heartrate_spo2" :key="index" class="pb-12px pt-12px borderbottom flex items-center justify-between"
        @click="selectReport(index, 'heartrate_spo2')">
        
             <div>
              {{ value.bind_time_date }}   ~   {{ value.unbind_time_date }} 
             </div>
              <div class="icons" style="margin-left: auto;">
                <img src="@/assets/images/icons/ischecked.png" v-if="value.ischecked" alt="" class="checkedicon">  
                  <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
              </div>
        </div>
        <div class="color-[#384951] text-[16px] font-bold mb-12px mt-24px">血压</div>
         <div v-for="(value, index) in timeRange.bp" :key="index" class="pb-12px pt-12px borderbottom flex items-center justify-between"
          @click="selectReport(index, 'bp')"
         >
             <div>
                 {{ value.bind_time_date }}   ~   {{ value.unbind_time_date }} 
             </div>
              <div class="icons" style="margin-left: auto;">
                <img src="@/assets/images/icons/ischecked.png" v-if="value.ischecked" alt="" class="checkedicon">  
                  <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
              </div>
        </div>
        <div class="color-[#384951] text-[16px] font-bold mb-12px mt-24px">血糖</div>
          <div v-for="(value, index) in timeRange.xt" :key="index" class="pb-12px pt-12px borderbottom flex items-center justify-between"
           @click="selectReport(index, 'xt')"
          >
             <div>
                {{ value.bind_time_date }}   ~   {{ value.unbind_time_date }} 
             </div>
              <div class="icons" style="margin-left: auto;">
                <img src="@/assets/images/icons/ischecked.png" v-if="value.ischecked" alt="" class="checkedicon">  
                  <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
              </div>
        </div>
        <div class="color-[#384951] text-[16px] font-bold mb-12px mt-24px">护理事件</div>
          <div v-for="(value, index) in timeRange.event" :key="index" class="pb-12px pt-12px borderbottom flex items-center justify-between" @click="selectReport(index, 'event')">
             <div>
                 {{ value.bind_time_date }}   ~   {{ value.unbind_time_date }} 
             </div>
              <div class="icons" style="margin-left: auto;">
                <img src="@/assets/images/icons/ischecked.png" v-if="value.ischecked" alt="" class="checkedicon">  
                  <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
              </div>
        </div>

        </div>
        <div class="h-60px pl-40px bg-[#eeeeee] flex items-center justify-start">
          <div class="flex items-center cursor-pointer" @click="selectAll()">
            <div class="icons" style="margin-left: auto;">
                <img src="@/assets/images/icons/ischecked.png" v-if="isAllchecked" alt="" class="checkedicon">  
                <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
              </div>
              <span class="text-[16px] color-[#384951] ml-12px">全选</span>
          </div>
        </div>

      </div>
         <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="exportClose()">取消</el-button>
                <el-button size="large" type="primary" @click="exportSubmit()">确定</el-button>
            </div>
        </template>
      

      </custom-dialog>
        

  <custom-dialog
    v-model="editDataDialog"
    append-to-body
    class="_loading"
    title="数值核对"
    :width="`${(1000 / 1920) * 100}%`"
    top="15vh"
  >
    <div class="table_dialog">
      <div class="flex_start mt-12px">
        <el-date-picker
          v-model="searchDate"
          :prefix-icon="customPrefix"
          class="customPrefix"
          @change="changeEditDate"
          type="date"
          placeholder="请选择"
          format="YYYY-MM-DD"
          :disabled-date="birthdayPick"
          value-format="YYYY-MM-DD"
        />
      </div>
      <div class="mt-12px" v-loading="dialogLoading">
        <el-table
          class="table_height"
          :data="editDatalist"
          size="large"
          header-cell-class-name="bg-red! color-[#384951]"
          v-loading="editDataTableLoading"
        >
          <el-table-column
            prop="insert_day"
            label="采集指标"
            align="center"
          ></el-table-column>
          <el-table-column label="采集时分秒" align="center">
            <template #default="props">
              {{ dateFtt("hh:00:00", props.row.insert_time * 1000) }}
            </template>
          </el-table-column>
          <el-table-column label="心率采集结果" align="center">
            <template #default="props">
              <div v-if="props.row.edit_status">
                <el-input v-model="editForm.heartrate"></el-input>
              </div>
              <div v-else>
                {{ props.row.heartrate ? props.row.heartrate : "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="血氧采集结果" align="center">
            <template #default="props">
              <div v-if="props.row.edit_status">
                <el-input v-model="editForm.spo2"></el-input>
              </div>
              <div v-else>{{ props.row.spo2 ? props.row.spo2 : "--" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="props">
              <el-button
                v-if="props.row.edit_status"
                type="primary"
                @click="confirmEdit(props.$index)"
              >
                确认
              </el-button>
              <el-button
                type="success"
                plain
                v-else
                @click="editStatus(props.$index)"
                >调整</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </custom-dialog>
  <!-- -->
  <div class="print_box" v-show="showPrint" >
    <div id="print_container">
       <template v-if="showHp">
      <div class="print_title">
        {{ admin.hospital_name }}{{ admin.name }}病区{{printObj.name}}患者<br />护理服务报告
      </div>
     
       <template v-for="(v,i) in intervalTimePerpage">
         <div class="print_page" v-if="i > 0"></div>
         <div  :class="{'table_padding': i != 0 }">
          <table border="0" cellspacing="0" >
            <tbody>
                  <tr>
                    <td class="table_bg" style="width: 240px">统计时间段</td>
                    <td>
                      <div v-for="(item, index) in v" :key="index">
                        {{ item }}
                      </div>
                    </td>
            </tr>
            <tr v-if="i===intervalTimePerpage.length-1">
              <td class="table_bg" style="width: 240px">统计小时数</td>
              <td>{{ printObj.interval_data }}</td>
            </tr>
            </tbody>
          </table>
         </div>
           
       </template>
      <div class="part_title">1、心率监测情况（住院期间）</div>
      <div class="part_text">
        平均心率为 {{ printObj.heartrate_average }} 次/分，最高心率
        {{ printObj.heartrate_max }}
        次/分，最低心率
        {{ printObj.heartrate_min }} 次/分；
      </div>

      <div class="part_title">2、血氧监测情况（住院期间）</div>
      <div class="part_text">
        平均血氧为 {{ printObj.spo2_average }} %，最高血氧
        {{ printObj.spo2_max }}%，最低血氧 {{ printObj.spo2_min }}%；
      </div>

      <div v-if="printObj.interval_time && printObj.interval_time.length%23 > 7 " class="print_page"></div>
      <div class="part_title">3、心率血氧整体区间分布（住院期间）</div>
      <table border="0" cellspacing="0" v-if="printObj.heartrate_section">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">心率</td>
          <td>心率＜45次/分</td>
          <td>{{ printObj.heartrate_section["< 45"].number }}</td>
          <td>{{ printObj.heartrate_section["< 45"].compare }}</td>
        </tr>
        <tr>
          <td>45次/分≤心率≤80次/分</td>
          <td>{{ printObj.heartrate_section["45 - 80"].number }}</td>
          <td>{{ printObj.heartrate_section["45 - 80"].compare }}</td>
        </tr>
        <tr>
          <td>80次/分≤心率≤120次/分</td>
          <td>{{ printObj.heartrate_section["80 - 120"].number }}</td>
          <td>{{ printObj.heartrate_section["80 - 120"].compare }}</td>
        </tr>
        <tr>
          <td>心率＞120次/分</td>
          <td>{{ printObj.heartrate_section["> 120"].number }}</td>
          <td>{{ printObj.heartrate_section["> 120"].compare }}</td>
        </tr>
        <tr>
          <td rowspan="4">血氧</td>
          <td>血氧＜80%</td>
          <td>{{ printObj.spo2_section["< 80"].number }}</td>
          <td>{{ printObj.spo2_section["< 80"].compare }}</td>
        </tr>
        <tr>
          <td>80%≤血氧＜90%</td>
          <td>{{ printObj.spo2_section["80 - 90"].number }}</td>
          <td>{{ printObj.spo2_section["80 - 90"].compare }}</td>
        </tr>
        <tr>
          <td>90%≤血氧＜95%</td>
          <td>{{ printObj.spo2_section["90 - 95"].number }}</td>
          <td>{{ printObj.spo2_section["90 - 95"].compare }}</td>
        </tr>
        <tr>
          <td>血氧＞95%</td>
          <td>{{ printObj.spo2_section["> 95"].number }}</td>
          <td>{{ printObj.spo2_section["> 95"].compare }}</td>
        </tr>
        </tbody>
      </table>
      
      <div class="print_page"></div>
      <div class="part_title">4、数据采集明细数据（住院期间）</div>
      <div v-for="(list, index) in printObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集指标</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">心率采集结果</td>
                    <td class="table_bg">血氧采集结果</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ dateFtt("yyyy-mm-dd", new Date(item.insert_time * 1000)) }}
                    </td>
                    <td>{{ dateFtt("hh:00:00", new Date(item.insert_time * 1000)) }}</td>
                    <td>{{ item.heartrate }}（次/分）</td>
                    <td>{{ item.spo2 }}%</td>
                  </tr>
                </tbody>
              </table>
        </div>
        </template>
    
          <!-- 护理事件 -->
           <template v-if="showEvent">
            <div class="print_page" v-if="showPerpage('event')"></div>
        <div class="print_title">
        {{ admin.hospital_name }}{{ admin.name }}病区{{ printObj.bed_number }}床<br />护理事件报告
        </div>
        <template v-for="(v,i) in eventPerpage">
             <div class="print_page" v-if="i > 0"></div>
         <div  :class="{'table_padding': i != 0 }">
          <table border="0" cellspacing="0">
          <tbody>
              <tr v-if="i==0">
              <td class="table_bg" style="width: 240px">患者姓名</td>
              <td>{{ patient_name }}</td>
            </tr>
            <tr v-if="i==0">
            <td class="table_bg" style="width: 240px">住院号</td>
            <td>{{ patient_num }}</td>
          </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in v" :key="index">
                      {{ item }}
                    </div>
                  </td>
          </tr>
          <tr v-if="i===eventPerpage.length-1">
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ eventObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>
        </div>
        </template>
        

        <div class="part_title">1、护理事件分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">护理事件</td>
          <td>护理事件</td>
          <td>{{ eventObj.bp_section?.['护理事件']?.number }}</td>
          <td>{{ eventObj.bp_section?.['护理事件']?.compare }}</td>
        </tr>
        <tr>
          <td>换药及处理</td>
          <td>{{ eventObj.bp_section?.['换药及处理']?.number }}</td>
          <td>{{ eventObj.bp_section?.['换药及处理']?.compare }}</td>
        </tr>
        <tr>
          <td>术后相关事件</td>
          <td>{{ eventObj.bp_section?.['术后相关事件']?.number }}</td>
          <td>{{ eventObj.bp_section?.['术后相关事件']?.compare }}</td>
        </tr>
        <tr>
          <td>意外事项</td>
          <td>{{ eventObj.bp_section?.['意外事项']?.number }}</td>
          <td>{{ eventObj.bp_section?.['意外事项']?.compare }}</td>
        </tr>
        </tbody>
      </table>
       <div class="print_page"></div>
       <div class="part_title">2、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in eventObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">事件</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ item.insert_day }}
                    </td>
                    <td>{{ item.insert_hour }}</td>
                    <td>{{ item.tag }}</td>
                  </tr>
                </tbody>
              </table>
        </div>
       
       </template>
      
       <template v-if="showXt">
        <!-- 血糖监测服务 -->
          <div class="print_page" v-if="showPerpage('xt')"></div>
          <div class="print_title">
          {{ admin.hospital_name }}{{ admin.name }}病区{{printObj.bed_number}}床<br />血糖监测服务报告
          </div>

          <template v-for="(v,i) in xtPerpage" :key="i">
             <div class="print_page" v-if="i > 0"></div>
         <div  :class="{'table_padding': i != 0 }">
          <table border="0" cellspacing="0">
          <tbody>
              <tr v-if="i==0">
              <td class="table_bg" style="width: 240px">患者姓名</td>
              <td>{{ patient_name }}</td>
            </tr>
            <tr  v-if="i==0">
            <td class="table_bg" style="width: 240px">住院号</td>
            <td>{{ patient_num }}</td>
          </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in v" :key="index">
                      {{ item }}
                    </div>
                  </td>
          </tr>
          <tr v-if="i===xtPerpage.length-1">
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ xtObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>
        
            </div>
            </template>
        <div class="part_title">1、血糖监测情况(住院期间)</div>
      <div class="part_text">
         血糖最高{{ xtObj.dbp_max || "0" }}mmol/L，最低{{ xtObj.dbp_min || "0"}}mmol/L；
      </div>
       <div class="part_title">2、血糖整体区间分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">血糖</td>
          <td>危险高血糖＞16.7mmol/L</td>
          <td>{{ xtObj.bp_section?.['危险高血糖＞16.7mmol/L'].number }}</td>
          <td>{{ xtObj.bp_section?.['危险高血糖＞16.7mmol/L'].compare }}</td>
        </tr>
        <tr>
          <td>高血糖＞7.0mmol/L</td>
          <td>{{ xtObj.bp_section?.['高血糖＞7.0mmol/L'].number }}</td>
          <td>{{ xtObj.bp_section?.['高血糖＞7.0mmol/L'].compare }}</td>
        </tr>
        <tr>
          <td>正常血糖3.9~6.1mmol/L</td>
          <td>{{ xtObj.bp_section?.['正常血糖3.9~6.1mmol/L'].number }}</td>
          <td>{{ xtObj.bp_section?.['正常血糖3.9~6.1mmol/L'].compare }}</td>
        </tr>
        <tr>
          <td>低血糖＜3.9mmol/L</td>
          <td>{{ xtObj.bp_section?.['低血糖＜3.9mmol/L'].number }}</td>
          <td>{{ xtObj.bp_section?.['低血糖＜3.9mmol/L'].compare  }}</td>
        </tr>
        </tbody>
      </table>
         <div class="print_page"></div>
       <div class="part_title">3、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in xtObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">血糖</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ item.insert_day }}
                    </td>
                    <td>{{ item.insert_hour }}</td>
                    <td>{{ item.calc_data }}mmol/L</td>
                  </tr>
                </tbody>
              </table>
        </div>
    </template>
    <!-- 血压监测服务报告 -->
      
    <template v-if="showBp">
       <div class="print_page" v-if="showPerpage('bp')"></div>
          <div class="print_title">
          {{ admin.hospital_name }}{{ admin.name }}病区{{printObj.bed_number}}床<br />血压监测服务报告
          </div>
          <!-- xyPerpage -->
               <template v-for="(v,i) in xyPerpage" :key="i">
             <div class="print_page" v-if="i > 0"></div>
         <div  :class="{'table_padding': i != 0 }">
          <table border="0" cellspacing="0">
          <tbody>
            <tr v-if="i===0">
                <td class="table_bg" style="width: 240px">患者姓名</td>
                <td>{{ patient_name }}</td>
            </tr>
            <tr v-if="i===0">
              <td class="table_bg" style="width: 240px">住院号</td>
              <td>{{ patient_num }}</td>
            </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in v" :key="index">
                      {{ item }}
                    </div>
                  </td>
            </tr>
          <tr v-if="i===xyPerpage.length-1">
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ bpObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>
         </div>
     </template>
        <div class="part_title">1、血压监测情况(住院期间)</div>
      <div class="part_text">
         收缩压最高{{bpObj.sbp_max}}，最低{{bpObj.sbp_min}}；
      </div>
       <div class="part_text">
         舒张压最高{{bpObj.dbp_max}}，最低{{bpObj.dbp_min}}；
      </div>
       <div class="part_text">
        脉压差平均{{bpObj.average}}。
      </div>
       <!-- <div class="part_title">2、脉率监测情况(住院期间)</div>
        <div class="part_text">
            脉率最高123，最低110，平均123；
        </div> -->
       <div class="part_title">2、血压整体区间分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">血压</td>
          <td>收缩压＞120</td>
          <td>{{bpObj.bp_section?.['> 120'].number}}</td>
          <td>{{bpObj.bp_section?.['> 120'].compare}}</td>
        </tr>
        <tr>
          <td>舒张压＞80</td>
          <td>{{bpObj.bp_section?.['> 80'].number}}</td>
          <td>{{bpObj.bp_section?.['> 80'].compare}}</td>
        </tr>
        <tr>
          <td>脉压差＞60</td>
          <td>{{bpObj.bp_section?.['> 60'].number}}</td>
          <td>{{bpObj.bp_section?.['> 60'].compare}}</td>
        </tr>
        <tr>
          <td>脉压差＜30</td>
          <td>{{bpObj.bp_section?.['< 30'].number}}</td>
          <td>{{bpObj.bp_section?.['< 30'].compare}}</td>
        </tr>
        </tbody>
      </table>
         <div class="print_page"></div>
       <div class="part_title">3、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in bpObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">收缩压</td>
                    <td class="table_bg">舒张压</td>
                    <!-- <td class="table_bg">脉率</td> -->
                    <!-- <td class="table_bg">脉压差</td> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ dateFtt("yyyy-mm-dd", new Date(item.insert_time * 1000)) }}
                    </td>
                    <td>{{ dateFtt("hh:00:00", new Date(item.insert_time * 1000)) }}</td>
                    <td>{{ item.sbp }}</td>
                    <td>{{ item.dbp }}</td>
                      <!-- <td>{{ item.spo2 }}mmol/L</td> -->
                        <!-- <td>{{ item.diff }}mmol/L</td> -->
                  </tr>
                </tbody>
              </table>
        </div>
    </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  bindStatusOptions,
  inOrOutOptions,
  printOptions
} from "@/utils/baseOptions/reportPrintingManagement";
import type { Pagination } from '@/interface/interface';
import PatientApi from "@/api/patient";
import ReportApi from "@/api/report";
import printcss from "@/assets/js/printcss.ts";
import { getCookie } from "@/utils/cookie/cookie";
import { dateFtt } from "@/utils/date/dateFtt";
import { ElMessage } from "element-plus";
import { onMounted, ref,computed,reactive,watch } from "vue";
const admin = JSON.parse(getCookie("admin") as string);
import { useModal } from '@/hooks/useModal';
 import { useCustom } from '@/hooks/useCustom';
  const { customPrefix } =  useCustom();  


let showHp = ref(true);
let showEvent = ref(false);
let showXt = ref(false);
let showBp = ref(false);
const useExport  = ()=>{
   return useModal({
      formInit:{

      },
      beforeSubmit:(form)=>{
             showHp.value = timeRange.value['heartrate_spo2'].some((v:any)=>v.ischecked);
             showEvent.value = timeRange.value['event'].some((v:any)=>v.ischecked);
             showXt.value = timeRange.value['xt'].some((v:any)=>v.ischecked);
             showBp.value = timeRange.value['bp'].some((v:any)=>v.ischecked);
            //  ids传递
             form.heartrate_spo2Ids = getIds("heartrate_spo2",showHp.value);
             form.eventIds = getIds("event",showEvent.value);
             form.xtIds = getIds("xt",showXt.value);
             form.bpIds =getIds("bp",showBp.value);
            // 天数传递
             form.heartrate_spo2Dates = getDates("heartrate_spo2",showHp.value);
             form.eventDates = getDates("event",showEvent.value);
             form.xtDates = getDates("xt",showXt.value);
             form.bpDates = getDates("bp",showBp.value);
             return true
      },
      submitApi:submitApiFn
   })
};
const printObj = ref<any>({});
const eventObj = ref<any>({});
const xtObj = ref<any>({});
const bpObj = ref<any>({});
const submitApiFn = (form: any) => {
  return new Promise(async (resolve, reject) => {
    reportloading.value = true;
    try {
      if(showHp.value){
        let heartrate_spo2 = {
           id: form.heartrate_spo2Ids,
          date: form.heartrate_spo2Dates,
          zone_number: zone_number.value,
          patient_id: patient_id.value
        };
          let res = await ReportApi.reportMsg(heartrate_spo2);
        printObj.value = res.data.result;
     
          printObj.value.data_list_l = [];
            let data_list = res.data.result?.data_list ?? [];
            // 页数
          for (let index = 0; index < Math.ceil(data_list.length / 20); index++) {
            printObj.value.data_list_l[index] = []
          }
          data_list.forEach((item:any, index:number) => {
            printObj.value.data_list_l[Math.floor((index) / 20)].push(item)
          })
      }else{
         printObj.value = {};
      }

      if(showEvent.value){
        let event = {
           id: form.eventIds,
          date: form.eventDates,
          zone_number: zone_number.value,
          patient_id: patient_id.value,
         }
          let res = await ReportApi.reportEvent(event);
        eventObj.value = res.data.result;

  
       


        console.log(eventObj.value,"---------");
          eventObj.value.data_list_l = [];
            let data_list = res.data.result?.data_list ?? [];
          for (let index = 0; index < Math.ceil(data_list.length / 20); index++) {
            eventObj.value.data_list_l[index] = []
          }
          data_list.forEach((item:any, index:number) => {
            eventObj.value.data_list_l[Math.floor((index) / 20)].push(item)
          })
      }else{
        eventObj.value = {};
         
      }

      if(showXt.value){
        let event = {
           id: form.xtIds,
           date: form.xtDates,
           zone_number: zone_number.value,
           patient_id: patient_id.value,
         }
          let res = await ReportApi.reportX(event);
          xtObj.value = res.data.result;
       

          xtObj.value.data_list_l = [];
          let data_list = res.data.result?.data_list ?? [];
          for (let index = 0; index < Math.ceil(data_list.length / 20); index++) {
            xtObj.value.data_list_l[index] = []
          }
          data_list.forEach((item:any, index:number) => {
              xtObj.value.data_list_l[Math.floor((index) / 20)].push(item)
          })
      }else{
        xtObj.value = {
          
        }
      }


       if(showBp.value){
        let bp = {
          id: form.bpIds,
          date: form.bpDates,
          zone_number: zone_number.value,
          patient_id: patient_id.value
        };
        let res = await ReportApi.reportBp(bp);
        bpObj.value = res.data.result;
        //        bpObj.value.interval_time = [];
        //        // 16个开始分页   26个单独占一页
        //      for (let index = 0; index < 18; index++) {
        //       bpObj.value.interval_time.push("12380912~123123")
        //  }
          bpObj.value.data_list_l = [];
            let data_list = res.data.result?.data_list ?? [];
          for (let index = 0; index < Math.ceil(data_list.length / 20); index++) {
            bpObj.value.data_list_l[index] = []
          }
          data_list.forEach((item:any, index:number) => {
            bpObj.value.data_list_l[Math.floor((index) / 20)].push(item)
          })
      }else{
        bpObj.value = {};
      }


      reportloading.value = false;
        setTimeout(() => {
        fetchData();
        // fetchDataNum();
        printFn();
      }, 200);
       
    }catch (error) {
       reportloading.value = false;
       reject(error);
    }
})
}


const intervalTimePerpage = computed(()=>{
  let arr:any[] = [];
  if(printObj.value.interval_time && Array.isArray(printObj.value.interval_time)){
    for(let i = 0; i < printObj.value.interval_time.length; i+=23){ 
      arr.push(printObj.value.interval_time.slice(i,i+23)) 
    }
       return arr;
  }
    return arr;
})

const eventPerpage = computed(()=>{
  let arr:any[] = [];
  if(eventObj.value.interval_time && Array.isArray(eventObj.value.interval_time)){
    for(let i = 0; i < eventObj.value.interval_time.length; i+=24){ 
      arr.push(eventObj.value.interval_time.slice(i,i+24)) 
    }
       return arr;
  }
    return arr;
})

const xtPerpage = computed(()=>{
  let arr:any[] = [];
  if(xtObj.value.interval_time && Array.isArray(xtObj.value.interval_time)){
    for(let i = 0; i < xtObj.value.interval_time.length; i+=13){ 
      arr.push(xtObj.value.interval_time.slice(i,i+13)) 
    }
       return arr;
  }
    return arr;
})

const xyPerpage = computed(()=>{
  let arr:any[] = [];
  if(bpObj.value.interval_time && Array.isArray(bpObj.value.interval_time)){
    for(let i = 0; i < bpObj.value.interval_time.length; i+=13){ 
      arr.push(bpObj.value.interval_time.slice(i,i+13)) 
    }
       return arr;
  }
    return arr;
})



const getPrintPage=()=>{
    let arr = [{uni_id:'hp',...printObj.value}, {uni_id:'event',...eventObj.value},{uni_id:"xt",...xtObj.value}, {uni_id:'bp',...bpObj.value}];
    let arr1:any[] = [];
    arr.forEach((item,index)=>{
       if(Object.keys(item).length > 1){
         arr1.push(item);
       }
    });
    return arr1;
}


// 是否显示分页
const showPerpage = (type:'hp'|'event'|'xt'|'bp')=>{
  let index = getPrintPage().findIndex((item:any)=>item.uni_id === type);
  if(index <=0){
      return false;
  }
   
  return getPrintPage()[index-1].data_list_l.length <=1;
};



const {
  visible: exportVisible,
  form: exportForm,
  show: exportShow,
  close:exportClose,
  submit: exportSubmit,
  setForm: exportSetForm
} = useExport()

const queryParams = ref({
  date:"",
  status: "",
  bind: "",
  printStatus: "",
  ccid: "",
  name: ""
});



const getIds=(type:string,flag:boolean)=>{
   if(flag){
      return timeRange.value[type].filter((v:any)=>v.ischecked).map((v:any)=>v.id)
   }
   return []
}

const getDates=(type:string,flag:boolean)=>{
   if(flag){
      return timeRange.value[type].filter((v:any)=>v.ischecked).map((v:any)=>{
         return {
                 bind_time_date: v.bind_time_date,
                 unbind_time_date:v.unbind_time_date,
                 start: v.start,
                 end: v.end || "0",
               }
      })
   }
   return []
}


const getTxt = (arr:any)=>{
   if( arr && arr.length>0){
     return  arr.join("、")
   }
   return "--"
}

const tableLoading = ref<boolean>(false);
const tableData = ref<any[]>([]);
const inNum = ref<number>(0);
const outNum = ref<number>(0);
const bindNum = ref<number>(0);
const unbindNum = ref<number>(0);
const printNum = ref<number>(0);
const unprintNum = ref<number>(0);
const selectReport  = (index:any,type:any)=>{
    timeRange.value[type][index].ischecked = !timeRange.value[type][index].ischecked
}
let isAllchecked = computed(()=>{
  let arr:any[] = []
  for(let key in timeRange.value){
    if(Array.isArray(timeRange.value[key])){
      timeRange.value[key].forEach((item:any)=>{
          arr.push(item)
      })
    }    
  }
  return arr.length > 0 && arr.every((v:any)=>v.ischecked);
});
const selectAll = ()=>{
  let flag = !isAllchecked.value;
  for(let key in timeRange.value){
    timeRange.value[key].forEach((item:any)=>{
      item.ischecked = flag;
    })
  }
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


const fetchData = async () => {
  tableLoading.value = true;
  let data: any = {
    page: 1,
    perPage: pageQuery.perPage,
    is_print:queryParams.value.printStatus,
    status:queryParams.value.status,
    bind:queryParams.value.bind,
    name:queryParams.value.name
  };
 
  const result = (await PatientApi.getPatientList(data)).data.result;
  if (result) {
    tableLoading.value = false;
    pageQuery.total = result.total;
    tableData.value = result.data;
  }
};

let timeRange = ref<any>({});
let reportloading = ref<boolean>(false);
  // 
let zone_number = ref<string>('');
let patient_id = ref<string>('');
let patient_name = ref<string>('');
let patient_num = ref<string>('');
const getTimeLists = async (row:any) => {
  zone_number.value = row.zone_number;
  patient_id.value = row.id;
  patient_name.value = row.name;
  patient_num.value = row.patient_num;
  reportloading.value = true;
  try {
    const result = (await ReportApi.timeListMerge({
    patient_id:row.id
  })).data.result;
  if (result) {
    for(let key in result){
       if(!result[key]){
           result[key] = [];
       }
  };
  timeRange.value = result;
};
 reportloading.value = false;
    
  } catch (error) {
    reportloading.value = false;
    
  } 
}



const initList = () => {
  queryParams.value.status = "";
  queryParams.value.bind = "";
  queryParams.value.name = "";
  queryParams.value.printStatus = "";
  queryParams.value.ccid = "";
  fetchData();
};

const fetchDataNum = async () => {
  tableLoading.value = true;
  let data: any = {
    page: 1,
    perPage: 999,
    // bind: 1,
  };
  const result = (await PatientApi.getPatientList(data)).data.result;
  if (result) {
    printNum.value = result.is_print_num;
    unprintNum.value = result.is_not_print_num;
    inNum.value = 0;
    outNum.value = 0;
    bindNum.value = 0;
    unbindNum.value = 0;
    result.data.forEach((element: any) => {
      if (element.status == 2) {
        outNum.value++;
      } else {
        inNum.value++;
      }
      if (element.bind == 1) {
        bindNum.value++;
      } else {
        unbindNum.value++;
      }
    });
  }
};
// 打印

const showPrint = ref(false);
const printReport = (item: any) => {
  let data = {
    id: item.id,
    name: item.name,
    zone_number: item.zone_number,
    start: item.start,
    ccid: item.ccid,
    end: dateFtt("yyyy-mm-dd hh:MM:ss", new Date()),
  };
  ReportApi.printReportData(data).then((res) => {
    printObj.value = res.data.result;

     for (let index = 0; index < 6; index++) {
          printObj.value.interval_time.push("12380912~123123")
     }

     let data_list = res.data.result?.data_list ?? [];

    //  for (let index = 0; index < 100; index++) {
    //       data_list.push({
    //       heartrate:"123",
    //       spo2:"1238"
    //       })
    //  }
        printObj.value.data_list_l = [];
        for (let index = 0; index < Math.ceil(data_list.length / 20); index++) {
          printObj.value.data_list_l[index] = []
        }
        data_list.forEach((item:any, index:number) => {
          printObj.value.data_list_l[Math.floor((index) / 20)].push(item)
        })
    setTimeout(() => {
      fetchData();
      // fetchDataNum();
      printFn();
    }, 200);
  });
};

const printFn = () => {
  var document = window.document;
  const printContent = (
    document.querySelector("#print_container") as HTMLElement
  ).innerHTML;
  if (window.electron) {
    const html = `
      <html>
      <style media="print">${printcss}</style>
      <div id="print_container">${printContent}</div>
        </html>`;
    setTimeout(function () {
      (window as any).electron.sendPrint(html);
    }, 50);
  } else {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("style", "position: absolute; width: 0; height: 0;");
    document.body.appendChild(iframe);
    const iframeDoc = (iframe.contentWindow as Window).document;
    iframeDoc.write('<div id="print_container">' + printContent + "</div>");
    iframeDoc.write(`<style media="print">${printcss}</style>`);
    setTimeout(() => {
      (iframe.contentWindow as Window).print();
      document.body.removeChild(iframe);
    }, 50);
  }
};


let datePicker = ref<any>(null);
const showDatePicker = () => {
      datePicker.value!.focus()
}

async function getPlanGroup(date:(Date | string)=new Date()){       
  queryParams.value.date = dateFtt("yyyy/mm/dd",date);
      fetchData();
}
const hasValue = computed(() => {
    return queryParams.value.date.length > 0;
})
// 数值调整
const editDataDialog = ref(false);
const patientItem = ref<any>({});

const openEditDataDialog = (item: any) => {
  patientItem.value = item;
  editDataDialog.value = true;
  searchDate.value = dateFtt(
    "yyyy-mm-dd",
    Number(patientItem.value.end) ? patientItem.value.end * 1000 : ""
  );
  fetchEditDataList();
};

const searchDate = ref("");
const birthdayPick = (date: Date) => {
  if (
    date >
    (Number(patientItem.value.end)
      ? new Date(patientItem.value.end * 1000)
      : new Date())
  ) {
    return true;
  } else if (date < new Date(patientItem.value.start)) {
    return true;
  } else {
    return false;
  }
};
const editDataTableLoading = ref(false);
const editDatalist = ref<any[]>([]);
const fetchEditDataList = async () => {
  editDataTableLoading.value = true;
  let data = {
    start: searchDate.value + " 00:00:00",
    end: searchDate.value + " 23:59:59",
    id: patientItem.value.id,
    zone_number: admin.zone_number,
  };
  try {
    const result = (await ReportApi.editDataList(data)).data.result;
    if (result) {
      editDatalist.value = result.data_list;
      editDatalist.value.forEach((item: any, index: number) => {
        editDatalist.value[index].edit_status = false;
      });
    }
    editDataTableLoading.value = false;
  } catch (error) {
    editDataTableLoading.value = false;
  }
};

const editForm = ref<any>({
  heartrate: "",
  spo2: "",
});
const editStatus = (index: number) => {
  let dataList = JSON.parse(JSON.stringify(editDatalist.value));
  dataList.forEach((item: any, i: number) => {
    dataList[i].edit_status = false;
  });
  dataList[index].edit_status = true;
  editDatalist.value = dataList;
  editForm.value = {
    heartrate: dataList[index].heartrate ? dataList[index].heartrate : "",
    spo2: dataList[index].spo2 ? dataList[index].spo2 : "",
  };
};
const dialogLoading = ref(false);
const confirmEdit = async (index: number) => {
  if (!editForm.value.heartrate) {
    ElMessage.error("请输入心率值");
    return;
  }
  if (!editForm.value.spo2) {
    ElMessage.error("请输入血氧值");
    return;
  }
  dialogLoading.value = true;

  let data = {
    id: editDatalist.value[index].id,
    spo2: editForm.value.spo2,
    heartrate: editForm.value.heartrate,
    zone_number: admin.zone_number,
  };
  try {
    const result = (await ReportApi.editData(data)).data;
    dialogLoading.value = false;
    if (result) {
      ElMessage.success("操作成功");
      fetchEditDataList();
    }
  } catch (error) {
    dialogLoading.value = false;
  }
};
const changeEditDate = () => {
  fetchEditDataList();
};

onMounted(() => {
  fetchData();
  // fetchDataNum();
});
</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
.control_box {
  height: 88px;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

    /* 滚动条整体宽度 */
  ::-webkit-scrollbar {
    width: 4px; /* 可根据需要调整宽度 */
    background: #e6f0ff;
    margin-left: 10px;
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: #CDCDCD;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: #24B287;
    /* min-height: 70px; */
    transition: background 0.2s;
  }

  /* 鼠标悬停时滑块颜色 */
  ::-webkit-scrollbar-thumb:hover {
    background: #24B287;
  }

  /* 横向滚动条（如有） */
  ::-webkit-scrollbar-horizontal {
    height: 12px;
  }

.checkedicon{
  width: 20px;
  height: 20px;
}
.borderbottom{
  border-bottom: 1px solid #EEEEEE;
}
.icons{
   display: flex;
    align-items: center;
}


.nav_btn_confirm {
  width: 101px;
  height: 48px;
  background: #24B287;
  border-radius: 8px 8px 8px 8px;
  color: #ffffff;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}
.ep-button + .ep-button {
    margin-left: 0 !important;
}
.nav_btn_reset {
  width: 101px;
  height: 48px;
  background: #929faf;
  border-radius: 8px 8px 8px 8px;
  color: #ffffff;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}

.control_button {
  width: 118px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #f5f7fb;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  font-size: 16px;
  color: #636676;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.active_control_button {
  background-color: #24B287;
  color: #fff;
}

 

.list_box {
  padding: 24px 24px 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  /* min-height: 100%; */
}

.list_item {
  width: calc(16.6% - 12px);
  background-color: #fff;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 12px;
  padding: 0 20px 20px;
  border: 1px solid #eeeeee;
  margin-right: 12px;
  padding-bottom: 0;
}

.list_item:nth-child(6n) {
  margin-right: 0;
}

.item_title {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 24px;
}

.item_title div {
  width: 48%;
  white-space: nowrap;
  /* 确保文本在一行内显示 */
  overflow: hidden;
  /* 超出容器部分隐藏 */
  text-overflow: ellipsis;
  /* 使用省略号表示被截断的文本 */
  cursor: pointer;
}

:deep(.el-input){
      width: 200px !important;
}
.date-picker{
    width: 200px;
    height: 48px;
    position: relative;
    margin-right: 10px;
  
}
:deep(.date-picker .el-input){
  position: absolute;
  inset: 0;
}

:deep(.date-picker .el-input__wrapper){
    background: #F5F7FB;
     height: 48px; 
      width: 100%;  
    box-shadow: none;
    padding-right: 33px;
}

.bed_number {
  font-family: "Alibaba PuHuiTi 3.0-85 Bold";
  font-size: 30px;
}

.patient_name {
  font-size: 28px;
  color: #384951;
  text-align: right;
}

.item_content {
  margin-bottom: 24px;
  font-size: 14px;
  color: #636676;
}

.item_content div {
  height: 14px;
}

.item_content div:first-child {
  margin-bottom: 8px;
}

.item_content div:last-child {
  font-family: "Alibaba PuHuiTi 3.0-55 Regular L3";
}

.item_bottom {
  display: flex;
  margin-bottom: 12px;
}

.item_bottom img {
  width: 24px;
  height: 24px;
}

.export_button {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #145eff;
  cursor: pointer;
}

.today_nodata {
  font-size: 16px;
  color: #929faf;
  text-align: center;
  position: relative;
  top: 30%;
  transform: translateY(-50%);
}

.today_nodata img {
  width: 240px;
  margin: 0 auto;
}

.item_button {
  height: 44px;
  border-top: 1px solid #eee;
}

.button_item {
  width: 40%;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.blue_font {
  color: #145eff;
}

.green_font {
  color: #24B287;
}

.split_line {
  height: 16px;
  width: 1px;
  background-color: #eee;
}

 

.table_dialog {
  padding: 0 20px 20px;
}

.table_box .table_height {
  height: 528px;
  border:none;  
}

.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  gap: 15px;
  padding: 12px 24px;
  border-radius: 12px;
  margin: 20px;
  margin-bottom: 0;
}
.nav > div {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  color: #636676;
  gap: 12px;
  /* margin-left: 12px; */
}
.nav > div span {
  flex-shrink: 0;
}
.date-icon{
    width: 24px;
    height: 24px;
}

:deep(.el-select__wrapper) {
  background-color: #f5f7fb;
  box-shadow: none;
  width: 150px;
  height: 48px;
}
:deep(.cusinput .el-input__wrapper) {
  width: 260px;
  height: 48px;
  background-color: #f5f7fb;
  box-shadow: none;
}
.date-arrowbottom{
    width: 14px;
    height: 14px;
    cursor: pointer;
}


.dateContainer{
    position: absolute;
    top: 0;
    right: 0;
    height: 48px; 
    width: 100%;
      z-index: -10;
    opacity: 0;
    cursor: pointer;
}
</style>


 
<template>
  <div class="patient_management_box">
    <div class="patient">
        <div class="search_box flex_space_between">
            <div class="flex_start">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">床位号：</div>
                    <div> <el-input size="large" v-model="search_form.bed_number" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">设备CCID：</div>
                    <div> <el-input size="large" v-model="search_form.ccid" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">

                    <div class="search_label">脱组状态：</div>
                    <div class="elSelect">
                        <el-select  size="large" v-model="search_form.group_status"
                            placeholder="请选择">
                            <el-option :value="1" label="未脱组"></el-option>
                            <el-option :value="2" label="已脱组"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_btn_box">
                    <el-button type="success" size="large" @click="search">查询</el-button>
                    <el-button type="warning" size="large" @click="reset">重置</el-button>
                </div>
            </div>
            <div class="add_btn_box">
                <el-button type="success" size="large" @click="addPatient">
                    <img src="@/assets/images/patient_add_icon.png" class="btn_icon">
                    创建人员信息</el-button>
            </div>
        </div>
        <div class="table_box">
            <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
                <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                <el-table-column label="年龄" prop="birthday" align="center" width="80">
                    <template #default="props">
                        {{ props.row.birthday ?
                            ((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 < 365 ? Math.floor
                                ((new Date().getTime() - new Date(props.row.birthday).getTime()) / 86400000) + '天' :
                                Math.floor(((new Date().getTime() - new Date(props.row.birthday).getTime())) / 86400000 /
                                    365) + '周岁' : "" }} </template>
                </el-table-column>
                <el-table-column label="设备CCID" prop="ccid" align="center" width="350">
                    <template #default="props">
                        <div class="flex_space_between" v-if="props.row.bind == 1">
                            <div class="ccid">{{ props.row.ccid }}</div>
                            <div style="color: var(--el-color-primary);" class="btn_cur"
                                @click="openChangeDeviceDialog(props.row)">更换设备</div>
                            <div style="color: var(--el-color-danger);" @click="unbindCcid(props.row)" class="btn_cur">
                                解绑设备</div>
                        </div>
                        <div v-else>
                            <div style="color: var(--el-color-primary);" @click="openBindDialog(props.row)"
                                class="btn_cur">绑定设备</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="床位号" prop="bed_number" align="center" width="75"></el-table-column>
                <el-table-column label="高心率预警阈值（次/分）" prop="high_heartrate_value" align="center"
                    min-width="110"></el-table-column>
                <el-table-column label="低心率预警阈值（次/分）" prop="low_heartrate_value" align="center"
                    min-width="110"></el-table-column>
                <el-table-column label="低血氧预警阈值（%）" prop="spo2" align="center" min-width="110"></el-table-column>
                <!-- <el-table-column label="设置报警阈值" prop="bed_number" align="center" min-width="280">
                    <template #default="props">
                        <div class="flex_space_between" v-if="props.row.bind == 1">
                            <div style="text-align: left;">
                                <p>心率(最低值{{ props.row.low_heartrate_value }}bpm，最高值{{ props.row.high_heartrate_value
                                    }}bpm)；
                                </p>
                                <p>血氧(最低值{{ props.row.spo2 }}%)；</p>
                            </div>
                            <div style="color: var(--el-color-primary);" class="btn_cur"
                                @click="openDeviceDataDialog(props.row)">设置阈值</div>
                        </div>
                        <div v-else style="text-align: left;">
                            --
                        </div>
                    </template>
                </el-table-column> -->

                <el-table-column prop="log" label="操作日志" align="center">
                    <template #default="props">
                        <div style="color: var(--el-color-primary);" class="btn_cur" @click="openLogDetail(props.row)">
                            详情（{{ props.row.log }}）</div>
                    </template>
                </el-table-column>
                <el-table-column label="入院时间" prop="start" align="center" min-width="140">
                    <!-- <template #default="props">
                        {{ dateFtt('yyyy-mm-dd hh:MM:ss', props.row.start * 1000) }}
                    </template> -->
                </el-table-column>
                <el-table-column label="在院/离院"  align="center" min-width="120">
                    <template #default="props">
                        
                        <div style="text-align: center;" v-if="props.row.status == 1">
                            在院
                        </div>
                        <div v-else>
                        <div>{{ dateFtt('yyyy-mm-dd', new Date(props.row.end)) }}</div>
                           <div>离院</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="320" fixed="right">
                    <template #default="props">
                        <div class="flexbox">
                            <!-- editPatient(props.row) -->
                            <el-button type="success" @click="handleBedDetail(props.row)" plain>患者信息</el-button>
                        <el-button type="success" @click="operationTime(props.row)" plain>手术时间</el-button>
                        <el-button type="success" plain @click="editPatientBed(props.row)">床位信息</el-button>
                        <!-- <el-button type="success" plain @click="openDeviceDataDialog(props.row)"
                            v-if="props.row.bind == 1">预警阈值</el-button> -->
                        <el-button type="success" v-if="props.row.group_status == 1" @click="unSet(props.row)"
                            color="#F22727" plain>脱组</el-button>
                        <el-button type="success" v-if="props.row.group_status == 2" color="#F22727"
                            disabled>已脱组</el-button>
                            <el-button type="success" @click="toLeave(props.row)" plain  color="#F22727" v-if="props.row.status == 1">患者离院</el-button>
                              <el-button type="success" plain  color="#F22727" disabled v-if="props.row.status == 2">已离院</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination :current-page="pageQuery.page" :page-size="pageQuery.perPage" :page-sizes="[10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
    </div>

     <transition name="slide" mode="out-in">
            <div class="bed_detail" v-if='showDetail'>
                <BedDetail :bed-item="handleBedItem" @close="closeDetail" @reloadBedList='fetchData' @onSubmit="edItForm" :isEdit="true"></BedDetail>
            </div>
        </transition>
        <div class="customModal" v-if="patientDialogVisible" @click="patientDialogVisible = false">
    <div  class="dialog_box" :title="patientDialogTitle" :show-close="false" top="6vh"
    @click.stop
    style="--custom-dialog-width: 80%;"
     :lock-scroll="false"   
    :close-on-click-modal="false"  
    :modal="false"
      :destroy-on-close="true" 
    :append-to-body="true"   
    >
    <div class="headerBox">
        {{ patientDialogTitle }}
    </div>
    <div v-if="patientDialogVisible" class="form-container">
        <!-- el-dialog__header -->
        <div class="title_hz" v-if="patientDialogTitle == '编辑人员档案'">
            <div :class="`title_hz_item ${title_hz_item_picth == 0 ? 'title_hz_item_picth' : ''}`" @click="hzItemPicth(0)">
                基础信息
            </div>
            <div :class="`title_hz_item ${title_hz_item_picth == 1 ? 'title_hz_item_picth' : ''}`" @click="hzItemPicth(1)">
                随访信息
            </div>
        </div>
        <div class="patient_form_box" v-if="title_hz_item_picth == 0">
            <el-form :model="patientForm" :disabled="patientFormDisabled" :rules="patientFormRules" label-width="auto"
                ref='patientFormRef' label-position="right">
                <!-- <el-form-item label="患者姓名" prop="name">
                    <el-input maxlength="10" type="text" v-model="patientForm.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker v-model="patientForm.birthday" type="date" placeholder="请选择" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="年龄">
                    <div>{{ patinetFormAge >= 0 ? patinetFormAge : '根据出生日期自动计算年龄' }}</div>
                </el-form-item>
                <el-form-item label="入院时间" prop="start">
                    <el-date-picker v-model="patientForm.start" type="datetime" placeholder="请选择"
                        format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item> -->
                <el-row>
                    <el-col :span="9">
                        <div class="patient_form_title">个人信息</div>
                        <el-form-item label="姓名" prop="name">
                            <el-input class="patient_input_width" maxlength="10" type="text" v-model="patientForm.name"
                                placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-select class="patient_input_width" v-model="patientForm.sex" placeholder="请选择">
                                <el-option :value="1" label="男"></el-option>
                                <el-option :value="2" label="女"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" prop="nationality">
                            <el-select class="patient_input_width" v-model="patientForm.nationality" placeholder="请选择">
                                <el-option v-for="item in nationalityOptions" :key="item.id" :value="item.name"
                                    :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker class="patient_input_width" v-model="patientForm.birthday" type="date"
                                placeholder="请选择" format="YYYY-MM-DD" :disabled-date="birthdayPick"
                                value-format="YYYY-MM-DD" />
                        </el-form-item>
                        <el-form-item label="身份证号" prop="id_card">
                            <el-input class="patient_input_width" maxlength="18" type="text"
                                v-model="patientForm.id_card" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="address">
                            <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                :rows="3" v-model="patientForm.address" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="紧急联系人" prop="emergency_contact">
                            <el-input class="patient_input_width" maxlength="10" type="text"
                                v-model="patientForm.emergency_contact" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人电话" prop="emergency_phone">
                            <el-input class="patient_input_width" maxlength="11" type="text"
                                v-model="patientForm.emergency_phone" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人关系" prop="emergency_relation">
                            <el-input class="patient_input_width" maxlength="10" type="text"
                                v-model="patientForm.emergency_relation" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="主要沟通语言" prop="language">
                            <el-select class="patient_input_width" v-model="patientForm.language" placeholder="请选择">
                                <el-option v-for="item in languagesOptions" :key="item" :value="item"
                                    :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="其他语言" prop="language_other" v-if="patientForm.language == '其他'">
                            <el-input class="patient_input_width" maxlength="10" type="text"
                                v-model="patientForm.language_other" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <div class="patient_form_title">住院信息</div>
                        <div class="flex_space_between" style="align-items: start;">
                            <div>
                                <el-form-item label="入院时间" prop="start">
                                    <el-date-picker class="patient_input_width" v-model="patientForm.start"
                                        type="datetime" placeholder="请选择" format="YYYY-MM-DD HH:mm:ss"
                                        value-format="YYYY-MM-DD HH:mm:ss" />
                                </el-form-item>
                                <el-form-item label="科室名称" prop="department">
                                    <el-input class="patient_input_width" maxlength="10" type="text"
                                        v-model="patientForm.department" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病历号" prop="medical_record_number">
                                    <el-input class="patient_input_width"
                                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                        v-model="patientForm.medical_record_number" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="责任医生" prop="responsible_doctor">
                                    <el-input class="patient_input_width" maxlength="10" type="text"
                                        v-model="patientForm.responsible_doctor" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病情" prop="illness">
                                    <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                        :rows="3" v-model="patientForm.illness" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="护理等级" prop="level_of_care">
                                    <el-select class="patient_input_width" v-model="patientForm.level_of_care"
                                        placeholder="请选择">
                                        <el-option :value="4" label="特级护理"></el-option>
                                        <el-option :value="1" label="一级护理"></el-option>
                                        <el-option :value="2" label="二级护理"></el-option>
                                        <el-option :value="3" label="三级护理"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="离院日期" prop="end" align="right">
                                    <el-date-picker class="patient_input_width" v-model="patientForm.end" type="date"
                                        placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                                </el-form-item>
                                <el-form-item label="入科日期" prop="department_in_time">
                                    <el-date-picker class="patient_input_width" v-model="patientForm.department_in_time"
                                        type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                                </el-form-item>
                                <el-form-item label="住院号" prop="patient_num">
                                    <el-input class="patient_input_width"
                                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                        v-model="patientForm.patient_num" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="责任护士" prop="responsible_nurse">
                                    <el-input class="patient_input_width" maxlength="10" type="text"
                                        v-model="patientForm.responsible_nurse" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="用药信息" prop="medication_info">
                                    <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                        :rows="3" v-model="patientForm.medication_info" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病情状态" prop="situation">
                                    <el-select class="patient_input_width" v-model="patientForm.situation"
                                        placeholder="请选择">
                                        <el-option :value="1" label="一般"></el-option>
                                        <el-option :value="2" label="病危"></el-option>
                                        <el-option :value="3" label="病重"></el-option>
                                        
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="离院小结" prop="precautions">
                            <el-input maxlength="500" type="textarea"  :rows="3"
                                v-model="patientForm.precautions" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="复诊时间" v-if="patientForm.status == 2" prop="return_visit" align="right">
                        <el-date-picker class="patient_input_width" :disabled-date="limitTime2" v-model="patientForm.return_visit" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="sfxx" v-if="title_hz_item_picth == 1" v-loading="hzLoading">
            <div class="sfxx_item">
                <div class="sfxx_item_l">研究阶段：</div>
                <div class="sfxx_item_r">{{hzData.stage}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">医生随访次数： </div>
                <div class="sfxx_item_r">{{hzData.visit_count}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">主动反馈异常：</div>
                <div class="sfxx_item_r">{{hzData.is_reply}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">是否完成宣教：</div>
                <div class="sfxx_item_r">{{hzData.is_look}}</div>
            </div>
        </div>
          </div>
        <div >
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="patientDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="isfzsjbor"
                    v-if="(patientDialogTitle == '编辑人员档案') && (patientForm.status == 1)">
                    出院
                </el-button>
                <el-button size="large" disabled type="success"
                    v-if="(patientDialogTitle == '编辑人员档案') && (patientForm.status == 2)">
                    已出院
                </el-button>
                <el-button size="large" type="success" v-if="patientFormDisabled"
                    @click="patientFormDisabled = false">编辑</el-button>
                <el-button size="large" type="success" v-else @click="submitForm()">
                    提交
                </el-button>
            </div>
        </div>
       </div>
    </div>

    <custom-dialog v-model="editPatientBedDialogVisible" append-to-body class="_loading" title="床位信息" :show-close="false"
        :width="`${(498 / 1920) * 100}%`" top="25vh">
        <div class="form_box">
            <el-form :model="editPatientBedForm" :rules="editPatientBedFormRules" label-width="auto"
                ref='editPatientBedFormRef' label-position="right">
                <el-form-item label="当前床位号" prop="old_bed_number">
                    <div>{{ editPatientBedForm.old_bed_number ? editPatientBedForm.old_bed_number : "未分配" }}</div>
                </el-form-item>
                <el-form-item label="更换床位号" prop="bed_id">
                    <el-select v-model="editPatientBedForm.bed_id" placeholder="请选择">
                        <el-option v-for="item in bed_list.list" :key="item.id" :label="item.bed_number"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="editPatientBedDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitPatientBedForm()">
                    提交
                </el-button>
                <el-button v-if="editPatientBedForm.old_bed_number" size="large" type="danger"
                    @click="unbindPatientBed()">
                    解绑
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="operationTimeDialogVisible" append-to-body class="_loading" title="手术时间" :show-close="false"
        :width="`${(498 / 1920) * 100}%`" top="25vh">
        <div class="form_box">
            <el-form :model="operationTimeForm" :rules="operationTimeRules" label-width="auto"
                ref='editOperationTimeFormRef' label-position="right">
                <el-form-item label="手术开始时间" prop="operation_start">
                    <el-date-picker class="patient_input_width" v-model="operationTimeForm.operation_start"
                        type="datetime" placeholder="请选择" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="手术结束时间" prop="operation_end">
                    <el-date-picker class="patient_input_width" v-model="operationTimeForm.operation_end"
                        type="datetime" placeholder="请选择" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="operationTimeDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" v-if="!operationTimeBtnVisible"
                    @click="submitOperationTimeFormedit()">
                    编辑
                </el-button>
                <el-button size="large" type="success" v-else @click="submitOperationTimeForm()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="fzsjbor" append-to-body class="_loading" title="出院" :show-close="false"
        :width="`${(698 / 1920) * 100}%`" top="25vh">
        <div class="form_box">
            <el-form :model="fzForm" label-width="auto" label-position="right">
                <el-form-item label="请选择复诊时间"  prop="fzsjvalue">
                    <el-date-picker class="patient_input_width" v-model="fzForm.fzsjvalue" type="date"
                         placeholder="请选择"
                        :disabled-date="limitTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="fzsjbor = false">取消</el-button>

                <el-button size="large" type="success" @click="setfzsj()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="leaveDialogVisible" append-to-body class="_loading" title="患者离院" :show-close="false"
        :width="`${(498 / 1920) * 100}%`" top="25vh">
        <div class="un_leave">
            <div>患者离院时间:</div>
            <el-date-picker class="date_input_width" v-model="leaveTime" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="leaveDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="confirmLeave()">
                    确认
                </el-button>
            </div>
        </template>
    </custom-dialog>

     <custom-dialog v-model="unDialogVisible" append-to-body class="_loading" title="患者离院" :show-close="false"
        :width="`${(498 / 1920) * 100}%`" top="25vh" >
        <div class="un_box">
            <div>是否将人员进行脱组？</div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="unDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="unSubmitOperation()">
                    确认
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="logDialogVisible" append-to-body title="操作日志" :show-close="false"
        :width="`${(1100 / 1920) * 100}%`">
        <div class="logDailogContent">
            <div class="logDailogPatientInfoBox flex_start">
                <div>
                    姓名：{{ logPatientInfo.name }}
                </div>
                <div>
                    年龄：{{ logPatientInfo.birthday ? ((new Date().getTime() - new
                        Date(logPatientInfo.birthday).getTime())) / 86400000 < 365 ? Math.floor((new Date().getTime() - new
                            Date(logPatientInfo.birthday).getTime()) / 86400000) + '天' : Math.floor(((new Date().getTime() -
                                new Date(logPatientInfo.birthday).getTime())) / 86400000 / 365) + '周岁' : "" }} </div>
                </div>
                <div class="flex_start dialog_search_box">
                    <div class="search_item flex_start">
                        <div class="search_label">操作类型：</div>
                        <div class="select_width">
                            <el-select v-model="logDialogSearchForm.type" placeholder="请选择">
                                <el-option v-for="(item, index) in editTypes" :key="index" :label="item"
                                    :value="index" />
                            </el-select>
                        </div>
                    </div>
                    <div class="search_item flex_start">
                        <div class="search_label">更换前内容：</div>
                        <div>
                            <el-input v-model="logDialogSearchForm.before" placeholder="请输入"></el-input>
                        </div>
                    </div>
                    <div class="search_item flex_start">
                        <div class="search_label">更换后内容：</div>
                        <div>
                            <el-input v-model="logDialogSearchForm.after" placeholder="请输入"></el-input>
                        </div>
                    </div>
                    <div class="search_btn_box">
                        <el-button type="success" size="large" @click="logDialogSearch">查询</el-button>
                        <el-button type="warning" size="large" @click="logDialogReset">重置</el-button>
                    </div>
                </div>
                <el-table :data="logDialogTableData" border style="width: 100%" v-loading="logDialogTableLoading">
                    <el-table-column label="更换类型" align="center">
                        <template #default="props">
                            {{ editTypes[props.row.type] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="变更前内容" prop="before" align="center">
                        <template #default="props">
                            <div v-if="props.row.type == 2">
                                <div>姓名：{{ props.row.before.name ? props.row.before.name : "--" }}</div>
                                <div>入院时间：{{ props.row.before.start ? props.row.before.start : "--" }}
                                </div>
                                <div>出生日期：{{ props.row.before.birthday ? props.row.before.birthday : "" }}</div>
                            </div>
                            <div v-else-if="props.row.type == 6">
                                <div>--</div>

                            </div>
                            <div v-else> {{ props.row.before }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后内容" prop="after" align="center">
                        <template #default="props">
                            <div v-if="props.row.type == 2">
                                <div>姓名：{{ props.row.after.name ? props.row.after.name : "--" }}</div>
                                <div>入院时间：{{ props.row.after.start ? props.row.after.start : "--" }}
                                </div>
                                <div>出生日期：{{ props.row.after.birthday ? props.row.after.birthday : "" }}</div>
                            </div>
                            <div v-else-if="props.row.type == 6">
                                <div>--</div>
                            </div>
                            <div v-else> {{ props.row.after }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" prop="create_time" align="center">
                        <template #default="props">
                            {{ dateFtt('yyyy-mm-dd hh:MM:ss', props.row.create_time * 1000) }}
                        </template>
                    </el-table-column>
                </el-table>
                <elc-pagination class="dialogPagination" v-model:current-page="logDialoPageQuery.page"
                    v-model:page-size="logDialoPageQuery.perPage" :page-sizes="[5]"
                    layout="total,sizes, prev, pager, next, jumper" :total="logDialoPageQuery.total"
                    @current-change="handleLogDialogCurrentChange" />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button size="large" type="info" @click="logDialogVisible = false">关闭</el-button>
                </div>
            </template>
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
    <custom-dialog v-model="deviceDataDialogVisible" append-to-body class="_loading" title="设置阈值" :show-close="false"
        :width="`${(712 / 1920) * 100}%`" top="25vh">
        <div class="form_box config_form_width">
            <el-form :model="device_data" :rules="deviceDataFormRules" label-width="auto" ref='deviceDataForm'
                label-position="right">
                <div class="device_data_title">心率预警阈值</div>
                <el-form-item label="最高心率" prop="high_heartrate_value">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="19">
                                <el-input oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                    v-model="device_data.high_heartrate_value" placeholder="请输入"></el-input>
                            </el-col>
                            <el-col :span="5" style="padding-left: 1em">
                                <span>bpm</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="device_data.high_heartrate_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>高心率报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="最低心率" prop="low_heartrate_value">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="19">
                                <el-input oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                    v-model="device_data.low_heartrate_value" placeholder="请输入"></el-input>
                            </el-col>
                            <el-col :span="5" style="padding-left: 1em">
                                <span>bpm</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="device_data.low_heartrate_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>低心率报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <div class="device_data_title">血氧预警阈值</div>
                <el-form-item label="最低血氧" prop="spo2">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="20">
                                <el-input oninput="if(value.length>10)value=value.slice(0,10)" maxlength="10"
                                    v-model="device_data.spo2" placeholder="请输入"></el-input>
                            </el-col>
                            <el-col :span="4" style="padding-left: 1em">
                                <span>%</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="device_data.low_spo_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>低血氧报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <div class="device_data_title">数据频率设置</div>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item label="采集频率">
                            <el-select v-model="device_data.ppg">
                                <el-option v-for="(item, index) in ppg_list" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="上传频率">
                            <el-select v-model="device_data.normal_rate" v-if="device_data.ppg == 300">
                                <el-option v-for="(item, index) in normal_rate_list_1" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <el-select v-model="device_data.normal_rate" v-else>
                                <el-option v-for="(item, index) in normal_rate_list_2" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="setTips">设置成功后，{{ device_data.normal_rate * device_data.ppg / 60 }}分钟后生效</div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="deviceDataDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitDeviceData()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import type { LogDialogTableItem, Pagination, PatientForm, PatientTableItem, PatientTableQueryData, SelectBedList } from '@/interface/interface';
import { computed, nextTick, onMounted, provide, reactive, ref } from 'vue';
import { dateFtt } from '@/utils/date/dateFtt';
import PatientApi from '@/api/patient';
import { ElLoading, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import BedApi from '@/api/bed';
import { nationalityOptions, languagesOptions } from '@/utils/baseOptions/baseOptions';
import { idCard_reg } from '@/utils/validate/idCard';
import { phone_reg } from '@/utils/validate/phone';
import BedDetail from '@/components/BedDetail.vue'
// 床位item点击
const handleBedItem = ref<any>({})
const showDetail = ref(false)
const handleBedDetail = (item: any) => {
    // if (item.use == 2) {
        handleBedItem.value = item
        showDetail.value = true
    // }
}
const closeDetail = () => {
    handleBedItem.value = {}
    showDetail.value = false
}

// 搜索
const search_form = reactive({
    name: '',
    ccid: "",
    bed_number: "",
    group_status: '',
})
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
const reset = () => {
    search_form.name = ''
    search_form.ccid = ''
    search_form.bed_number = ''
    search_form.group_status = ''
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
let tableData = reactive<PatientTableItem[]>([])
const fetchData = async () => {
    tableLoading.value = true
    let data: PatientTableQueryData = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        bed_number: search_form.bed_number,
        name: search_form.name,
        ccid: search_form.ccid,
        group_status: search_form.group_status,
    }
    const result = (await PatientApi.getPatientList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }
}


const toLeave = (item: any) => {
     patientForm.id = item.id
    patientForm.ccid = item.ccid
    patientForm.bed_id = item.bed_id
    patientForm.status = item.status;
    leaveDialogVisible.value = true;
}

// 表单编辑状态 
const patientFormDisabled = ref<boolean>(false)

// 表单：新增/修改
const patientForm = reactive<PatientForm>({
    name: '',
    birthday: "",
    start: '',
    sex: "",
    nationality: "",
    id_card: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    emergency_relation: "",
    language: "",
    department: "",
    medical_record_number: "",
    responsible_doctor: "",
    illness: "",
    level_of_care: "",
    precautions: "",
    department_in_time: '',
    responsible_nurse: "",
    medication_info: "",
    patient_num: "",
    end: "",
    language_other: "",
    situation: "",
    bed_id: '',
})
const patientDialogTitle = ref('新增人员档案')
const hzData = ref<any>({})
const hzLoading = ref<boolean>(false)
const title_hz_item_picth = ref<number>(0);
const hzItemPicth = async (key: number) => {
    title_hz_item_picth.value = key
   
    if(key==1){
        hzLoading.value = true
        const data = {
            id:patientForm.id
        }
        const result = (await PatientApi.visit_message(data))
        hzData.value = result.data.result
        hzLoading.value = false
      
    }
}
const checkIdCard = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (value && !idCard_reg.test(value)) {
            callback(new Error('身份证号格式不正确'))
        } else {
            callback()
        }
    }, 200);
}

const checkPhone = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (value && !phone_reg.test(value)) {
            callback(new Error('手机号格式不正确'))
        } else {
            callback()
        }
    }, 200);
}
const patientFormRules = reactive<FormRules<typeof patientForm>>({
    name: [
        { required: true, message: "请输入姓名", trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: "请选择出生日期", trigger: 'blur' }
    ],
    start: [
        { required: true, message: "请选择入院时间", trigger: 'blur' }
    ],
    patient_num: [
        { required: true, message: "请选择住院号", trigger: 'blur' }
    ],
    id_card: [
        { validator: checkIdCard, trigger: 'blur' }
    ],
    emergency_phone: [
        { validator: checkPhone, trigger: 'blur' }
    ],
    situation: [
        { required: true, message: "请选择病情状态", trigger: 'change' }
    ],
    level_of_care: [
        { required: true, message: "请选择护理等级", trigger: 'change' }
    ]
})
const patientDialogVisible = ref<boolean>(false)

const addPatient = () => {
    patientForm.id && delete patientForm.id
    patientDialogTitle.value = '新增人员档案'
    patientFormDisabled.value = false
    for (const key in patientForm) {
        if (Object.prototype.hasOwnProperty.call(patientForm, key)) {
            patientForm[key] = ''
        }
    }
    patientForm.start = dateFtt('yyyy-mm-dd hh:MM:ss', new Date().getTime())
    patientDialogVisible.value = true
    title_hz_item_picth.value = 0
    nextTick(() => {
        const formEL = patientFormRef.value
        if (!formEL) return
        formEL.clearValidate()
    })
}
const editPatient = (item: PatientTableItem) => {
    patientForm.id = item.id
    patientForm.ccid = item.ccid
    patientForm.bed_id = item.bed_id
    patientForm.status = item.status
    patientForm.end = item.end
    patientForm.return_visit = item.return_visit
    patientDialogTitle.value = '编辑人员档案'
    patientFormDisabled.value = true
    for (const key in patientForm) {
        if (Object.prototype.hasOwnProperty.call(patientForm, key)) {
            patientForm[key] = item[key]
        }
    }
    let flag = true
    languagesOptions.forEach(item => {
        if (item == patientForm.language || patientForm.language == '') {
            flag = false
        }
    })
    if (!patientForm.sex) {
        patientForm.sex = ''
    }
    if (!patientForm.level_of_care) {
        patientForm.level_of_care = ''
    }

    if (flag) {
        patientForm.language_other = patientForm.language
        patientForm.language = '其他'
    }
    patientForm.start = patientForm.start
    patientDialogVisible.value = true
    title_hz_item_picth.value = 0
    nextTick(() => {
        const formEL = patientFormRef.value
        if (!formEL) return
        formEL.clearValidate()
    })
}

const patientFormRef = ref<FormInstance>();
let editloading = ref<boolean>(false)
const edItForm = async (e:any) => {
     let data = Object.assign({}, e)
            if (data.language_other) {
                data.language = data.language_other
                delete data.language_other
            }
           try {
                const result = await PatientApi.editPatient(e)
                if (result) {
                    ElMessage.success('操作成功');
                    // Formloading.close()
                    // patientDialogVisible.value = false
                    reset()
                }
                editloading.value = false;
            } catch (error) {
                // Formloading.close()
                 editloading.value = false;
            }
}
  provide("loading", editloading)

const submitForm = (e?:any) => {
    const formEl = patientFormRef.value //elform实例
    if (!formEl) return
    formEl.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let data = Object.assign({}, patientForm);
            data.plan_end = data.end;
            delete data.end;
            if (data.language_other) {
                data.language = data.language_other
                delete data.language_other
            }
            try {
                const result = patientDialogTitle.value == '新增人员档案' ? await PatientApi.addPatient({...data,
                     group_start: dateFtt("yyyy-mm-dd hh:MM:ss")
                }) : await PatientApi.editPatient(data)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    patientDialogVisible.value = false
                    reset()
                }
            } catch (error) {
                Formloading.close()
            }
        } else {
            // Formloading.close()
        }
    })
}

const birthdayPick = (date: Date) => {
    if (date > new Date()) {
        return true
    } else {
        return false
    }
}
// const patinetFormAge = computed(() => {
//     return new Date().getFullYear() - (new Date(patientForm.birthday).getFullYear())
// })

// 手术时间
const operationTimeForm = reactive({
    id: 0,
    operation_start: '',
    operation_end: '',
})
const operationTimeDialogVisible = ref<boolean>(false)
const operationTimeBtnVisible = ref<boolean>(false)
const operationTimeRules = reactive<FormRules>({
    operation_start: [{ required: true, message: "请选择手术开始时间", trigger: 'blur' }],
    operation_end: [{ required: true, message: "请选择手术结束时间", trigger: "blur" }],
})

const operationTime = (item: PatientTableItem) => {
    operationTimeDialogVisible.value = true;
    operationTimeForm.id = item.id;
    if (item.operation_start && item.operation_end) {
        operationTimeBtnVisible.value = false
        operationTimeForm.operation_start = dateFtt('yyyy-mm-dd hh:MM:ss', item.operation_start * 1000);
        operationTimeForm.operation_end = dateFtt('yyyy-mm-dd hh:MM:ss', item.operation_end * 1000);
    } else {
        operationTimeForm.operation_start = '';
        operationTimeForm.operation_end = '';
        operationTimeBtnVisible.value = true
    }

}
const editOperationTimeFormRef = ref<FormInstance>()
const submitOperationTimeForm = () => {
    const formEl = editOperationTimeFormRef.value //elform实例

    if (!formEl) return
    formEl.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let start = new Date(Date.parse(operationTimeForm.operation_start.replace(/-/g, "/")))
            let end = new Date(Date.parse(operationTimeForm.operation_end.replace(/-/g, "/")))
            let data = {
                id: operationTimeForm.id,
                operation_start: start.getTime() / 1000,
                operation_end: end.getTime() / 1000,
            }
            try {
                const result = await PatientApi.add_operation(data)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    operationTimeDialogVisible.value = false
                    fetchData()
                }
            } catch (error) {
                Formloading.close()
            }

        }
    })
}
const submitOperationTimeFormedit = () => {
    const formEl = editOperationTimeFormRef.value //elform实例

    if (!formEl) return
    formEl.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let start = new Date(Date.parse(operationTimeForm.operation_start.replace(/-/g, "/")))
            let end = new Date(Date.parse(operationTimeForm.operation_end.replace(/-/g, "/")))
            let data = {
                id: operationTimeForm.id,
                operation_start: start.getTime() / 1000,
                operation_end: end.getTime() / 1000,
            }
            try {
                const result = await PatientApi.edit_operation(data)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    operationTimeDialogVisible.value = false
                    fetchData()
                }
            } catch (error) {
                Formloading.close()
            }

        }
    })
}

const fzsjbor = ref<boolean>(false)
const fzForm = ref<any>({
    fzsjvalue:''
})

const limitTime = (time: any) => {
    var date = new Date()  //当前日期2021-3-9
    var fff = new Date(date.setDate(date.getDate()))
    return time.getTime() < fff
}
const limitTime2 = (time: any) => {
    if(patientForm.end){
        const aaa = patientForm.end.replace(/\-/g,'/')
        var date = new Date(Date.parse(aaa))  //当前日期2021-3-9
        var fff = new Date(date.setDate(date.getDate()))
        return time.getTime() < fff
    }
    
   

}
const isfzsjbor = ()=>{
    
    const date = new Date()  
    const fff =  new Date(date.setDate(date.getDate() + 31)).toLocaleDateString()
    const aaa = fff.replace(/\//g,'-')
    const arr:Array<[]> = []
     aaa.split('-').forEach((res:any)=>{
        if(res<=9){
            res = '0'+ res  
        }
        arr.push(res)
    })
    fzForm.value.fzsjvalue = arr.join('-')
    fzsjbor.value = true
}

const setfzsj = async()=> {
    const data = {
        id:patientForm.id,
        return_visit: fzForm.value.fzsjvalue
    }
    const result = (await PatientApi.return_visit(data))
    if (result) {
            ElMessage.success('操作成功')
            fzsjbor.value = false
            patientHospital()
    }
}


let leaveDialogVisible = ref(false);
let leaveTime = ref('');
const confirmLeave   = async() => {
     if(!leaveTime.value){
        return ElMessage.error('请选择离院时间')
     }
     const Formloading = ElLoading.service({
        target: '._loading'
    })
    let data = {
        id: patientForm.id,
        end: dateFtt('yyyy-mm-dd hh:MM:ss', new Date(leaveTime.value).getTime()),
        status: 2,
        ccid: patientForm.ccid,
        bed_id: patientForm.bed_id,
    }
    const result = (await PatientApi.editOutHospitalNew(data))
    if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            leaveDialogVisible.value = false
            fetchData()
    }
}


// 患者出院
const patientHospital = async () => {
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    let data = {
        id: patientForm.id,
        plan_end: dateFtt('yyyy-mm-dd hh:MM:ss', new Date().getTime()),
        status: 2,
        ccid: patientForm.ccid,
        bed_id: patientForm.bed_id,
    }
    const result = (await PatientApi.editOutHospitalNew(data))
    if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            patientDialogVisible.value = false
            fetchData()
    }

}

// 床位信息
const editPatientBedForm = reactive({
    id: 0,
    bed_id: '',
    old_bed_id: '',
    old_bed_number: ""
})
const editPatientBedDialogVisible = ref<boolean>(false)
const editPatientBedFormRules = reactive<FormRules>({
    bed_id: [{ required: true, message: "请选择床位", trigger: "blur" }]
})


const bed_list = reactive<SelectBedList>({
    list: []
})

const editPatientBedFormRef = ref<FormInstance>()
const editPatientBed = async (item: PatientTableItem) => {
    editPatientBedForm.id = item.id
    editPatientBedForm.bed_id = ''
    editPatientBedForm.old_bed_id = item.bed_id
    editPatientBedForm.old_bed_number = item.bed_number
    editPatientBedDialogVisible.value = true
    bed_list.list = (await BedApi.getBedList({ page: 1, perPage: 999, use: 1 })).data.result.data
    nextTick(() => {
        const formEL = editPatientBedFormRef.value
        if (!formEL) return
        formEL.clearValidate()
    })
}

const submitPatientBedForm = () => {
    const formEl = editPatientBedFormRef.value //elform实例
    if (!formEl) return
    formEl.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let data = {
                id: editPatientBedForm.id,
                bed_id: editPatientBedForm.bed_id,
                old_bed_id: editPatientBedForm.old_bed_id,
            }
            try {
                const result = await PatientApi.editPatientBed(data)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    editPatientBedDialogVisible.value = false
                    fetchData()
                }
            } catch (error) {
                Formloading.close()
            }

        }
    })
}
const unbindPatientBed = async () => {
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    let data = {
        id: editPatientBedForm.id,
        bed_id: '',
        old_bed_id: editPatientBedForm.old_bed_id,
    }
    try {
        const result = await PatientApi.editPatientBed(data)
        if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            editPatientBedDialogVisible.value = false
            fetchData()
        }
    } catch (error) {
        Formloading.close()
    }


}
// 患者操作日志
const logDialogVisible = ref(false)
let logDialogTableData = reactive<LogDialogTableItem[]>([])
const logDialoPageQuery = reactive<Pagination>({
    perPage: 5,
    page: 1,
    total: 0
})

const handleLogDialogCurrentChange = (val: number) => {
    logDialoPageQuery.page = val
    fetchData()
}
const logDialogSearchForm = reactive({
    type: 0,
    before: "",
    after: ""
})
const logDialogSearch = () => {
    logDialoPageQuery.page = 1
    logDialoPageQuery.perPage = 10
    fetchPatientLogData()
}
const logDialogReset = () => {
    logDialogSearchForm.type = 0
    logDialogSearchForm.before = ''
    logDialogSearchForm.after = ''
    logDialoPageQuery.page = 1
    logDialoPageQuery.perPage = 10
    fetchPatientLogData()
}
const logPatientInfo = reactive({
    patient_id: 0,
    name: "",
    birthday: ""
})
const logDialogTableLoading = ref(false)
const openLogDetail = (item: PatientTableItem) => {
    logPatientInfo.patient_id = item.id
    logPatientInfo.name = item.name
    logPatientInfo.birthday = item.birthday
    logDialogSearchForm.type = 0
    logDialogSearchForm.before = ''
    logDialogSearchForm.after = ''
    logDialogVisible.value = true
    fetchPatientLogData()
}
const editTypes = reactive(['全部', '新建档案', '更换基础信息', '分配设备', '更换设备', '解绑设备', '出院'])
const fetchPatientLogData = async () => {
    logDialogTableLoading.value = true
    let data = {
        patient_id: logPatientInfo.patient_id,
        type: logDialogSearchForm.type ? logDialogSearchForm.type : '',
        before: logDialogSearchForm.before,
        after: logDialogSearchForm.after,
        perPage: logDialoPageQuery.perPage,
        page: logDialoPageQuery.page
    }
    const result = (await PatientApi.getPatientLogList(data)).data.result
    if (result) {
        logDialogTableData = result.data
        logDialoPageQuery.total = result.total
        logDialogTableData.forEach((item, index) => {
            if (item.type === 2) {
                logDialogTableData[index]!.before = JSON.parse(item.before)
                logDialogTableData[index]!.after = JSON.parse(item.after)
            }
        })
        logDialogTableLoading.value = false
    }

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
const bindDailogVisible = ref(false)
const bindPatient = reactive({
    ccid: "",
    patient_id: 0
})
const openBindDialog = (item: PatientTableItem) => {
    bindPatient.ccid = item.ccid
    bindPatient.patient_id = item.id
    fetchUnBindCcidList()
    chooseBindCcid.value = ''
    bindDailogVisible.value = true
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
const unbindCcid = (item: any) => {
    ElMessageBox.confirm(
        `是否将设备${item.ccid}与该人员进行解绑？`,
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
            let data = { ccid: item.ccid, bind: 2, patient_id: item.id }
            const result = await PatientApi.editBedDevice(data)
            if (result) {
                ElMessage({
                    type: 'success',
                    message: '操作成功',
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

// 设置阈值
const device_data = reactive<any>({
    ccid: '',
    low_heartrate_value: '',
    high_heartrate_value: '',
    spo2: '',
    ppg: "",
    normal_rate: "",
    low_heartrate_time: 10,
    high_heartrate_time: 10,
    low_spo_time: 10,
})

const ppg_list = [
    {
        label: "5分钟",
        value: 300
    },
    {
        label: "10分钟",
        value: 600
    }
]
const normal_rate_list_1 = [
    {
        label: "10分钟",
        value: 2
    },
    {
        label: "15分钟",
        value: 3
    },
    {
        label: "20分钟",
        value: 4
    },
    {
        label: "25分钟",
        value: 5
    },
    {
        label: "30分钟",
        value: 6
    },
]
const normal_rate_list_2 = [
    {
        label: "20分钟",
        value: 2
    },
    {
        label: "30分钟",
        value: 3
    },
    {
        label: "40分钟",
        value: 4
    },
    {
        label: "50分钟",
        value: 5
    },
    {
        label: "60分钟",
        value: 6
    },
]
const deviceDataDialogVisible = ref(false)
const deviceDataForm = ref<FormInstance>()
const checkLow = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('请输入范围在30-60之间的整数'))
        } else {
            if (value < 30 || value > 60) {
                callback(new Error('请输入范围在30-60之间的整数'))
            } else {
                callback()
            }
        }
    }, 200)
}
const checkHigh = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('请输入范围在80-160之间的整数'))
        } else {
            if (value < 80 || value > 160) {
                callback(new Error('请输入范围在80-160之间的整数'))
            } else {
                callback()
            }
        }
    }, 200)
}
const checkSpo2 = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('请输入范围在70-99之间的整数'))
        } else {
            if (value < 70 || value > 99) {
                callback(new Error('请输入范围在70-99之间的整数'))
            } else {
                callback()
            }
        }
    }, 200)
}
const deviceDataFormRules = reactive<FormRules>({
    high_heartrate_value: [
        { validator: checkHigh, trigger: 'blur' }
    ],
    low_heartrate_value: [
        { validator: checkLow, trigger: 'blur' }
    ],
    spo2: [
        { validator: checkSpo2, trigger: 'blur' }
    ]
})


// 脱组
const unDialogVisible = ref(false)
const unId = ref<number>(0)
const unSubmitOperation = async () => {
    let data = { id: unId.value }
    const result = await PatientApi.editOutGroup(data)
    if (result) {
        ElMessage({
            type: 'success',
            message: '操作成功',
        })
        fetchData()
    }
    unDialogVisible.value = false
}
const unSet = (item: PatientTableItem) => {
    unDialogVisible.value = true
    unId.value = item.id
    // ElMessageBox.confirm(
    //     `是否将该患者进行脱组？`,
    //     '解绑设备',
    //     {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //         showClose: false,
    //         confirmButtonClass: "delete_btn",
    //     }
    // )
    //     .then(async () => {
    //         let data = { id: item.id }
    //         const result = await PatientApi.editOutGroup(data)
    //         if (result) {
    //             ElMessage({
    //                 type: 'success',
    //                 message: '操作成功',
    //             })
    //             fetchData()
    //         }
    //     })
    //     .catch(() => {
    //         ElMessage({
    //             type: 'info',
    //             message: '操作取消',
    //         })
    //     })
}



const openDeviceDataDialog = (item: PatientTableItem) => {
    device_data.low_heartrate_value = item.low_heartrate_value
    device_data.high_heartrate_value = item.high_heartrate_value
    device_data.low_heartrate_time = item.low_heartrate_time
    device_data.high_heartrate_time = item.high_heartrate_time
    device_data.low_spo_time = item.low_spo_time
    device_data.spo2 = item.spo2
    device_data.ccid = item.ccid
    device_data.ppg = item.ppg

    device_data.normal_rate = item.normal_rate
    deviceDataDialogVisible.value = true
    nextTick(() => {
        const formEL = deviceDataForm.value
        if (!formEL) return
        formEL.clearValidate()
    })
}
const submitDeviceData = () => {
    const formEL = deviceDataForm.value
    if (!formEL) return
    formEL.validate(async (valid) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            try {
                const result = await PatientApi.setDeviceData(device_data)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    deviceDataDialogVisible.value = false
                    fetchData()
                }
            } catch (error) {
                Formloading.close()
            }

        }
    })
}



onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.ccid {
    width: 180px
}


.customModal{
    position: fixed;
    width: 100%;
    height: 100vh;
    inset: 0;
    background-color: rgba(0, 0, 0, .4);
    /* backdrop-filter: blur(20px); */
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;
}
.headerBox{
    background-color: #F5F7FB;
    padding: 0px 20px;
    height: 80px;
    font-weight: bold;
    font-size: 24px;
    color: #384951;
    border-radius: 10px 10px 0px 0px;
    line-height: 80px;
}
.customModal .dialog_box{
     width: 80%;
     height: auto;
     background-color: #fff;
     border-radius: 10px;
     position: relative;
      z-index: 9999;
}
.dialog-footer{
    height: 80px;
    line-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.form-container{
  will-change: transform;
  contain: layout style paint;
}

.search_label{
   flex-shrink: 0 !important;
}
.elSelect{
    width: 100px;
}
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

:deep(.date_input_width .el-input__wrapper){
    height: 40px;
    background-color: #F5F7FB;
    box-shadow: none;
    border: none; 
}



:deep(.el-input){
    height: 40px !important;
}
:deep(.el-form-item__label){
    position: relative;
}
:deep(.info-col-left .el-form-item__label::before){
    position: absolute;
    top: 0;
    left: -20px;
}
:deep(.el-form-item__label-wrap){
    height: 40px;
    display: flex;
    align-items: center;
}

.un_leave{
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.age {
    font-size: 12px;
}

.logDailogContent {
    padding: 24px;
}

.logDailogPatientInfoBox {
    height: 48px;
    line-height: 48px;
    background: #F5F7FB;
    border-radius: 8px;
    padding: 0 24px;
    color: #636676;
    font-size: 16px;
}

.logDailogPatientInfoBox div {
    width: 50%;
    position: relative;
    padding-left: 14px;
}

.logDailogPatientInfoBox div::before {
    content: '*';
    color: red;
    position: absolute;
    top: 2px;
    left: 0;
}

.dialogPagination {
    justify-content: center;
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
    overflow-y: scroll;
}
.flexbox .el-button+.el-button
 {
    margin-left: 0;
}
.flexbox{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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

.device_data_title {
    height: 24px;
    font-weight: bold;
    font-size: 16px;
    color: #384951;
    line-height: 24px;
    margin-bottom: 10px;
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

.setTips {
    text-align: center;
}

.config_form_width {
    width: 80% !important;
}

.config_select_width {
    width: 130px;
}

.un_box {
    text-align: center;
    margin: 50px;
}

.title_hz {
    height: 40px;
    background: #E6FDED;
    border-radius: 0px 0px 0px 0px;
    display: flex;
    align-items: center;

}

.title_hz_item {
    width: 184px;
    height: 40px;
    /* background: #00B528; */
    border-radius: 0px 0px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.title_hz .title_hz_item_picth {
    width: 184px;
    height: 40px;
    background: #00B528;
    border-radius: 0px 0px 0px 0px;
    color: #fff;
}

.sfxx {
    height: 357px;
    padding: 48px 60px;

}

.sfxx_item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #636676;
    margin-bottom: 20px;
}
.patient_management_box{
    padding: 24px;
}
</style>

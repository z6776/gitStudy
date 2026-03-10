<template>
  <div class="p-[20px]">
    <div class="bg-#fff flex_space_between rounded-12px mb-20px search_box">
      <div class="flex_start gap-12px">
        <div class="search_item flex_start">
          <div class="search_label">姓名：</div>
          <div>
            <el-input
              size="large"
              v-model="search_form.patient_name"
              placeholder="请输入"
            ></el-input>
          </div>
        </div>
        <div class="search_item flex_start">
          <div class="search_label">住院号：</div>
          <div>
            <el-input
              size="large"
              v-model="search_form.patient_num"
              placeholder="请输入"
            ></el-input>
          </div>
        </div>
        <div class="search_item flex_start">
          <div class="search_label">是否离院：</div>
          <div class="select_width">
            <el-select v-model="search_form.end_type" size="large">
              <el-option key="0" value="1" label="是"></el-option>
              <el-option key="1" value="0" label="否"></el-option>
            </el-select>
          </div>
        </div>
        <div class="search_btn_box">
          <el-button type="primary" size="large" @click="search">查询</el-button>
          <el-button type="info" size="large" @click="reset">重置</el-button>
        </div>
      </div>
      <div>
        <div class="search_btn_box">
          <el-button
            :type="search_form.visit ? 'primary' : 'info'"
            size="large"
            @click="changeVisitBtn"
            >待回访 {{ visitCount }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="table_box">
      <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
        <el-table-column prop="patient_name" label="患者姓名" align="center"></el-table-column>
        <el-table-column prop="birthday" label="年龄" align="center"></el-table-column>
        <el-table-column prop="patient_num" label="住院号" align="center"></el-table-column>

        <!-- <el-table-column prop="emergency_contact" label="紧急联系人" align="center">
                    <template #default="props">
                        {{ props.row.emergency_contact ? props.row.emergency_contact : '--' }}
                    </template>
</el-table-column> -->
        <el-table-column prop="emergency_phone" label="联系人电话" align="center">
          <template #default="props">
            {{ props.row.emergency_phone ? props.row.emergency_phone : '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="随访时间" align="center"></el-table-column> -->
        <!-- <el-table-column prop="situation" label="随访情况" align="center"></el-table-column> -->
        <el-table-column prop="end_type" label="是否离院" align="center"></el-table-column>
        <el-table-column prop="sex_name" label="性别" align="center"></el-table-column>
        <!-- <el-table-column prop="emergency_relation" label="联系人关系" align="center">
                    <template #default="props">
                        {{ props.row.emergency_relation ? props.row.emergency_relation : '--' }}
                    </template>
                </el-table-column> -->
        <el-table-column label="操作" align="center" width="200">
          <template #default="props">
            <el-button type="primary" color="#0076F6" @click="getSuidata(props.row)" plain
              >随访</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <elc-pagination
        v-model:current-page="pageQuery.page"
        v-model:page-size="pageQuery.perPage"
        :page-sizes="[10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageQuery.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!-- 随访弹窗 -->
  <custom-dialog
    v-model="bor"
    append-to-body
    class="_loading"
    title="随访"
    :width="`${(835 / 1920) * 100}%`"
    top="10vh"
  >
    <div class="dia_con" v-if="suiList.length > 0" v-loading="sfLoading">
      <div class="dia_l">
        <div
          @click="getSuiDetails(val.id)"
          :class="`item ${val.id == suiPitchId ? 'pitch' : ''}`"
          v-for="(val, key) in suiList"
          :key="val"
        >
          <div class="text">
            {{ val.addtime }}
          </div>
        </div>
        <div class="item_btn" @click="sfbor">
          <div class="text flex justify-center items-center">
            <img src="@/assets/images/V2/add.png" class="w-12px h-12px" alt="" />
          </div>
          <span> 添加随访 </span>
        </div>
      </div>
      <div class="dia_r">
        <div class="dia_r_box">
          <el-form
            style="width: 100%"
            :model="suiItem"
            v-loading="suiItembor"
            :label-position="'left'"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="随访日期:">
                  <div v-if="suiItem.start">{{ suiItem.start || '--' }}</div>
                  <div v-else>无</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否联系上患者:">
                  <div>{{ suiItem.is_connect == '1' ? '已联系上' : '未联系上' }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="患者姓名:">
                  <div>{{ suiItem.name || '--' }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="CCID:">
                  <div>{{ suiItem.ccid || '--' }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系方式:">
                  <div>{{ suiItem.phone || '--' }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出院时间:">
                  <div>{{ suiItem.end || '--' }}</div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="患者反馈:">
              <div v-if="suiItem.fkadd.length >= 1" style="width: 100%">
                <el-table :data="suiItem.fkadd" border style="width: 100%" size="large">
                  <el-table-column prop="zz" label="症状" align="center">
                    <template #default="props">
                      <div class="table_height">{{ props.row.zz }}</div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="time" label="时间" align="center"></el-table-column> -->
                  <el-table-column prop="cl" label="记录" align="center">
                    <template #default="props">
                      <div class="table_height">{{ props.row.cl }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="zg" label="随访情况" align="center">
                    <template #default="props">
                      {{ props.row.zg == 1 ? '良好' : props.row.zg == 2 ? '异常' : '--' }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div v-else>无</div>
            </el-form-item>
            <el-form-item label="医嘱及建议:" class="aligntop">
              <div v-if="suiItem.yztext">{{ suiItem.yztext }}</div>
              <div v-else>无</div>
            </el-form-item>
            <el-form-item label="并发症:" class="aligntop">
              <div v-if="suiItem.checkData || suiItem.fenj">
                <span v-if="suiItem.checkData">{{ checkDataFilter(suiItem.checkData) }}</span>
                <span v-if="suiItem.fenj">{{ fenjiListFilter(suiItem.fenj) }}</span>
              </div>
              <div v-else>无</div>
            </el-form-item>
            <el-form-item label="手表数据:" class="aligntop">
              <div v-if="suiItem.sbData">
                {{
                  `心率 ${suiItem.sbData.xl ? suiItem.sbData.xl : '--'} bpm，血氧
                                ${suiItem.sbData.xy ? suiItem.sbData.xy : '--'} %`
                }}
              </div>
              <div v-else>无</div>
            </el-form-item>
            <el-form-item label="最新操作时间:" class="aligntop">
              <div v-if="suiItem.updated_at">{{ suiItem.updated_at }}</div>
              <div v-else>无</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="dia_r_b">
          <el-button type="primary" @click="bianji">编辑</el-button>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center" v-else v-loading="sfLoading">
      <img src="@/assets/images/nodata2.png" alt="" />
      <div class="nodata_add">尚未对该患者进行随访</div>
      <div class="mb-48px">
        <el-button type="primary" class="h-48px mt-12px" @click="sfbor">添加随访</el-button>
      </div>
    </div>
  </custom-dialog>

  <!-- 新增随访弹窗 -->
  <custom-dialog
    v-model="addSuibor"
    append-to-body
    class="_loading"
    title="随访"
    :width="`${(1540 / 1920) * 100}%`"
    top="2vh"
  >
    <div class="dialog_flex">
      <div class="addsui">
        <el-form
          ref="addFormRef"
          :rules="editPatientBedFormRules"
          label-position="top"
          label-width="auto"
          :model="addForm"
        >
          <el-form-item label="随访日期:" prop="start" class="sss">
            <el-date-picker
              class="patient_input_width1"
              v-model="addForm.start"
              type="datetime"
              @change="changeAddDate"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="是否联系上患者:" prop="start" class="sss">
            <el-radio-group v-model="addForm.is_connect" style="--el-color-primary: #07c160">
              <el-radio label="1" size="large">已联系上</el-radio>
              <el-radio label="0" size="large">未联系上</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="患者反馈:" prop="fkadd" label-position="top">
            <div class="fk_box" v-for="(val, key) in addForm.fkadd" :key="key">
              <div class="item">
                <div class="item_leb textright">症状：</div>
                <div class="item_inp">
                  <el-input
                    class="patient_input_width1"
                    maxlength="500"
                    type="textarea"
                    :rows="3"
                    v-model="val.zz"
                    placeholder="请输入"
                  ></el-input>
                </div>
              </div>
              <!-- <div class="item">
                                    <div class="item_leb">
                                        时间：
                                    </div>
                                    <div class="item_inp ">
                                        <el-date-picker class="patient_input_width1" v-model="val.time" type="datetime"
                                            placeholder="请选择" format="YYYY-MM-DD HH:mm:ss"
                                            value-format="YYYY-MM-DD HH:mm:ss" />
                                    </div>
                                </div> -->
              <div class="item">
                <div class="item_leb textright">记录：</div>
                <div class="item_inp">
                  <!-- <el-input class="patient_input_width1" maxlength="10" type="text" v-model="val.cl"
                                            placeholder="请输入"></el-input> -->
                  <el-input
                    class="patient_input_width1"
                    maxlength="500"
                    type="textarea"
                    :rows="5"
                    v-model="val.cl"
                    placeholder="请输入"
                  ></el-input>
                </div>
              </div>

              <div class="item">
                <div class="item_leb textright">随访情况：</div>
                <div class="item_inp">
                  <el-select class="patient_input_width1" v-model="val.zg" placeholder="请选择">
                    <el-option :value="1" label="良好"></el-option>
                    <el-option :value="2" label="异常"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <div class="item_leb textright">睡眠分数：</div>
                <div class="item_inp" :class="{ errorinput: val.requireSleepTtscore }">
                  <!-- <el-input class="patient_input_width1" maxlength="10" type="text" v-model="val.cl"
                                            placeholder="请输入"></el-input> -->
                  <el-input
                    class="patient_input_width1"
                    type="text"
                    v-model="val.sleep_number"
                    placeholder="请输入0-10"
                    :input-style="val.requireSleepsmScore ? 'color:#ff0000;' : ''"
                  ></el-input>
                  <div v-if="val.requireSleepsmScore" class="error_text">请输入对应数字</div>
                </div>
                <div class="ml10px">分</div>
              </div>
              <div class="item">
                <div class="item_leb textright">疼痛分数：</div>
                <div class="item_inp" :class="{ errorinput: val.requireSleepTtscore }">
                  <!-- <el-input class="patient_input_width1" maxlength="10" type="text" v-model="val.cl"
                                            placeholder="请输入"></el-input> -->
                  <el-input
                    class="patient_input_width1"
                    type="text"
                    v-model="val.pain_number"
                    placeholder="请输入0-10"
                    :input-style="val.requireSleepTtscore ? 'color:#ff0000;' : ''"
                  ></el-input>
                  <div v-if="val.requireSleepTtscore" class="error_text">请输入对应数字</div>
                </div>
                <div class="ml10px">分</div>
              </div>
              <div class="deit" v-if="key != 0">
                <el-button type="primary" color="#F7413D" @click="editFk(key as number)"
                  >删除</el-button
                >
              </div>
            </div>
          </el-form-item>
          <div class="item_btn left w-fit-content" @click="addfk">
            <div class="text flex justify-center items-center">
              <img src="@/assets/images/V2/add.png" class="w-12px h-12px" alt="" />
            </div>
            <span> 添加反馈 </span>
          </div>
          <el-form-item label="医嘱及建议:" prop="yztext">
            <el-input
              class="patient_input_width2"
              maxlength="200"
              type="textarea"
              :rows="5"
              v-model="addForm.yztext"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="并发症（多选）:" prop="checkData">
            <el-checkbox-group v-model="addForm.checkData">
              <el-checkbox
                v-for="(val, key) in checkLists"
                :key="key"
                :label="val.label"
                :value="val.value"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="并发症分级:" class="sss" prop="fenj">
            <el-select class="patient_input_width1" v-model="addForm.fenj" placeholder="请选择">
              <el-option
                v-for="(value, key) in fenjiList"
                :key="key"
                :value="value"
                :label="value.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="手表数据:" class="" prop="sbData">
            <div class="item _item flex items-center">
              <div class="item_leb">心率：</div>
              <div class="item_inp">
                <el-form-item label="" class="" prop="sbData.xl">
                  <el-input
                    class="patient_input_width3"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    type="number"
                    v-model="addForm.sbData.xl"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="item_leb">bpm</div>
            </div>
            <div class="item flex items-center">
              <div class="item_leb">血氧：</div>
              <div class="item_inp">
                <el-form-item label="" class="" prop="sbData.xy">
                  <el-input
                    class="patient_input_width3"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    type="number"
                    v-model="addForm.sbData.xy"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="item_leb">%</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog_right">
        <div class="right_title">近七日佩戴情况</div>
        <el-table
          :data="wearDataList"
          border
          size="large"
          style="width: 100%"
          v-loading="wearLoading"
        >
          <el-table-column label="日期" align="center" width="100px">
            <template #default="prop">
              <div>{{ prop.row.text }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="item"
            align="center"
            v-for="(item, index) in dateList"
            :key="index"
            width="100px"
          >
            <template #default="prop">
              <div>{{ prop.row.value[index] }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="right_title">告警记录</div>
        <el-table
          :data="warningList"
          border
          size="large"
          style="height: 200px"
          v-loading="warningLoading"
        >
          <el-table-column label="告警类型" prop="type" align="center"></el-table-column>
          <el-table-column label="告警体征数值" prop="number" align="center"></el-table-column>
          <el-table-column label="告警时间" prop="date" align="center"></el-table-column>
        </el-table>
        <!-- 体征数据 -->
        <div class="date_search_box flex_start">
          <div class="search_item flex_start mr-12px">
            <div class="search_label">数据采集时间：</div>
            <div class="select_width">
              <el-select v-model="dialog_search_date" size="large">
                <el-option
                  :key="item.value"
                  v-for="item in dialog_search_date_list"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="search_btn_box">
            <el-button type="primary" size="large" @click="searchReportData">搜索</el-button>
          </div>
        </div>
        <div class="report_contet flex_space_between">
          <div class="report_left">
            <div class="left_title">体征数据</div>
            <div class="left_content_box mb_8" v-loading="hr_loading">
              <div class="flex_space_between">
                <div class="flex_start left_data_box_title">
                  <img src="@/assets/images/hr_icon.png" alt="" />
                  <div class="d_name">心率</div>
                </div>
                <div class="unit">次/分</div>
              </div>
              <div class="left_value_box">
                {{ hr_result.list && hr_result.list.length ? hr_result.new_value : '--' }}
              </div>
              <div class="flex_space_around avg_data">
                <div>
                  <div class="value">
                    {{
                      hr_result.avg && hr_result.avg.average_avg ? hr_result.avg.average_avg : '--'
                    }}
                  </div>
                  <div class="text">平均心率</div>
                </div>
                <div>
                  <div class="value">
                    {{
                      hr_result.avg && hr_result.avg.average_max ? hr_result.avg.average_max : '--'
                    }}
                  </div>
                  <div class="text">最高心率</div>
                </div>
                <div>
                  <div class="value">
                    {{
                      hr_result.avg && hr_result.avg.average_min ? hr_result.avg.average_min : '--'
                    }}
                  </div>
                  <div class="text">最低心率</div>
                </div>
              </div>
            </div>
            <div class="left_content_box" v-loading="spo2_loading">
              <div class="flex_space_between">
                <div class="flex_start left_data_box_title">
                  <img src="@/assets/images/spo2_icon.png" alt="" />
                  <div class="d_name">血氧饱和度</div>
                </div>
                <div class="unit">%</div>
              </div>
              <div class="left_value_box">
                {{ spo2_result.list && spo2_result.list.length ? spo2_result.new_value : '--' }}
              </div>
              <div class="flex_space_around avg_data">
                <div>
                  <div class="value">
                    {{
                      spo2_result.avg && spo2_result.avg.average_avg
                        ? spo2_result.avg.average_avg
                        : '--'
                    }}
                  </div>
                  <div class="text">平均血氧</div>
                </div>
                <div>
                  <div class="value">
                    {{
                      spo2_result.avg && spo2_result.avg.average_max
                        ? spo2_result.avg.average_max
                        : '--'
                    }}
                  </div>
                  <div class="text">最高血氧</div>
                </div>
                <div>
                  <div class="value">
                    {{
                      spo2_result.avg && spo2_result.avg.average_min
                        ? spo2_result.avg.average_min
                        : '--'
                    }}
                  </div>
                  <div class="text">最低血氧</div>
                </div>
              </div>
            </div>
          </div>
          <div class="report_right" v-loading="chart_loading">
            <el-radio-group
              @change="changeNameType"
              v-model="choose_name"
              size="small"
              style="--el-color-primary: #07c160"
            >
              <el-radio-button label="心率" value="heartrate" />
              <el-radio-button label="血氧饱和度" value="spo2" />
            </el-radio-group>
            <div v-show="choose_name == 'heartrate'">
              <!-- <div class="echarts_c_time">13:09</div>
                        <div class="echarts_c_value">98次/分</div> -->
              <div class="psr relative">
                <div class="echart_size" ref="hrRef" id="hr_chart"></div>
                <div v-show="!(hr_result.list && hr_result.list.length)" class="echarts_nodata">
                  <img src="@/assets/images/nodata.png" alt="" />
                  <p>暂无数据，请提醒患者坚持佩戴久乐表！</p>
                </div>
              </div>
            </div>
            <div v-show="choose_name == 'spo2'">
              <!-- <div class="echarts_c_time">13:09</div>
                        <div class="echarts_c_value">98%</div> -->
              <div class="psr relative">
                <div class="echart_size" ref="spo2Ref" id="spo2_chart"></div>
                <div v-show="!(spo2_result.list && spo2_result.list.length)" class="echarts_nodata">
                  <img src="@/assets/images/nodata.png" alt="" />
                  <p>暂无数据，请提醒患者坚持佩戴久乐表！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" type="primary" @click="submitForm()"> 提交 </el-button>
      </div>
    </template>
  </custom-dialog>
</template>

<script setup lang="ts">
import sfApi from '@/api/sf'
import type { WearTableItem, CallTableItem, Pagination } from '@/interface/interface'
import { onMounted, reactive, ref, shallowRef } from 'vue'
import { dateFtt, getAllDate } from '@/utils/date/dateFtt'

import {
  ElLoading,
  ElMessage,
  ElForm,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import bus from '@/eventBus/eventBus'
import { fa, tr } from 'element-plus/es/locales.mjs'
import BodyApi from '@/api/body'
import echarts from '@/utils/echarts/echarts'
const checkLists = ref<any>([
  {
    label: '持续性肺漏气≥5天',
    value: 0,
  },
  {
    label: '肺部感染',
    value: 1,
  },
  {
    label: '气胸',
    value: 2,
  },
  {
    label: '心律失常',
    value: 3,
  },
  {
    label: '肺不张',
    value: 4,
  },
  {
    label: '伤口感染',
    value: 5,
  },
  {
    label: '血胸',
    value: 6,
  },
  {
    label: '脓胸',
    value: 7,
  },
  {
    label: '乳糜胸',
    value: 8,
  },
  {
    label: '支气管胸膜瘘',
    value: 9,
  },
  {
    label: '喉返神经损伤（声音嘶哑）',
    value: 10,
  },
  {
    label: '肺梗塞',
    value: 11,
  },
  {
    label: '脑梗塞',
    value: 12,
  },
  {
    label: '心肌梗死',
    value: 13,
  },
  {
    label: '下肢深静脉血栓',
    value: 14,
  },
  {
    label: '泌尿系统感染',
    value: 15,
  },
  {
    label: '应激性消化道溃疡出血',
    value: 16,
  },
  {
    label: '呼吸衰竭',
    value: 17,
  },
  {
    label: '心衰',
    value: 18,
  },
  {
    label: '败血症',
    value: 19,
  },
  {
    label: '急性肾衰竭',
    value: 20,
  },
  {
    label: '急性肝衰竭',
    value: 21,
  },
  {
    label: '休克',
    value: 22,
  },
  {
    label: '多器官衰竭',
    value: 23,
  },
  {
    label: '恶心呕吐',
    value: 24,
  },
  {
    label: '疼痛',
    value: 25,
  },
  {
    label: '吻合口瘘',
    value: 26,
  },
  {
    label: '吻合口狭窄',
    value: 27,
  },
  {
    label: '食管气管瘘',
    value: 28,
  },
])
const checkDataFilter = (arr: any) => {
  const str: number[] = []
  arr.forEach((val: number) => {
    str.push(checkLists.value[val].label)
  })
  return str.join(', ')
}
const fenjiList: Array<{ value: number; label: string; num?: number }> = [
  {
    label: 'Ⅰ',
    value: 0,
  },
  {
    label: 'Ⅱ',
    value: 1,
  },
  {
    label: 'Ⅲ',
    value: 2,
  },
  {
    label: 'Ⅲa',
    value: 3,
  },
  {
    label: 'Ⅲb',
    value: 4,
  },
  {
    label: 'Ⅳ',
    value: 5,
  },
  {
    label: 'Ⅳa',
    value: 6,
  },
  {
    label: 'Ⅳb',
    value: 7,
  },
  {
    label: 'Ⅴ',
    value: 8,
  },
]
const fenjiListFilter = (arr: any) => {
  if (arr.value) {
    console.log(arr)
    const str = ref<string>()
    fenjiList.forEach((val: any) => {
      if (val.value == arr.value) {
        str.value = val.label
      }
    })
    return ` (${str.value})`
  } else {
    return ''
  }
}

// 搜索
const search_form = reactive({
  patient_name: '',
  patient_num: '',
  end_type: '',
  visit: 0,
  group_status: '',
})

const search = () => {
  pageQuery.page = 1
  pageQuery.perPage = 10
  fetchData()
}
const iframe_src = ref<string>('')
const bor = ref<boolean>(false)
const reset = () => {
  pageQuery.page = 1
  pageQuery.perPage = 10
  search_form.patient_num = ''
  search_form.patient_name = ''
  search_form.end_type = ''
  search_form.visit = 0
  search_form.group_status = ''
  fetchData()
}
// 分页器
const pageQuery = reactive<Pagination>({
  page: 1,
  perPage: 10,
  total: 0,
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
const changeVisitBtn = () => {
  search_form.visit = Number(!search_form.visit)
  if (search_form.visit) {
    search_form.group_status = ''
  }
  fetchData()
}
const tableLoading = ref<boolean>(false)
let tableData = reactive<WearTableItem[]>([])

const visitCount = ref(0)
const fetchData = async (type?: Number) => {
  tableLoading.value = true
  let data: any = {
    page: pageQuery.page,
    perPage: pageQuery.perPage,
    name: search_form.patient_name,
    patient_number: search_form.patient_num,
    end_type: search_form.end_type,
    // visit: search_form.visit
  }
  let result
  if (search_form.visit === 1) {
    result = (await sfApi.getVisitList(data)).data.result
  } else {
    data.group_status = search_form.group_status
    result = (await sfApi.apiPatientList(data)).data.result
  }
  if (result) {
    tableLoading.value = false
    pageQuery.total = result.total
    console.log(result.data)

    tableData = result.data
  }
  const result_ = (await sfApi.getVisiCount()).data
  if (result_.status == '200') {
    visitCount.value = result_.result
  }
}
const checkSpo2 = (rule: any, value: any, callback: any) => {
  setTimeout(() => {
    if (!value) {
      callback()
    } else {
      if (value <= 0) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
      callback()
    }
  }, 200)
}

//随访list
const suiList = ref<any>([])
const suiPitchId = ref<any>()
const suiItem = reactive({
  is_connect: '',
  start: '',
  fkadd: [
    {
      zz: '',
      time: '',
      cl: '',
      zg: '',
    },
  ],
  yztext: '',
  checkData: '',
  fenj: '',
  sbData: {
    xy: '',
    xl: '',
  },
  id: '',
  updated_at: '',
  name: '',
  end: '',
  phone: '',
  ccid: '',
})
const sfLoading = ref<boolean>(false)
const patient_id = ref<number>()
const rowData = ref<any>()
const ccid = ref('')
const getSuidata = async (row: any) => {
  ccid.value = row.ccid
  bor.value = true
  rowData.value = row
  // suiList.value = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  patient_id.value = row.id
  let data = {
    patient_id: patient_id.value,
  }

  sfLoading.value = true
  const result = (await sfApi.active_apiList(data)).data.result

  if (result) {
    sfLoading.value = false
    let arr: any[] = []
    result.forEach((res: any) => {
      res.addtime = JSON.parse(res.content).start
      arr.push(res)
    })
    suiList.value = arr
    if (suiList.value.length) {
      getSuiDetails(suiList.value[suiList.value.length - 1].id)
    }
  }
}

//随访详情
const suiItembor = ref<boolean>(false)
const getSuiDetails = async (id: number) => {
  suiPitchId.value = id
  suiItembor.value = true
  const result = (await sfApi.active_apiDetails({ id: suiPitchId.value })).data.result
  suiItembor.value = false
  if (result) {
    console.log(result)
    // suiItem.value = JSON.parse(result.content)
    const content = JSON.parse(result.content)
    console.log('content', content)
    suiItem.updated_at = result.updated_at ? result.updated_at : result.created_at
    suiItem.start = content.start
    suiItem.is_connect = result.is_connect.toString()
    suiItem.fkadd = content.fkadd
    suiItem.yztext = content.yztext
    suiItem.checkData = content.checkData
    suiItem.fenj = content.fenj
    suiItem.sbData.xl = content.sbData.xl
    suiItem.sbData.xy = content.sbData.xy
    suiItem.id = result.id

    suiItem.name = result.name
    suiItem.end = result.end ? dateFtt('yyyy-mm-dd', result.end) : '未离院'
    suiItem.phone = result.phone
    suiItem.ccid = result.ccid

    console.log('suiItem', suiItem)
  }
}

// 新增随访
//
const sfbor = () => {
  addForm.value = {
    start: '', //随访日期
    is_connect: '1',
    fkadd: [
      //患者反馈
      {
        zz: '',
        time: '',
        cl: '',
        zg: '',
      },
    ],
    yztext: '', //医嘱
    checkData: [], //并发症
    fenj: '', // 分级
    sbData: {
      xl: '',
      xy: '',
    }, // 手表数据
  }
  addForm.value.start = dateFtt('yyyy-mm-dd hh:MM:ss', new Date().getTime())
  addSuibor.value = true
  fetchMoreData()
}
const addSuibor = ref<boolean>(false)
const addFormRef = ref<FormInstance>()
const addForm = ref<any>({
  // situation:"",
  is_connect: '',
  start: '', //随访日期
  fkadd: [
    //患者反馈
    {
      zz: '',
      time: '',
      cl: '',
      zg: '',
    },
  ],
  yztext: '', //医嘱
  checkData: [], //并发症
  fenj: '', // 分级
  sbData: {
    xl: '',
    xy: '',
  }, // 手表数据
})
const editPatientBedFormRules = reactive<FormRules>({
  start: [{ required: true, message: '请选择随访日期', trigger: 'blur' }],
  ['sbData.xy']: [{ validator: checkSpo2, trigger: 'blur' }],
  ['sbData.xl']: [{ validator: checkSpo2, trigger: 'blur' }],
})

const addfk = () => {
  addForm.value.fkadd.push({
    zz: '',
    time: '',
    cl: '',
    zg: '',
  })
}
const editFk = (index: number) => {
  addForm.value.fkadd.splice(index, 1)
}

const submitForm = () => {
  const formEl = addFormRef.value //elform实例
  console.log('formEl', formEl)
  let flag = false
  const reg = /^(10|[0-9])$/
  addForm.value.fkadd.forEach((item: any, index: number) => {
    if (item.sleep_number || Number(item.sleep_number) === 0) {
      console.log(typeof Number(item.sleep_number) === 'number', '111111111')
      if (!reg.test(item.sleep_number)) {
        item.requireSleepsmScore = true
        flag = true
      } else {
        item.requireSleepsmScore = false
      }
    }
    if (item.pain_number || Number(item.pain_number) === 0) {
      if (!reg.test(item.pain_number)) {
        item.requireSleepTtscore = true
        flag = true
      } else {
        item.requireSleepTtscore = false
      }
    }
  })

  if (flag) {
    return
  }
  if (!formEl) return
  formEl.validate(async (valid: any) => {
    //表单验证
    if (valid) {
      console.log(addForm.value)
      const Formloading = ElLoading.service({
        target: '._loading',
      })
      addForm.value.patient_id = patient_id

      try {
        if (addForm.value.id) {
          const data = {
            patient_id: patient_id.value,
            content: addForm.value,
            id: addForm.value.id,
            is_connect: addForm.value.is_connect,
          }
          const result = (await sfApi.apiUpdate(data)).data.result
          console.log('result', result)
          if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            addSuibor.value = false
            getSuidata(rowData.value)
            reset()
          }
        } else {
          const data = {
            patient_id: patient_id.value,
            content: addForm.value,
            active_date: addForm.value.start,
            is_connect: addForm.value.is_connect,
          }
          const result = (await sfApi.apiAdd(data)).data.result
          if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            addSuibor.value = false
            getSuidata(rowData.value)
            reset()
          }
        }
      } catch (error) {
        Formloading.close()
      }
    } else {
      // Formloading.close()
    }
  })
}

// 编辑
const bianji = async () => {
  addForm.value = suiItem
  addSuibor.value = true
  fetchMoreData()
}

// 佩戴数据
const dateList = ref([
  '**月**号',
  '**月**号',
  '**月**号',
  '**月**号',
  '**月**号',
  '**月**号',
  '**月**号',
])
const wearDataList = ref<any[]>([
  {
    text: '佩戴时长',
    value: [],
  },
  {
    text: '占比',
    value: [],
  },
  {
    text: '佩戴结论',
    value: [],
  },
])
const wearLoading = ref(false)
const warningLoading = ref(false)
const fetchWearData = () => {
  wearLoading.value = true
  const data = {
    patient_id: patient_id.value,
    date: addForm.value.start.slice(0, 10),
  }
  sfApi.getWearList(data).then((res) => {
    wearLoading.value = false
    console.log(res)
    dateList.value = res.data.result.dataList
    wearDataList.value[0].value = res.data.result.wearDataList.wear[0]
    wearDataList.value[1].value = res.data.result.wearDataList.proportion[0]
    wearDataList.value[2].value = []
    res.data.result.wearDataList.conclusion[0].forEach((element: any) => {
      wearDataList.value[2].value.push(element ? '满足' : '不满足')
    })
  })
}

// 告警记录
const warningList = ref<any[]>([])
const fetchWarningData = () => {
  warningLoading.value = true
  const data = {
    patient_id: patient_id.value,
    date: addForm.value.start.slice(0, 10),
  }
  sfApi.getWarningList(data).then((res) => {
    warningLoading.value = false
    warningList.value = res.data.result
  })
}

// 体征数据

const hrRef = shallowRef()
const spo2Ref = shallowRef()
const hrOption = reactive({
  xAxis: {
    type: 'time',
    axisLabel: {
      formatter: function (value: any) {
        return dateFtt('hh:MM', new Date(value))
      },
      showMaxLabel: true,
      showMinLabel: true,
      color: '#929FAF',
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
    },
  },
  color: '#07C160',
  tooltip: {
    trigger: 'axis',
    // appendTo:'body',
    formatter: function (params: any) {
      var html = ''
      for (var i in params) {
        var param = params[i]
        // echarts日期格式化api
        console.log(param)
        if (param.data[1]) {
          var date = dateFtt('hh:MM', new Date(param.data[0]))
          html += `<span style="color: #333;font-weight:bolder;">${date}</span><br />
                            <span style="margin-right:10px;padding-left:14px;position:relative;color:${hr_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : ''};">
                                <span style='display: block;
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: ${hr_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : '#07C160'};
                                            position: absolute;
                                            left: 0;
                                            top: 6px;'></span>
                                ${param.seriesName}：</span>
                        <span style="color:${hr_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : ''};">${param.data[1]}bpm</span><br />
                        <span style="${hr_result.value.list[param.dataIndex].type == 1 ? '' : 'display:none;'};">${hr_result.value.list[param.dataIndex].warn_number}</span>`
        }
      }
      return html
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
    },
    axisLabel: {
      color: '#929FAF',
      // formatter: function (value: any) {
      //     return value + '%'
      // },
    },
  },
  grid: {
    left: '8%',
    top: '10%',
    bottom: '10%',
    right: '5%',
  },
  series: [
    {
      name: '心率',
      data: [],
      type: 'line',
      symbol: 'none',
      lineStyle: {
        color: '#07C160',
      },
      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#ff0000',
        },
      },
    },
  ],
})

const spo2Option = reactive({
  xAxis: {
    type: 'time',
    axisLabel: {
      formatter: function (value: any) {
        return dateFtt('hh:MM', new Date(value))
      },
      showMaxLabel: true,
      showMinLabel: true,
      color: '#929FAF',
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    // appendTo:'body',
    formatter: function (params: any) {
      var html = ''
      for (var i in params) {
        var param = params[i]
        // echarts日期格式化api
        if (param.data[1]) {
          var date = dateFtt('hh:MM', new Date(param.data[0]))
          html += `<span style="color: #333;font-weight:bolder;">${date}</span><br />
                            <span style="margin-right:10px;padding-left:14px;position:relative;color:${spo2_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : ''};">
                                <span style='display: block;
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: ${spo2_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : '#07C160'};
                                            position: absolute;
                                            left: 0;
                                            top: 6px;'></span>
                                ${param.seriesName}：</span>
                        <span style="color:${spo2_result.value.list[param.dataIndex].type == 1 ? '#ff0000' : ''};">${param.data[1]}%</span><br />
                        <span style="${spo2_result.value.list[param.dataIndex].type == 1 ? '' : 'display:none;'};">${spo2_result.value.list[param.dataIndex].warn_number}</span>`
        }
      }
      return html
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
    },
    axisLabel: {
      color: '#929FAF',
      formatter: function (value: any) {
        return value + '%'
      },
    },
  },
  grid: {
    left: '8%',
    top: '10%',
    bottom: '10%',
    right: '5%',
  },
  series: [
    {
      name: '血氧饱和度',
      data: [],
      type: 'line',
      symbol: 'none',
      lineStyle: {
        color: '#07C160',
      },
      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#ff0000',
        },
      },
    },
  ],
})
let hrChart: echarts.ECharts | null | undefined = null
let spo2Chart: echarts.ECharts | null | undefined = null
const chart_loading = ref(false)
const hr_result = ref<any>({})
const spo2_result = ref<any>({})

const dialog_search_date = ref('')
const dialog_search_date_list = ref<any[]>([])
const fetchMoreData = async () => {
  fetchWarningData()
  fetchWearData()
  const dateResult = (await BodyApi.getPdDate({ patient_id: patient_id.value })).data.result
  if (dateResult) {
    console.log(dateResult)
    const weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    dialog_search_date_list.value = []
    let startDate = new Date(
      dateFtt('yyyy/mm/dd 00:00:00', new Date(dateResult.bind_time)),
    ).getTime()
    let endDate = !dateResult.unbind_time
      ? new Date().getTime()
      : new Date(dateResult.unbind_time).getTime()
    let dateArr = getAllDate(startDate, endDate)
    console.log(startDate, endDate)

    dateArr.forEach((item) => {
      dialog_search_date_list.value.push({
        label: `${dateFtt('yyyy年mm月dd日', item)} ${weekList[item.getDay()]}`,
        value: dateFtt('yyyy/mm/dd', item),
      })
    })
    dialog_search_date.value =
      dialog_search_date_list.value[dialog_search_date_list.value.length - 1].value
    dialog_search_date_list.value.reverse()
    searchReportData()
  }
}
const changeAddDate = (e: any) => {
  fetchWarningData()
  fetchWearData()
}
const spo2_loading = ref(false)
const hr_loading = ref(false)
const searchReportData = () => {
  let markData_hr: never[] = [],
    markData_spo2: never[] = []
  chart_loading.value = true
  spo2_loading.value = true
  hr_loading.value = true
  let data = {
    ccid: ccid.value,
    from: new Date(dialog_search_date.value + ' 00:00:00').getTime() / 1000,
    to: new Date(dialog_search_date.value + ' 23:59:59').getTime() / 1000,
    patient_id: patient_id.value,
  }
  BodyApi.getDataStatics(Object.assign({ name: 'heartrate' }, data)).then((res) => {
    hr_result.value = res.data.result
    let flag = true
    hr_loading.value = false
    if (hr_result.value.list.length) {
      for (let index = hr_result.value.list.length - 1; index > 0; index--) {
        const element = hr_result.value.list[index]
        if (element.y && flag) {
          hr_result.value.new_obj = element
          hr_result.value.new_value = element.y
          flag = false
        }
      }
    }
    console.log(hr_result.value)

    let dataList = hr_result.value.list
    let data: never[] = []
    dataList.forEach((item: any) => {
      data.push([new Date(`${dialog_search_date.value} ${item.name}`), item.y] as never)
      if (item.type == 1) {
        markData_hr.push({
          coord: [new Date(`${dialog_search_date.value} ${item.name}`), item.y],
        } as never)
      }
    })
    hrOption.series[0]!.data = data
    hrOption.series[0]!.markPoint.data = markData_hr
    initCharts()
  })
  BodyApi.getDataStatics(Object.assign({ name: 'spo2' }, data)).then((res) => {
    spo2_result.value = res.data.result
    let flag = true
    spo2_loading.value = false
    if (spo2_result.value.list.length) {
      for (let index = spo2_result.value.list.length - 1; index > 0; index--) {
        const element = spo2_result.value.list[index]
        if (element.y && flag) {
          spo2_result.value.new_obj = element
          spo2_result.value.new_value = element.y
          flag = false
        }
      }
    }
    let dataList = spo2_result.value.list
    let data: never[] = []
    dataList.forEach((item: any) => {
      data.push([new Date(`${dialog_search_date.value} ${item.name}`), item.y] as never)
      if (item.type == 1) {
        markData_spo2.push({
          coord: [new Date(`${dialog_search_date.value} ${item.name}`), item.y],
        } as never)
      }
    })
    spo2Option.series[0]!.data = data
    spo2Option.series[0]!.markPoint.data = markData_spo2
    initCharts()
  })
}

const initCharts = () => {
  if (choose_name.value === 'heartrate') {
    chart_loading.value = false
    setTimeout(() => {
      if (hrChart == null || hrChart == undefined) {
        hrChart = echarts.init(document.getElementById('hr_chart'))
        // window.addEventListener(
        //     'resize',
        //     (window.onresize = () => {
        //         hrChart && hrChart.resize()
        //     })
        // )
      }
      hrChart.setOption(hrOption)
    }, 200)
  }
  if (choose_name.value === 'spo2') {
    chart_loading.value = false
    setTimeout(() => {
      if (spo2Chart == null || spo2Chart == undefined) {
        spo2Chart = echarts.init(document.getElementById('spo2_chart'))
        // window.addEventListener(
        //     'resize',
        //     (window.onresize = () => {
        //         spo2Chart && spo2Chart.resize()
        //     })
        // )
      }
      spo2Chart.setOption(spo2Option)
    }, 200)
  }
}
const changeNameType = () => {
  initCharts()
}
const choose_name = ref('heartrate')
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

:deep(.addsui .ep-select__wrapper) {
  height: 24px;
}
/* .dialog_flex .addsui */
:deep(.addsui .ep-input__wrapper, .ep-textarea__inner) {
  height: 24px;
}
:deep(.ep-date-editor, .ep-input) {
  min-height: 24px !important;
}

.sf_btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  text-align: center;
  line-height: 48px;
  color: white;
  background-color: #1ab8cc;
  position: absolute;
  bottom: -2px;
}

.dia_con {
  width: 100%;
  /* height: 739px; */
  display: flex;
  box-sizing: border-box;
}

.dia_l {
  width: 177px;
  background-color: #f5f7fb;
}

.dia_l .item {
  cursor: pointer;
  background-color: #fff;
  font-size: 14px;
  color: #929faf;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 100%;
}

.dia_con .dia_l .pitch {
  background: #24b287;
  color: #ffffff;
}

.item_btn {
  cursor: pointer;
  font-size: 14px;
  color: #24b287;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}
.w-fit-content {
  width: fit-content;
}

.item_btn .text {
  color: #fff;
  background-color: #24b287;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dia_r {
  width: 688px;
}

.dia_r_box {
  padding: 24px;
  /* height: 659px; */
  box-sizing: border-box;
  overflow-y: auto;
}

.dia_r_b {
  width: 100%;
  border-top: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

:deep(.dia_r_box .el-table__cell) {
  padding: 5px !important;
}

.nodata img {
  width: 50%;
  margin: 0 auto;
  margin-top: 50px;
}

.nodata_add {
  text-align: center;
}

.nodata .add {
  width: 135px;
  height: 48px;
}

.addsui {
  width: 40%;
  padding: 24px 60px;
  padding-right: 20px;
}

.fk_box {
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #eeeeee;
  padding: 24px 48px;
  margin-top: 22px;
  width: 100%;
}

.addsui .item {
  display: flex;
  margin-bottom: 12px;
}

/* .item_inp { */
/* width: 284px; */
/* } */

:deep(.patient_input_width1) {
  width: 284px !important;
}

:deep(.patient_input_width2) {
  width: 426px !important;
}

:deep(.patient_input_width3) {
  width: 120px !important;
}

:deep(.sss) {
  display: flex !important;
  align-items: center !important;
}
:deep(.sss div) {
  line-height: 1 !important;
}

.deit {
  display: flex;
  justify-content: center;
}

.left {
  justify-content: left;
}

.item_leb {
  margin-left: 5px;
}

.addsui ._item {
  margin-right: 48px;
}

.dialog_flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dialog_right {
  padding-right: 20px;
  width: 60%;
}

.right_title {
  margin: 20px 0 12px;
}

.echarts_nodata img {
  width: 162px;
  margin: 0 auto;
}

.echarts_nodata p {
  font-size: 12px;
  color: #929faf;
}

.echarts_nodata {
  text-align: center;
  height: 280px;
  padding-top: 54px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #ffffff;
}

.echart_size {
  width: 100%;
  height: 300px;
}

.report_right {
  border-radius: 10px;
  border: 1px solid #eaeaea;
  padding: 12px;
  width: calc(100% - 234px);
}

.select_width {
  width: 220px;
}

.date_search_box {
  background-color: #f5f7fb;
  padding: 9px 24px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.report_left {
  background-color: #f5f7fb;
  border-radius: 5px;
  width: 224px;
  padding: 12px;
}

.left_title {
  font-size: 16px;
  font-weight: bold;
  color: #07c160;
  margin-bottom: 12px;
}

.left_content_box {
  padding: 8px;
  border-radius: 4px;
  background-color: #ffffff;
}

.left_data_box_title img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.left_content_box .d_name {
  /* width: 184px; */
  height: 24px;
  line-height: 24px;
  color: #384951;
  font-size: 16px;
}

.left_content_box .unit {
  height: 24px;
  font-size: 16px;
  color: #929faf;
  line-height: 24px;
}

.left_value_box {
  height: 48px;
  line-height: 48px;
  font-size: 24px;
  color: #384951;
  font-weight: bold;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 12px;
  text-align: center;
}

.avg_data {
  text-align: center;
}

.avg_data .value {
  font-size: 16px;
  height: 24px;
  line-height: 24px;
  font-weight: bold;
  color: #384951;
}

.avg_data .text {
  font-size: 12px;
  font-weight: 400;
  color: #929faf;
}

.mb_8 {
  margin-bottom: 8px;
}

.table_height {
  max-height: 60px;
  overflow-y: auto;
}

.table_height::-webkit-scrollbar {
  width: 3px;
}

.table_height::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  /* 滑块颜色 */
  border-radius: 10px;
  /* 滑块圆角 */
}

.table_height::-webkit-scrollbar-track {
  background: #e1e1e1;
  /* 轨道颜色 */
}

.textright {
  flex-shrink: 0;
  width: 70px;
  text-align: right;
}

:deep(.errorinput .patient_input_width1) {
  width: 234px !important;
  margin-right: 12px;
  color: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 4px;
}
:deep(.errorinput .patient_input_width1 .is-focus) {
  box-shadow: initial !important;
}

:deep(.w90 .patient_input_width1) {
  width: 234px !important;
  margin-right: 12px;
}
.error_text {
  font-size: 12px;
  color: #ff0000;
}

.aligntop {
  display: initial !important;
}
</style>

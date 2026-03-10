<template>
  <div class='app-container'>
    <!-- v-slot="{ Component }" -->
       <router-view />
            <!-- <keep-alive :include="keepAlivePages">
                <component :is="Component" />
            </keep-alive> -->
        <div class="warning_dialog" 
              v-if="JSON.stringify(warningItem) !== '{}'"
              element-loading-background="rgba(255, 255, 255, 0.4)" v-loading='btnLoading'>
              <div class="warning_box" :class="{'custom_height':customArr.includes(Number(warningItem.alarm_type))}">
                      <div class="name-box" style="align-items: baseline;">
                          <div class="bed_number large_text">{{ warningItem.bed_number}}</div>
                          <div class="normal_text normal_text_tip">床</div>
                          <div class="normal_text_name" :class="{'custom_normal_text':customArr.includes(Number(warningItem.alarm_type))}">{{ warningItem.name }}</div>
                      </div>
                   <div class="normal_text_warning">
                      <span 
                      :class="{'custom_warning_text':customArr.includes(Number(warningItem.alarm_type))}"
                      v-for="value in warningTypes[warningItem.alarm_type as keyof typeof warningTypes]?.split(',')">{{ value }}</span>
                   </div>
                  <div class="rotate_box" v-if="warningItem.alarm_type!='403'">
                      <div class='handle_btn' @click="handleBtnClick()" :class="{ btn_rotate1: rotateFlag }">
                              <img src="@/assets/images/V4/right.png" alt="" class="w-64px h-64px mb--10px ml-5px">
                          <div>处理</div>
                      </div>
                      <div class='handle_btn btn_ok' :class="{ btn_rotate2: rotateFlag }">
                             <img src="@/assets/images/V4/right.png" alt="" class="w-64px h-64px mb--10px ml-5px">
                          <div>已处理</div>
                      </div>
                  </div>
                  <div class="btns" v-else>
                      <div class='child_btn_close' v-waves @click="handleBtnClick(0)">
                           <img src="@/assets/icon/open.png" alt="" class="">
                           <div class="closetxt">
                              关闭
                           </div>
                      </div>
                      <div class='child_btn_continue' v-waves @click="handleBtnClick(1)">
                          <img src="@/assets/icon/play.png" alt="">
                          <div class="continuetxt">
                              继续
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { getCookie } from '@/utils/cookie/cookie';
import { useWarningStore } from '@/stores/warning';
import CallApi from '@/api/call';
import { ElMessage } from 'element-plus';
import ElectrocarDiographicApi from "@/api/electrocardiographic";
import vWaves from "@/utils/directive/waves";
import { useSetwsStore } from '@/stores/setws';
import { useTopNums } from "@/stores/topNums";
const setTopNumsStore =useTopNums();
const setwsStore = useSetwsStore()
const warningStore = useWarningStore()
const admin = JSON.parse(getCookie('admin') as string)
import { useRoute } from 'vue-router'
const route = useRoute()
const keepAlivePages = computed(() => route.matched.filter(r => r.meta.KeepAlive && typeof r.name === 'string').map(r => r.name as string))

let customArr = ref([
    272,
    273
]); 
// 样式不同的区分数组
const textToSpeech = (text: string) => {
    try {
        const speech = new SpeechSynthesisUtterance(text); // 创建语音消息
        speech.rate = 0.7
        window.speechSynthesis.speak(speech); // 播放语音
    } catch (error) {
        console.log(error);
    }
} 
let ws: null | WebSocket = null;
const heartBeatTimer = ref(0);
const heartInterval = ref(30000);
let sendMsg = ref({
	"client_type": "pc",
	"client_sign":'',
	"client_data": ""
})
const initWs = () => {
    ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
    setwsStore.savews(ws);
    ws.onmessage = (msg: any) => {
            if(msg.data!="pong"){
        let data = JSON.parse(msg.data as string);
        if (data?.notice == 1) {
            warningDatas.value.push(data)
            textToSpeech(data.bed_number + '床' + warningTypes[data.alarm_type as keyof typeof warningTypes])
        };
        warningStore.increment()
          }
    }
    ws.onopen = () => {
        sendMsg.value.client_data = admin.zone_number;
        ws && ws.send(JSON.stringify(sendMsg.value));
           startHeartBeat()
    }
    ws.onerror = (err: any) => {
    }
    ws.onclose = (e) => {
          if(e.code!=1000){
             if (localStorage.getItem('token')) {
                 initWs()
             }
          }
    }
}


const  startHeartBeat = ()=>{
        heartBeatTimer.value = setInterval(() => {
            if (ws!.readyState === WebSocket.OPEN) {
                 sendMsg.value.client_data = "ping";
                 ws!.send(JSON.stringify(sendMsg.value));
            }
        }, heartInterval.value);
    }

const rotateFlag = ref(false)
const btnLoading = ref(false)
const handleBtnClick = async (type?: number) => {
    btnLoading.value = true
    // 调用处理接口
    try {
        let result:any;
        let arr = [403,401,402,271,501,502,272,273];
         if(warningDatas.value.length > 0 && arr.includes(Number(warningDatas.value[0]?.alarm_type))){
             let _d:{
                warn_id:string,
                is_continue?:number
             } = { warn_id: warningDatas.value[0].warn_id };
             if(type === 0 || type === 1){
                    _d.is_continue = type
             }
             result = (await ElectrocarDiographicApi.warnStatus(_d)).data;
        }else if(warningDatas.value.length > 0 &&(warningDatas.value[0].alarm_type == 301 || warningDatas.value[0].alarm_type == 302)){
             result = (await ElectrocarDiographicApi.ecgStatus({ id: warningDatas.value[0].warn_id })).data;
        }else{
              result = (await CallApi.processingCall({ id: warningItem.value.warn_id })).data;
        }
        if (result) {
            btnLoading.value = false
            rotateFlag.value = true
            setTimeout(() => {
                warningDatas.value.shift()
                rotateFlag.value = false
            }, 1500);
        }
    } catch (error: any) {
        btnLoading.value = false
        rotateFlag.value = false
        ElMessage.error(error)
    }
}

const warningTypes = {
    "1": "SOS呼救",
    "69": "离院预警",
    "266": "血氧过低",
    "267": "心率过高",
    "268": "心率过低",
    "301":"ECG心电监测计划到时,请前往患者处进行心电监测",
    "302":"血压监测计划到时,请前往患者处进行血压监测",
    "401":"心电监测计划监测失败,请尽快前往患者处查看佩戴情况,并手动监测一组心电",
    "402":"血压监测计划监测失败,请尽快前往患者处查看佩戴情况,并手动监测一组血压",
    "403":"QH模式血压监测已完成24小时计划,是否继续下一轮监测？",
    "271":"患者上报跌倒,请前往检查患者当前情况",
    "502":"已跨越电子围栏,请检查患者当前位置",
    "501":"已进入电子围栏,请检查患者当前位置",
    "272":"电池电量低",
    "273":"设备佩戴异常"
}
const warningDatas = ref<any>([])
const warningItem = computed(() => {
    if (warningDatas.value.length > 0) {
        return warningDatas.value[0]
    } else {
        return {}
    }
})
// 
let wsnum: null | WebSocket = null;

const initTopMenus = () => {
    wsnum = new WebSocket(`${import.meta.env.VITE_API_URL_NUMS}`);
    wsnum.onmessage = (msg: any) => {
        let data = JSON.parse(msg.data as string);
        setTopNumsStore.saveTopNums(data);
    }
    wsnum.onopen = () => {
            // console.log('send');
        wsnum && wsnum.send(admin.zone_number);
    }
    wsnum.onerror = (err: any) => {
        // setTimeout(() => {
        //     initWs()
        // }, 10000);
    }
    wsnum.onclose = (e) => {
        //   console.log('ws error1',e);
        if(e.code!=1000){
            //   console.log(e,"不是正常关闭")
            if (localStorage.getItem('token')) {
               initTopMenus()
            }
        }
        
    }
}

function generateUnique10DigitNumber() {
    // 取当前时间的后 5 位（毫秒级时间戳的后 5 位）
    const timePart = Date.now() % 100000;
    // 生成 5 位随机数（10000-99999）
    const randomPart = Math.floor(Math.random() * 90000) + 10000;
    // 拼接成 10 位数字
    return parseInt(`${timePart}${randomPart}`);
}
 


onMounted(() => {
    // 霸屏ws
    let str = localStorage.getItem('client_sign');
    if (str) {
        sendMsg.value.client_sign = JSON.parse(str);
        initWs()
    } else {
        let _sign = JSON.stringify(generateUnique10DigitNumber())
        localStorage.setItem('client_sign', _sign);
        sendMsg.value.client_sign = JSON.parse(_sign);
        initWs()
    }
    // setInterval(() => {
    //     warningDatas.value.push({
    //         name: `姓名${warningDatas.value.length}`,
    //         bed_number: `60${warningDatas.value.length}`,
    //         alarm_type:"401",
    //         type: '1'
    //     })
    // }, 100);
    // 顶部数字展示
    initTopMenus();
    // setInterval(() => {
    //     let _data =   {"warn_count":Math.ceil(Math.random()*10),
    //      "bat_count":Math.ceil(Math.random()*10),
    //      "wear_count":Math.ceil(Math.random()*10),
    //      "fall_count":Math.ceil(Math.random()*10),
    //      "fence_count":Math.ceil(Math.random()*10),
    //      "sos_count":0}
    //       setTopNumsStore.saveTopNums(_data);
    // }, 20000);
    
});

onUnmounted(()=>{
     if (wsnum && wsnum.readyState === WebSocket.OPEN) {
      wsnum.close(1000, '退出登录关闭顶部数字');
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, '退出登录关闭霸屏');
      localStorage.removeItem('client_sign');
      clearInterval(heartBeatTimer.value);
    }
})

</script>
<style scoped>
.app-container{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.warning_dialog {
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
}

.blur {
    /* 白色半透明背景 */
    filter: blur(3px);
    /* 模糊效果 */
    overflow: hidden;
}

.warning_box {
    width: 1000px;
    min-height: 737px;
    background-color: #24B287;
    border-radius: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 100px 30px;
    /* padding-top: 0; */
}

.close_icon {
    width: 48px;
    position: absolute;
    right: 30px;
    top: 30px;
}

.text_content {
    width: 100%;
    padding: 30px 86px 0;
    font-size: 60px;
    color: #fff;
}

.text_content>div {
    /* height: 144px; */
}

.text_content>div:last-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.name-shrink{
    flex-shrink: 0;
    display: flex;
    align-items: baseline;
    justify-content: center;
}
.text_content .flex_start {
    align-items: center;
     word-break: break-all;
}

 
.normal_text_warning {
    width: 100%;
    text-align: center;
    word-break: break-all;
    font-weight: 500;
    font-size: 60px;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.normal_text {
    height: 60px;
    line-height: 45px;
}

.rotate_box {
    width: 140px;
    height: 140px;
    margin: 10px auto 0;
    /* transition: transform ease 2s;
    transform: rotateY(0); */
    position: relative;
    flex-shrink: 0;

}

.handle_btn {
    width: 100%;
    height: 100%;
    border-radius: 140px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 32px;
    background-color: #F7413D;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
}

.btn_ok {
    background-color: #17ea30 !important;
    z-index: 2 !important;

    /* transform: rotateY(180deg) */
}

.handle_btn>div:first-child {
    font-size: 50px;
    width: 50px;
    line-height: 50px;
    height: 50px;
    margin: 0 auto;
}

.btn_rotate1 {
    /* transform: rotateY(180deg) */
    animation: move1 1s linear forwards;
}

.btn_rotate2 {
    /* transform: rotateY(180deg) */
    animation: move2 1s linear forwards;
}


@keyframes move1 {
    1% {
        opacity: 1;
        transform: rotateY(0)
    }

    50% {
        opacity: 1;
    }

    50.5% {
        transform: rotateY(90deg);
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

@keyframes move2 {
    1% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    50.5% {
        transform: rotateY(270deg);
        opacity: 1;
    }

    100% {
        transform: rotateY(360deg);
        opacity: 1;
    }
}


.btns{
    display: flex;
    /* height: 80px; */
    justify-content: center;
    align-items: center;
    gap: 80px;
      margin: 0px auto;
    /* transition: transform ease 2s;
    transform: rotateY(0); */
    position: relative;
    margin-top: 10px;
    flex-shrink:0;
}

.btns .child_btn_close{
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     width: 140px;
     height: 140px;
     border-radius: 50%;
     background-color: #fff;
     font-size: 32px;
     color: #00B528;
     cursor: pointer;
     font-weight: 600;
}

.btns img{
    width: 64px;
    height: 64px;
}
.closetxt{
    font-size: 32px;
    color: #00B528;
}

.btns .child_btn_continue{
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     width: 140px;
     height: 140px;
     border-radius: 50%;
     background-color: #F7413D;
     color: #fff;
     font-size: 32px;
     cursor: pointer;
}
.name-box{
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
}
.bed_number{
    font-size: 100px;
    color: #fff;
    line-height: 150px;
    /* font-family: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30'; */
    font-weight: 600;
}
.large_text{
    font-size: 207px;
    font-weight: 600 !important;
}
.custom_height{
    height: 737px;
}
.normal_text_tip{
    font-weight: 500;
font-size: 60px;
color: #FFFFFF;
margin-left: 30px;
margin-right: auto;
}
.normal_text_name{
    font-size: 100px;
color: #FFFFFF;
font-weight: 800;
}
.custom_normal_text{
    font-size: 100px;
    font-weight: bold;
}
.custom_warning_text{
    font-size: 60px;
}
</style>
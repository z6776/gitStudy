<template>
       <!-- <div class="semi-circle" v-waves @click="goHome('/index')">
             <img src="@/assets/images/home.png" alt="" class="wh48">
      </div> -->
    <div class="base-menu">
        <div :class="{'bg-[#24B287]!':$route.path==='/index'}" class="w-80px h-64px flex flex-col justify-center items-center active:bg-#eeeeee cursor-pointer" @click="goHome('/index')">
              <img src="@/assets/images/V4/home.png" alt="" class="w-28px h-28px" v-if="$route.path==='/index'">
              <img src="@/assets/images/V4/home@2x.png" alt="" class="w-28px h-28px" v-else>
              <span class="color-[#384951] text-[12px]" :class="{'color-[#fff]!':$route.path==='/index'}">首页</span>
        </div>
        <div class="menu-container mr-auto" @mouseleave="hideChildMenu">
            <div class="menus cursor-pointer" v-for="(value,index) in menus" key="index"
            @mouseenter="showChildMenu(value.path)"
            @click="toView(value)"
            >
                <Transition name="child">
                    <div class="menu-child" v-if="value.path===currentMenu && value.child?.length">
                       <div class="menu-child-box">
                           <div v-for="(item,i) in value.child" :key="i"
                           class="menu-child-item"
                           :class="{'bg-[#24B287]! color-[#ffffff]!':item.path===currentChildMenu}"
                           @click="toChild(item)"
                           v-show="!item.hidden"
                           >
                              {{ item.name }}
                           </div>
                       </div>
                       <div class="h-8px bg-transparent rounded-12px"></div>
                    </div>
                </Transition>
                 <div class="menu-item" :class="{'active':value.name==currentParentMenuCom || value.path===currentPath}">{{value.name}}</div>
             </div>
        </div>
        <div class="setting" v-if="showScreen">
             <div @click="selectMenu('监测大屏')" :class="{'setting_active':_curScreen==='监测大屏'}"> 
                <img :src="_curScreen==='监测大屏' ? getAssetsFileImages('plansel.png')  :getAssetsFileImages('screen.png')" alt="">
                <span>监测大屏</span>
                </div>
             <div @click="selectMenu('报告打印')" :class="{'setting_active':_curScreen==='报告打印'}"> 
                <img :src="_curScreen==='报告打印' ? getAssetsFileImages('dasel.png')  :getAssetsFileImages('prtting.png')" alt="">
                <span>报告打印</span>
             </div>
              <div @click="selectMenu('患者教育')" :class="{'setting_active':_curScreen==='患者教育'}"> 
                <img :src="_curScreen==='患者教育' ? getAssetsFileImages('hzjysel.png')  :getAssetsFileImages('hzjy.png')" alt="">
                <span>患者教育</span>
             </div>
             <!-- c:\Users\Administrator\Downloads\icon／设置@2x.png c:\Users\Administrator\Downloads\icon／患者教育@2x (1).png -->
             <!-- <div @click="selectMenu('监测计划')" :class="{'setting_active':_curScreen==='监测计划'}">
                <img :src="_curScreen==='监测计划' ? getAssetsFileImages('screensel.png')  :getAssetsFileImages('textfile.png')" alt="">
                <span>监测计划</span>
             </div> -->
           
             <div @click="selectMenu('设置')" :class="{'setting_active':_curScreen==='设置'}">
                <img :src="_curScreen==='设置' ? getAssetsFileImages('setttingsel.png') : getAssetsFileImages('setting.png')" alt="">
                <span>设置</span>
             </div>
        </div>
        <!-- RIGHT MENUS -->
        <Transition name="scale">
             <div v-if="rightMenusCom.length" class="right-menus flex p-40px bg-#384951 rounded-12px gap-20px">
                <div v-for="(item,index) in rightMenusCom"
                class="right-menu flex flex-col justify-center items-center gap-10px w-120px h-120px bg-#fff rounded-12px border-box"
                @mouseenter="showRightMenu(index)" @mouseleave="hideRightMenu(index)"
                @click="routerto(item.path)"
                :class="{'active-right-menu':currentRightMenu===index}"
                >
                    <img class="w-48px h-48px" :src="currentRightMenu==index ? getComMonAssets(item.selicon)  : getComMonAssets(item.icon)" alt="">
                    <span class="text-[#636676] text-14px font-medium">{{ item.name }}</span>
                </div>
            </div>
        </Transition>
       
         
    </div>
</template>

<script setup>
import vWaves from "@/utils/directive/waves";
import { computed, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import {  getComMonAssets } from "@/utils/function/function";
import { useMenuSelect } from "@/stores/menuSelect";
const { currentMenu,changeCurrentMenu,currentChildMenu,changeCurrentChildMenu } =  toRefs(useMenuSelect());
const router = useRouter();
import { getAssetsFileImages } from "@/utils/function/function";
import { useCounterStore } from "@/stores/counter";
const counterStore = useCounterStore();
const menus = ref([{
            name:"设备管理",
            path:"/wardOverview/equipmentManagement"
        },{
            name:"患者管理",
            path:"/home/patientManagement"
        },{
            name:"佩戴情况管理",
            path:"/wardOverview/wearingSituationManagement"
        },{
            name:"主动随访",
            path:"/researchfollowup/activefollowup"
        },{
            name:"脱组记录",
            path:"/researchfollowup/groupRemovalRecord"
        },{
            name:"医嘱管理",
            path:"/researchfollowup/medicalorder"
        }
    ]);

    const showScreen = ref(false); 

watch(()=>router.currentRoute.value, (val) => {
    menus.value = val.meta.baseMenuList;
    showScreen.value = (val.meta.hideRight!==1)
    changeCurrentChildMenu.value(val.path);
},{immediate:true});

const currentPath = computed(()=>{
      let _r = router.currentRoute.value.path;
      return _r;
})
const currentParentMenuCom = computed(()=>{
    let _r = router.currentRoute.value.meta.title;
    if(menus.value && Array.isArray(menus.value) && menus.value.length>0){
        let _txt = null;
         for (let i = 0; i <  menus.value.length; i++) {
            const element = menus.value[i];
            if(element.child && Array.isArray(element.child) && element.child.length>0){
                for (let j = 0; j < element.child.length; j++) {
                    const child = element.child[j];
                    if(child.name == _r){
                        _txt = element.name;
                        break;
                    }
                }
            }
            if(_txt){
               break;
            }
         }
         return _txt;
    }
    return null;
})

const _curScreen = ref('');
const rightMenusCom = computed(()=>{    
        let _menus = [];
        if(rightMenus.value[_curScreen.value]){
                _menus = rightMenus.value[_curScreen.value];
        }
        return _menus;
});

const showChildMenu = (path)=>{
     changeCurrentMenu.value(path);
}

const toView = (value)=>{
    if(!value.child || !Array.isArray(value.child) || value.child.length==0){
         router.push(value.path);
         changeCurrentMenu.value(value.path);
    }
}


const hideChildMenu = (path)=>{
     changeCurrentMenu.value('-1');
}

// 
const toChild = (item)=>{
        router.push(item.path)    
        changeCurrentChildMenu.value(item.path)
}


const goHome = (path)=>{
    _curScreen.value = '';
     router.push(path);
     counterStore.increment()
     changeCurrentMenu.value("-1");
}

const routerto = (path) => {
    _curScreen.value = '';
    router.push({name:path});
}

const rightMenus = ref(
    {
        "监测大屏":[{
            name:"病区监护总览",
            path:"wardMonitoring",
            icon:"1.png",
            selicon:"1sel.png"
        },{
            name:"病区活动总览",
            path:"wardMovementAnalysis",
            icon:"2.png",
            selicon:"2sel.png", 
        },{
            name:"病区血糖总览",
            path:"overviewofBlood",
            icon:"11.png",
            selicon:"11sel.png", 
        }
    
    ],
        "监测计划":[{
            name:"心电监测计划",
            icon:"3.png",
            path:"electrocardiogramMonitoringplan",
            selicon:"3sel.png",
        },
        {
            name:"血压监测计划",
            icon:"4.png",
            path:"bloodpressuremonitoringplan",
            selicon:"4sel.png",
        },{
            name:"康复训练计划",
            icon:"5.png",
            path:"rehabilitationTrainingplan",
            selicon:"5sel.png",
        },{
            name:"呼吸训练",
            icon:"6.png",
            path:"breathingTraining",
            selicon:"6sel.png",
        }],
        "设置":[{
            name:"HRV开关",
            icon:"7.png",
            path:"hrvAnalysis",
            selicon:"7sel.png",
        },{
            name:"霸屏管理",
            icon:"8.png",
            path:"blockingManagement",
            selicon:"8sel.png",
        },{
            name:"护理配置",
            icon:"9.png",
            path:"tagManagement",
            selicon:"9sel.png",
        },{
            name:"药品管理",
            icon:"10.png",
            path:"drugAdministration",
            selicon:"10sel.png",
        }
        
        
        ],

    }
);

const selectMenu = (name) => {
    if (_curScreen.value === name) {
         _curScreen.value = '';
        return;
    }
     if(name==='患者教育'){
        router.push({name:"patientEducation"});
        _curScreen.value = name;
        // changeCurrentMenu.value(name);
         return;
    }
    if(name==='监测大屏'){
        router.push({name:"wardMonitoring"});
        _curScreen.value = name;
        // changeCurrentMenu.value(name);
         return;
    }
    if(name==='报告打印'){
        router.push({name:"nursingReport"});
        _curScreen.value = name;
        // changeCurrentMenu.value(name);
         return;
    }
    _curScreen.value = name;
    
}


const currentRightMenu = ref(0);
const showRightMenu = (index) => {
    currentRightMenu.value = index;
}
const hideRightMenu = () => {
    currentRightMenu.value = -1;
}

</script>

<style scoped>
.semi-circle{
    width: 100px;
    height: 100px;
    border-radius: 0 200px 0 0;
    background-color: #24B287;
    position: fixed;
    z-index: 100;
    left: 0;
    bottom: 0;
    cursor: pointer;
    .wh48{
        width: 48px;
        height: 48px;
        margin-top: 36px;
        margin-left: 16px;
    }
}
.setting_active{
    background-color: #24B287 !important;
    color: #fff !important;
    font-weight: 800 !important;
}
.setting_active span{
    color: #fff !important;
}
.base-menu{
    position: fixed;
    z-index: 2001;
    bottom: 0;
    width: 100vw;
    height: 64px;
    background-color: #fff; 
    box-sizing: border-box;
    padding: 0 0px 0 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0px -2px 8px 0px rgba(146, 159, 175, 0.24);
    .menu-container{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 20px;
        gap: 20px;
        .menus{
            min-width: 80px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            /* padding: 0 20px; */
            /* border-left: 1px solid #24B287;
            border-right: 1px solid #24B287; */
            position: relative;
            height: 30px;
            .menu-child{
               min-width: 144px;
               min-height: 100px;
               position: absolute;
               bottom: 30px;
               /* background: #fff; */
                /* border-radius: 12px 12px 12px 12px; */
            }
            .menu-child-box{
                 background: #fff;
                min-width: 144px;
               min-height: 100px;
               border-radius: 12px 12px 12px 12px;
               border: 1px solid #EEEEEE;  
               padding: 12px;  
               display: flex;
               flex-direction: column;
               gap: 12px;
               align-items: center;
            }
            .menu-child-item{
                 min-width: 120px;
                 width: fit-content;
                 white-space: nowrap;
                 text-align: center;
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 padding: 0px 18px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                color: #384951;
                border-radius: 8px 8px 8px 8px;
            }
            .menu-child-item:hover{
                background: #24B287;
                color: #fff;
            }
            .menu-item{
                width: fit-content;
                display: block;
                box-sizing: border-box;
                height: 30px;
                line-height: 30px;
                padding: 0px 20px;
                font-size: 14px;
                color: #384951;
                font-weight: 500;
                border-radius: 24px 24px 24px 24px;
                text-decoration: none;
            }
             &:first-child{
                border-left: none;
            }
            &:last-child{
                border-right: none;
            }
            .menu-item:hover{
                background-color: #24B287;
                color: #fff;
                font-weight: 800;
                border: none;
                box-shadow: none;
            }
          
        }
    }

      .active{
                background-color: #24B287 !important;
                color: #fff !important;
                font-weight: 800 !important;
                border: none !important;
                box-shadow: none !important;
            }

    .setting{
        margin-left: auto;
        display: flex;
        /* width: 288px; */
        height: 100%;
        &>div{
            width: 72px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-left: 1px solid #E5E5E5;

                 img{
                width: 28px;
                height: 28px;
                margin-bottom: 4px;
                    }
                    span{
                        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
                        font-weight: normal;
                        font-size: 12px;
                        color: #384951;
                    }
                    &:active{
                        background-color: rgba(0, 0, 0, .1);
                }

           
    }
    }
}

.right-menu{
    box-shadow: 4px 4px 12px 0px rgba(56,73,81,0.24);
}
.active-right-menu{
    background: #24B287;
}
.active-right-menu span{
    color: #fff !important;
}
.right-menus{
    position: fixed;
  height: 200px;
  right: 10px;
  bottom: 74px;
  box-sizing: border-box;
}
.child-enter-active,.child-leave-active{
  /* transition: opacity 0.3s linear; */
}
.scale-enter-from {
  opacity: 1;
}

.scale-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transform-origin: bottom right;
  position: fixed;
  /* bottom: 20px; */
  right: 20px;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0);
}

</style>
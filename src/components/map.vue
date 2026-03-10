<script setup>
import { onMounted, onUnmounted,watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {getAssetsAddressFileNew} from "@/utils/function/function";

let map = null;

const addLabelMarker = (AMap)=>{
  // 创建一个 LabelMarker 实例
  let labelMarker = new AMap.LabelMarker({
      position: [props.latlng.lng, props.latlng.lat],
      opacity: 1,
      zIndex: 2,
      icon: {
          image: getAssetsAddressFileNew('address.png'),
          anchor: 'bottom-center',
          size: [48, 48]
      }
  });
  // 创建一个 LabelsLayer 实例来承载 LabelMarker，[LabelsLayer 文档](https://lbs.amap.com/api/jsapi-v2/documentation#labelslayer)
  var labelsLayer = new AMap.LabelsLayer({
      collision: true,
  });
  // 将 LabelMarker 实例添加到 LabelsLayer 上
  labelsLayer.add(labelMarker);
  // 将 LabelsLayer 添加到地图上
  map.add(labelsLayer);

}


const loadLocation = () => {
   //异步加载工具条插件
            AMap.plugin("AMap.Geolocation", function () {
              //在回调函数中实例化插件，并使用插件功能
              var Geolocation = new AMap.Geolocation(
                {
                  enableHighAccuracy: false, // 是否使用高精度定位，默认：true
                  timeout: 100000, // 设置定位超时时间，默认：无穷大
                  offset: [10, 20],  // 定位按钮的停靠位置的偏移量
                  zoomToAccuracy: false,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  position: 'RB' //  定位按钮的排放位置,  RB表示右下
                }
              ); //创建工具条插件实例
                map.addControl(Geolocation); //添加工具条插件到页面
                    Geolocation.getCurrentPosition(function(status,result){
                  if(status=='complete'){
                      onComplete(result)
                  }else{
                      onError(result)
                  }
            });
            })

            function onComplete(data) {
            }

            function onError(data) {
            }
}


const addpoil = () => {
      // 中心点坐标
    const center = {
      lat: 30.476166,
      lng: 114.402176
    };
    const hexagonFence = [];
    const radius = 0.01; // 半径
    for (let i = 0; i < 7; i++){
          const angle = (i * 60 * Math.PI) / 180;
          const lng = center.lng + radius * Math.cos(angle);
          const lat = center.lat + radius * Math.sin(angle);
          hexagonFence.push([lng, lat]);
        //创建圆形点标记 CircleMarker 实例
        var circleMarker = new AMap.CircleMarker({
          center:  new AMap.LngLat(lng,lat), //圆心
          radius: 5, //半径
          strokeColor: "#F7413D", //轮廓线颜色
          strokeWeight: 2, //轮廓线宽度
          strokeOpacity: 1, //轮廓线透明度
          strokeStyle: "solid", //轮廓线样式
          fillColor: "#fff", //圆点填充颜色
          fillOpacity: 1, //圆点填充透明度
          zIndex: 100, //圆点覆盖物的叠加顺序
          cursor: "pointer", //鼠标悬停时的鼠标样式
        });

        map.add(circleMarker);
      
    }

    


    const polygon = new AMap.Polygon({
      path: hexagonFence, //多边形路径
      fillColor: "#FBD7D6", //多边形填充颜色
      strokeOpacity: 1, //线条透明度
      fillOpacity: 0.5, //填充透明度
      strokeColor: "#F7413D", //线条颜色
      strokeWeight: 2, //线条宽度
      strokeStyle: "solid", //线样式
      strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
    });
    map.add(polygon);
}

const props = defineProps({
  latlng: {
    type: Object,
    default: () => ({
      lat: 30.476166, 
      lng: 114.402176
    })
  }
})


 watch(()=>props.latlng, (newVal, oldVal) => {
  
  AMapLoader.load({
    key: "a9de14dc7ef11d7dc60c1d99778f0ba0", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 14, // 初始化地图级别
        center: [props.latlng.lng,props.latlng.lat], // 初始化地图中心点位置
      });
      addLabelMarker(AMap);
      // loadLocation();
      // addpoil();
    })
    .catch((e) => {
    });
        // console.log(newVal, oldVal)
      })

onMounted(() => {
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>

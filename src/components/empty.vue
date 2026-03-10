<template>
   <div class="list_no_data">
      <img src="@/assets/images/nodata.png" :style="customStyle"/>
      <div :style="{color: customStyle.color || '#929faf'}">{{ msg }}</div>
    </div>
</template>

<script setup>

const props = defineProps({
  customStyle:{
    type: Object,
    default: () => ({})
  },
  msg: {
    type: String,
    default: '未查询到相关信息~'
  }
})
</script>


<style scoped>
.list_no_data {
  font-size: 16px;
  color: #929faf;
  text-align: center;
  padding-top: 10vh;
   margin: 0 auto;
}

.list_no_data img {
  width: 240px;
  margin: 0 auto;
}
</style>
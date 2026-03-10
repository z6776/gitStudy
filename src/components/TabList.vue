<template>
  <div 
    class="tab-list-container"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${column}, 1fr)`,
      gap: '10px'
    }"
  >
    <div
      v-for="item in list"
      :key="item.value"
      :class="['tab-item', { selected: isSelected(item.value) }]"
      @click="handleClick(item)"
    >
      <img src="@/assets/images/V2/gougou3.png" alt="" class="w-16px h-12px mr-10px flex-shrink-0" v-if="isSelected(item.value)">
      <span>{{ item.label }}</span>
      <img src="@/assets/images/V2/delicon.png" alt="" class="w-20px h-20px ab" v-if="type==='del'" @click="delItem(item)">
      <img src="@/assets/images/V2/delicon.png" alt="" class="w-20px h-20px ab" v-if="type==='delByItem' && item.showDel" @click="delItem(item)">
    </div>
      <div class="tab-item flex justify-center items-center  rounded-[4px] bg-[#F5F7FB] active:bg-[#EEEEEE] cursor-pointer" @click="addTag" v-if="showAddIcon">
        <img src="@/assets/images/V2/addicon2.png" alt="" srcset="" class="w-20px h-20px">
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import   { ElMessage } from "element-plus"
const props = defineProps({
  // 选择类型：single-单选，multiple-多选
  type: {
    type: String,
    require:true,
    validator: (value) => ['single', 'multiple',"del",'delByItem'].includes(value)
  },
  // 每行显示的标签数量
  column: {
    type: Number,
    default: 3,
    validator: (value) => value > 0
  },
  // 标签数据列表
  list: {
    type: Array,
    default: () => [],
    validator: (value) => Array.isArray(value)
  },
  // 是否最后显示添加按钮
  showAddIcon:{
    type:Boolean,
    default:false
  },
  disabled:{
    type:Boolean,
    default:false
  }
})

const emit = defineEmits(['change','del',"add"])

// 
const addTag = () => {
  emit('add',props.list)
}



// 选中的值
const selectedValues = ref([])

// 监听 list 变化，处理回显
watch(() => props.list, (newList) => {
  if (newList && newList.length) {
    // 找出所有 selected 为 true 的项
    const selectedItems = newList.filter(item => item.selected)
    // 更新选中值
    if (props.type === 'single') {
      // 单选模式只取第一个
      selectedValues.value = selectedItems.length ? [selectedItems[0].value] : []
    } 
    if (props.type === 'multiple')  {
      // 多选模式取所有
      selectedValues.value = selectedItems.map(item => item.value)
    }
  }
}, { immediate: true,deep:true })

// 判断是否选中
const isSelected = (value) => {
  return selectedValues.value.includes(value)
}

// 处理点击事件
const handleClick = (item) => {
  if (props.disabled) return;
  item.selected = !item.selected;
  if (props.type === 'single') {
    // 单选模式
    selectedValues.value = [item.value]
    emit('change', [item.value])
  }
  if(props.type === 'multiple') {
    // 多选模式
    const index = selectedValues.value.indexOf(item.value)
    if (index > -1) {
      selectedValues.value.splice(index, 1)
    } else {
      selectedValues.value.push(item.value)
    }
    emit('change', [...selectedValues.value])
  }
}
// 处理删除事件
const delItem = (item) => {
    const index = props.list.findIndex((value)=>{
        return item.value === value.value
    });
    if(index>-1){
       emit("del", index)
        return index;
    }
    ElMessage.error("没有该项目");
    
}



</script>

<style scoped>
.tab-list-container {
  width: 100%;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #F5F7FB;
  color: #636676;
  border:1px solid #F5F7FB;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .ab{
     position: absolute;
     top: -10px;
     right: -10px;
     z-index: 99;
  }
}

.tab-item.selected {
  background-color: #EAFFF9;
  color: #24B287;
  border:1px solid #24B287;
}

.tab-item:hover {
  opacity: 0.8;
}
</style>

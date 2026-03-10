<template>
  <div class="device-item" @click="handleClick">
    <div class="left-content">
      <img :src="deviceImage" alt="device" class="device-image" />
    </div>
    
    <div class="center-content">
      <div class="device-model">
        <span class="color-[#636676] text-[16px]">设备型号：</span>
        <span class="coor-[#384951] text-[16px]"> {{ model }}</span>
        
        </div>
      <div class="device-ccid">
        <span class="color-[#636676] text-[16px]">设备CCID：</span>
        <span class="coor-[#384951] text-[16px]">{{ ccid }}</span>
        </div>
    </div>
    
    <div class="right-content">
      <img 
        :src="selected ? openIcon : closeIcon" 
        alt="status" 
        class="status-icon"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: {
    type: String,
    required: true
  },
  ccid: {
    type: String,
    required: true
  },
  deviceImage: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue','handleClick'])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const openIcon = new URL('@/assets/images/V2/isopen.png', import.meta.url).href
const closeIcon = new URL('@/assets/images/V2/isclose.png', import.meta.url).href

const handleClick = () => {
    emit("handleClick")
}
</script>

<style scoped>
.device-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.device-item:hover {
  background-color: #f5f5f5;
}

.left-content {
  margin-right: 12px;
}

.device-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

 
 
.right-content {
  margin-left: 12px;
}

.status-icon {
  width: 24px;
  height: 24px;
}
</style>

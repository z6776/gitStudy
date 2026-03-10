<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :modal-class="modalClass"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="false"
    @close="handleClose"
    :before-close="beforeClose"
    :draggable="draggable"
    :center="center"
    :align-center="alignCenter"
    :destroy-on-close="destroyOnClose"
    :open-delay="openDelay"
    :close-delay="closeDelay"
  >
    <!-- 自定义标题栏 -->
    <template #header>
      <div class="custom-dialog-header">
        <span class="header-title">{{ title }}</span>
        <img 
          :src="closeIcon"
          class="custom-close-btn"
          @click="handleClose"
        />
      </div>
    </template>
    
    <!-- 使用默认插槽传递内容 -->
    <slot></slot>
    
    <!-- 使用默认插槽传递底部内容 -->
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import closeIcon from '@/assets/images/close_icon.png'
// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '50%'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  modalClass: String,
  appendToBody: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  customClass: String,
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
 
  beforeClose: Function,
  draggable: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  },
  alignCenter: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  openDelay: {
    type: Number,
    default: 0
  },
  closeDelay: {
    type: Number,
    default: 0
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'close'])

// 处理弹窗显示/隐藏
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 处理关闭按钮点击
const handleClose = () => {
    const done = () => {
      emit('close')
     emit('update:modelValue', false)
    }
  if(props.beforeClose && typeof props.beforeClose === 'function'){
        props.beforeClose(done);
  }else{
   done();
  }
}

</script>

<style scoped>
.custom-dialog-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  color: #384951;
  font-weight: bold;
}

.custom-close-btn {
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.custom-close-btn:hover {
  opacity: 0.7;
}
</style>

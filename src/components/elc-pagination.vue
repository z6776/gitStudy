<template>
  <div class="my-pagination" v-if="total > 0">
    <!-- 总条数 -->
    <div class="pagination-total" v-if="layout.includes('total')">
      <span class="mr-12px">{{ internalPageSize }} 条/页</span>
      <span>共 {{ total }} 条</span>
    </div>

   

    <!-- 上一页按钮 -->
    <button
      class="pagination-btn-prev"
      :disabled="internalCurrentPage === 1"
      v-if="layout.includes('prev')"
      @click="prev"
    >
      <img src="@/assets/images/icons/arrow-left.png" alt="" class="w-12px h-12px">
    </button>

    <!-- 页码列表 -->
    <ul class="pagination-pager" v-if="layout.includes('pager')">
      <!-- 第一页 -->
      <li :class="{ active: internalCurrentPage === 1 }" @click="goToPage(1)">1</li>
      <li v-if="showFirstOmit" style="border: none;background-color: transparent;">...</li>
      
      <!-- 中间页码 -->
      <li
        v-for="pager in pagers"
        :key="pager"
        :class="{ active: internalCurrentPage === pager }"
        @click="goToPage(pager)"
      >
        {{ pager }}
      </li>

      <!-- 最后一页 -->
      <li v-if="showLastOmit" style="border: none;background-color: transparent;">...</li>
      <li v-if="showLast" :class="{ active: internalCurrentPage === pageCount }" @click="goToPage(pageCount)">
        {{ pageCount }}
      </li>
    </ul>

    <!-- 下一页按钮 -->
    <button
      class="pagination-btn-next"
      :disabled="internalCurrentPage === pageCount"
      v-if="layout.includes('next')"
      @click="next"
    >
         <img src="@/assets/images/icons/arrow-left.png" alt="" class="w-12px h-12px"></img>
    </button>

     <!-- 每页显示条数选择器 -->
    <div class="pagination-sizes" v-if="layout.includes('sizes')">
      <select v-model="internalPageSize" @change="handleSizeChange">
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }} 条/页
        </option>
      </select>
    </div>

    <!-- 跳转输入框 -->
    <div class="pagination-jumper" v-if="layout.includes('jumper')">
      跳至
      <input
        type="number"
        :min="1"
        :max="pageCount"
        v-model.number="jumpPage"
        @keyup.enter="handleJump"
      />
      页
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 定义 props，与 el-pagination 保持一致
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    required: true,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40, 50],
  },
  layout: {
    type: String,
    default: 'prev, pager, next, jumper, sizes, total',
  },
});

// 定义 emits，与 el-pagination 保持一致
const emit = defineEmits(['update:currentPage', 'update:pageSize', 'size-change', 'current-change']);

// 内部状态，用于 v-model
const internalCurrentPage = ref(props.currentPage);
const internalPageSize = ref(props.pageSize);
const jumpPage = ref(null);

// 监听外部 props 变化，同步到内部状态
watch(() => props.currentPage, (newVal) => {
  internalCurrentPage.value = newVal;
});
watch(() => props.pageSize, (newVal) => {
  internalPageSize.value = newVal;
});

// 计算总页数
const pageCount = computed(() => Math.ceil(props.total / internalPageSize.value));

// 处理页码变化的逻辑
const goToPage = (page) => {
  if (page < 1 || page > pageCount.value || page === internalCurrentPage.value) return;
  internalCurrentPage.value = page;
  emit('update:currentPage', page);
  emit('current-change', page);
};

const prev = () => goToPage(internalCurrentPage.value - 1);
const next = () => goToPage(internalCurrentPage.value + 1);

// 处理每页条数变化
const handleSizeChange = (e) => {
  const newPageSize = parseInt(e.target.value, 10);
  internalPageSize.value = newPageSize;
 
  internalCurrentPage.value = 1; // 页数重置为 1
  emit('update:pageSize', newPageSize);
  emit('update:currentPage', 1);
     emit('size-change', newPageSize);
    emit('current-change', 1);

};

// 处理跳转
const handleJump = () => {
  const page = parseInt(jumpPage.value, 10);
  if (!isNaN(page)) {
    goToPage(page);
  }
  jumpPage.value = null; // 清空输入框
};

  const pagerCount = 5; // 最多连续显示的页码按钮数 不包含首尾
// 计算需要显示的页码
const pagers = computed(() => {
  const current = internalCurrentPage.value;
  const total = pageCount.value;
  let arr  = [];
  // 不显示省略号
  if (total <= pagerCount) {
     for (let i = 2; i < total; i++) {
        arr.push(i);
     }
     return arr;
  };
  if(current>pagerCount-1){
     if(current<total-2){ // 显示两个省略号
       return [current-2,current-1,current,current+1,current+2];
     }else if(current==total-2){// 不显示尾端省略号
       return [current-3,current-2,current-1,current,current+1];
     }else if(current==total-1){// 不显示尾端省略号
       return [current-4,current-3,current-2,current-1,current];
     }else{ //不显示尾端省略号
       return [current-5,current-4,current-3,current-2,current-1];
     }
  }else{
     return [2,3,4,5,6];
  }
});

// 计算是否显示第一页、最后一页和省略号
// const showFirstPage = computed(() => pagers.value.length > 0 && pagers.value[0] > 2);
const showFirstOmit = computed(() => internalCurrentPage.value > pagerCount-1);
const showLastOmit = computed(() => internalCurrentPage.value <= pageCount.value - 4);
const showLast = computed(() => pageCount.value > 1 );
</script>

<style scoped>
/* 使用 CSS 变量方便自定义 */
.my-pagination {
  /* --- CSS 变量定义区域 --- */
  --pagination-font-size: 14px;
  --pagination-color: #929FAF;
  --pagination-bg-color: #fff;
  --pagination-border-color: #929FAF;
  --pagination-border-radius: 2px;
  --pagination-button-hover-bg: #f5f7fa;
  --pagination-button-disabled-color: #c0c4cc;
  --pagination-active-color: #24B287;
  --pagination-active-bg: #24B287;
  /* --- CSS 变量定义区域结束 --- */

  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: var(--pagination-font-size);
  color: var(--pagination-color);
  user-select: none;
  margin-top: 10px;
}
input{
  color: #000000 !important;
  margin: 0 5px;
  outline: var(--pagination-active-bg);
}



.my-pagination .pagination-total,
.my-pagination .pagination-sizes,
.my-pagination .pagination-jumper {
  margin-right: 10px;
}

.my-pagination .pagination-btn {
  padding: 0 6px;
  min-width: 32px;
  height: 28px;
  background: var(--pagination-bg-color);
  border: 1px solid var(--pagination-border-color);
  border-radius: var(--pagination-border-radius);
  cursor: pointer;
  margin: 0 5px;
  font-weight: bold;
}

.my-pagination .pagination-btn:hover:not(:disabled) {
  color: var(--pagination-active-color);
}

.my-pagination .pagination-btn:disabled {
  color: var(--pagination-button-disabled-color);
  cursor: not-allowed;
}

.my-pagination .pagination-pager {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 5px;
  margin: 0 5px;
}

.my-pagination .pagination-pager li {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: var(--pagination-bg-color);
  border: 1px solid var(--pagination-border-color);
  border-radius: var(--pagination-border-radius);
  cursor: pointer;
}

.my-pagination .pagination-pager li:hover {
    border-color: var(--pagination-active-bg);
  color: var(--pagination-active-color);
}

.my-pagination .pagination-pager li.active {
  color:  var(--pagination-active-bg);;
  border-color: var(--pagination-active-bg);
  cursor: default;
}

.my-pagination .pagination-sizes select {
  height: 28px;
  line-height: 28px;
  padding: 0 5px;
  border-radius: var(--pagination-border-radius);
  border: 1px solid var(--pagination-border-color);
  color: var(--pagination-color);
  background-color: var(--pagination-bg-color);
  margin: 0 5px;
  outline: none;
  margin-right: 0px;
  font-size: 14px;
}

.my-pagination .pagination-jumper input {
  width: 46px;
  height: 28px;
  padding: 0 3px;
  text-align: center;
  box-sizing: border-box;
  border-radius: var(--pagination-border-radius);
  border: 1px solid var(--pagination-border-color);
  color: var(--pagination-color);
  background-color: var(--pagination-bg-color);
}

.pagination-btn-prev{
    
   width: 26px;
   height: 26px;
   flex-shrink: 0;
   line-height: 24px;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: var(--pagination-border-radius);
   border: 1px solid var(--pagination-border-color);
   color: var(--pagination-color);
   background-color: var(--pagination-bg-color);
   cursor: pointer;
}

.pagination-btn-next{
  flex-shrink: 0;
     width: 26px;
   height: 26px;
   display: flex;
   justify-content: center;
   align-items: center;
    line-height: 24px;
   text-align: center;
   border-radius: var(--pagination-border-radius);
   border: 1px solid var(--pagination-border-color);
   color: var(--pagination-color);
   background-color: var(--pagination-bg-color);
   cursor: pointer;
}
.pagination-btn-next img{
    transform: rotate(180deg);
}
</style>

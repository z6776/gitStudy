<template>
  <el-tooltip
    v-if="isOverflow"
    effect="dark"
    :content="content"
    :placement="placement"
  >
    <div ref="contentRef" class="overflowhidden" :style="{'width':getRem(maxwidth)+'px'}">
          <slot /> 
    </div>
  </el-tooltip>
  <div v-else ref="contentRefEnough" class="contentRefEnough" :style="{'width':getRem(maxwidth)+'px'}">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { getRem } from "@/utils/function/function";
const props = defineProps<{ content: string,placement:string,maxwidth:number}>()
const contentRefEnough = ref<HTMLElement>()
const isOverflow = ref(false)
const checkOverflow = () => {
  const el = contentRefEnough.value
  if (el) {
    isOverflow.value = el.scrollWidth > el.offsetWidth;
  }
}
onMounted(() => nextTick(checkOverflow))
watch(() => props.content, () => nextTick(checkOverflow))
</script>

<style scoped>
.overflowhidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}


.contentRefEnough{
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
}
</style>
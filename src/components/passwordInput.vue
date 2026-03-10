<template>
  <div class="password-input">
    <div
      v-for="(item, idx) in length"
      :key="idx"
      class="input-box"
      :class="{ active: currentIndex === idx, error: errorIndex === idx }"
      @click="focusInput(idx)"
    >
      <input
        ref="inputs"
        type="password"
        maxlength="1"
        v-model="valueArr[idx]"
        @input="debouncedHandleInput($event, idx)"
        @keydown.backspace.prevent="onBackspace(idx)"
        @focus="currentIndex = idx"
        :disabled="disabled"
        autocomplete="off"
      />
      <!-- 密码点/星号 -->
      <span v-if="valueArr[idx]" class="dot">*</span>
    </div>
  </div>
</template>
<script>
import { debounce} from "@/utils/function/function";
export default {
  name: 'PasswordInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 6
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      
      valueArr: Array(this.length).fill(''),
      currentIndex: 0,
      errorIndex: -1
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      deep:true,
      handler(val) {
          this.valueArr = (val || '').split(',').concat(Array(this.length).fill('')).slice(0, this.length)
      }
    },
    valueArr: {
      deep: true,
      handler(val) {
        let flag = val.every(item=>item!== '')
        if(flag){
            this.$emit('success', val.join(''));
        }
      }
    }
  },
 
  methods: {
     debouncedHandleInput: debounce(function(e, idx) {
      this.onInput(e, idx);
    }, 100),
     handleInput() {
      this.$emit('update:modelValue', this.valueArr.join(','))
     },
    clearInput() {
      this.valueArr = Array(this.length).fill('');
      this.currentIndex = 0;
      this.errorIndex = -1;
    },
    focusInput(idx) {
      this.currentIndex = idx;
      this.$refs.inputs[idx].focus();
    },
    onInput(e,idx) {
      const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 1);
      this.valueArr[idx] = val;
      if (val && idx < this.length - 1) {
        this.focusInput(idx + 1);
      }
    },
    onBackspace(idx) {
      if (this.valueArr[idx]) {
           this.valueArr[idx] = ""
      } else if (idx > 0) {
        this.focusInput(idx - 1);
        this.valueArr[idx-1] = ""
      }
    }
  }
}
</script>

<style scoped>
.password-input {
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-box {
  width: 48px;
  height: 48px;

  border: 1px solid #EEEEEE;
  border-radius: 8px;
  margin: 0 8px;
  position: relative;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.2s;
}
.input-box.active {
  border: 1.5px solid #409eff;
}
.input-box.error {
  border: 1.5px solid #f56c6c;
}
.input-box input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 28px;
  color: transparent;
  caret-color: #409eff;
  outline: none;
  position: absolute;
  left: 0; top: 0;
}

.input-box .dot {
  font-size: 28px;
  color: #606266;
  pointer-events: none;
  user-select: none;
  position: absolute;
  left: 50%;
   top:  50%;
   transform: translate(-50%, -40%);
}

</style>
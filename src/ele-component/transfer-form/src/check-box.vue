<template>
  <div
    class="checkbox"
    :class="{
      'is-checked': curCheck.checked,
      'is-disabled': disabled,
      'border': border
    }"
    :style="{'min-width': width + 'px'}"
    @click="change"
  >
    <span 
      class="inner"
      :class="{
        'is-checked': curCheck.checked,
        'is-disabled': disabled,
      }">
      <input type="checkbox" v-model="curCheck.checked">
    </span>
    <span class="label">{{curCheck.text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    width: Number,
    border: Boolean,
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    check: Object,
    isMax: Boolean,
  },
  data() {
    return {
      curCheck: this.check,
    }
  },
  watch: {
    check(val) {
      this.curCheck = val;
    },
  },
  methods: {
    change() {
      if (!this.disabled) {
        // 未达到最大限制
        if (!this.isMax || this.curCheck.checked) {
          this.curCheck.checked = !this.curCheck.checked;
          this.$emit('change', this.curCheck);
        } else {
          this.$message.warning('已达到最大可选择数');
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  margin: 0 10px 10px 0;
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  .inner {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    input {
      opacity: 0;
      outline: none;
      position: absolute;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }
  .inner::after {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform .15s ease-in .05s;
    transform-origin: center;
  }
  .is-checked {
    background-color: #409eff;
    border-color: #409eff;
  }
  .is-disabled {
    background-color: #ebeef5;
    border-color: #ebeef5;
  }
  .is-checked::after {
    transform: rotate(45deg) scaleY(1);
  }
  .label {
    margin-left: 6px;
  }
}
.is-checked {
  border-color: #409eff;
}
.border {
  border: 1px solid #eee;
  border-radius: 2px;
}
.is-disabled {
  border-color: #ebeef5;
  cursor: not-allowed;
}
</style>
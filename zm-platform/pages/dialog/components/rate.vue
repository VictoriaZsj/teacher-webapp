<template>
  <div class="rate-box" v-if="isEdit">
    <div class="item" v-for="(item,index) in list" :key="index">
      <p :class="item.leftIs?'active':''" @click="itemClick(index,0)"></p>
      <p :class="item.rightIs?'active':''" @click="itemClick(index,-0.5)"></p>
    </div>
  </div>
  <div class="rate-box2" v-else>
    <div>{{v}}</div>
    <template v-for="(item,index) in list">
      <div class="item" :key="index" v-if="item.leftIs||item.rightIs">
        <p :class="item.leftIs?'active':''"></p>
        <p :class="item.rightIs?'active':''"></p>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 10
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      v: this.value
    };
  },
  watch:{
    value(_new){
      this.v = _new;
    }
  },
  computed: {
    list() {
      const total = this.total;
      const rate = this.v;
      const _ = [];
      for (let i = 1; i <= total; i++) {
        _.push({
          leftIs: total - rate < i - 0.5,
          rightIs: total - rate < i
        });
      }
      return _;
    }
  },
  methods: {
    itemClick(index, site) {
      const _ = this.total - index + site;
      const result = _ == this.v ? 0 : _;
      this.v = result;
      this.$emit('input',result)
    }
  }
};
</script>

<style lang="less" scoped>
.rate-box {
  height: 18px;
  display: inline-block;
  &:hover {
    .item > p {
      background-color: #ccc;
    }
  }
  & > div {
    width: 18px;
    height: 18px;
    float: right;
    margin-right: 8px;
    transition: all 0.2s linear;
    cursor: pointer;
    & > p {
      width: 9px;
      height: 18px;
      background-color: #ccc;
      background-image: url("./../../../../src/assets/xing.png");
      background-size: cover;
      float: right;
      &:first-child {
        background-position-x: -9px;
      }
      &.active {
        background-color: #fadb14;
      }
      &:hover {
        background-color: #fadb14 !important;
      }
      &:hover ~ p {
        background-color: #fadb14 !important;
      }
    }
    &:hover {
      transform: scale(1.1);
    }
    &:hover ~ .item {
      p {
        background-color: #fadb14;
      }
    }
  }
}
.rate-box2 {
  height: 18px;
  display: inline-block;
  & > div {
    width: 18px;
    height: 18px;
    float: right;
    margin-right: 8px;
    transition: all 0.5s linear;
    cursor: pointer;
    & > p {
      width: 9px;
      height: 18px;
      background-color: #fff;
      background-image: url("./../../../../src/assets/xing.png");
      background-repeat: no-repeat;
      background-size: 204%;
      float: right;
      &:first-child {
        background-position-x: -9px;
      }
      &.active {
        background-color: #fadb14;
      }
    }
  }
}
</style>
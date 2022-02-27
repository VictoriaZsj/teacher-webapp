<template>
  <el-dialog
    title="测试"
    v-model="dialogVisible"
    custom-class="transfer-dialog"
    width="100%">
    <el-checkbox v-model="checked" @change="handleChecked(checked)">备选项</el-checkbox>
    <div class="wrap">
      <div class="left">
        <h3>左侧</h3>
        <section>
          <!-- <div class="checkbox">
            <div class="top">
              <span class="title">个人信息</span>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedGroup">
              <el-checkbox
                v-for="city in cities"
                :label="city.label"
                :checked="city.checked"
                :key="city.label"
                border
                size="medium"
                @change="handleChecked(city.checked)"
              >{{city}}</el-checkbox>
            </el-checkbox-group>
          </div> -->
          
          <!-- <el-checkbox
            v-for="city in cities"
            :label="city.label"
            :key="city.label"
            :value="city.checked"
            border
            size="medium"
            @change="handleChecked(city)"
          ></el-checkbox> -->
        </section>
      </div>
      <div class="mid">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="right">
        <h3>右侧</h3>
        <section>
          <el-tag
            v-for="item in selectedItems"
            :key="item"
            effect="plain"
            size="medium"
            closable
            @close="handleClose"
          >{{item}}</el-tag>
        </section>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const cityOptions = [
  {label: '上海', checked: false},
  {label: '北京', checked: false},
  {label: '广州', checked: false},
  {label: '深圳', checked: false},
];
export default {
  data() {
    return {
      dialogVisible: true,
      isIndeterminate: true,
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      checked: false,
      selectedItems: [],
    }
  },
  methods: {
    handleCheckAllChange(val) {
      // console.log(val);
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedGroup(value) {
      // console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleChecked(val, val1) {
      console.log(val,this.checked);
    },
    // 移除已选项
    handleClose(item) {
      console.log(item);
    },
  },
  created() {
    // console.log('transfer', this.dialogVisible);
    // setTimeout(() => {
    //   this.dialogVisible = true;
    //   console.log(this.dialogVisible)
    // }, 2000);
  }
}
</script>

<style lang="scss">
.transfer-dialog {
  .el-dialog__body {
    background: #fff;
  }
}
</style>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  .left,.right {
    flex: 1;
    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: 500;
    }
    section {
      padding: 10px;
      height: 500px;
      border: 1px solid #eee;
      border-radius: 2px;
      .checkbox {
        margin-top: 10px;
        .top {
          display: flex;
          justify-content: space-between;
          .title {
            font-size: 14px;
            font-weight: 500;
          }
        }
        .el-checkbox {
          margin-right: 10px;
        }
      }
    }
  }
  .mid {
    margin: 0 5px;
    display: inline-block;
    font-size: 20px;
    color: #409EFF;
  }
}
</style>
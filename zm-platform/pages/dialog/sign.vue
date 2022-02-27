<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">入职时间</el-col>
        <el-col :span="20">
          <zm-datepicker type="day" v-model="options.time"></zm-datepicker>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input
            type="textarea"
            :rows="2"
            v-model="options.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
import entryOneSignContract from '../../api/action/entryOneSignContract';
import entryMultiSignContract from '../../api/action/entryMultiSignContract';

export default {
  data() {
    return {
      buttonState: false,
      today: '',
      options: {
        time: '',
        remark: ''
      }
    };
  },
  props: {
    currentID: null,
    viewState: false //false表示页面关闭，true表示页面展开
  },
  mounted() {
    let date = new Date();
    this.today =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' 00:00:00';
  },
  watch: {
    viewState(val) {
      if (!val) {
        this.default();
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$MessageBox
        .confirm('确定要签合同吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.buttonState = true;
          let params = { ...this.options };
          if (
            Object.prototype.toString.call(this.currentID) === '[object Array]'
          ) {
            params = Object.assign({}, params, { teaIds: this.currentID });
            entryMultiSignContract(params)
              .then((data) => {
                this.default();
                this.$Message({
                  message: '操作成功'
                });
                // 批量合同, 把值带出，给批量发合同结果弹框展示
                this.$emit('confirm', data);
              })
              .catch((message) => {
                this.buttonState = false;
                this.$Message({
                  message: message
                });
              });
          } else {
            params = Object.assign(params, { teaId: this.currentID });
            entryOneSignContract(params)
              .then((data) => {
                this.default();
                this.$emit('confirm');
              })
              .catch((message) => {
                this.buttonState = false;
                this.$Message({
                  message: message
                });
              });
          }
        })
        .catch((message) => {
          console.log(message);
        });
    },
    default() {
      this.options = {
        time: '',
        remark: ''
      };
      this.buttonState = false;
    }
  }
};
</script>
<style scoped>
.content {
  max-height: 400px;
}
.control {
  text-align: right;
  padding-top: 20px;
  background-color: white;
}
.el-row {
  padding: 10px;
}
.el-row div:first-child {
  line-height: 30px;
}
.el-row:after {
  content: '';
  display: table;
  clear: both;
}
.trainTopicContent {
  line-height: 30px;
}
</style>

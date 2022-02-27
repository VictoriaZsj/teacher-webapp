<template>
  <div class="post-match-wrapper">
    <el-form :model="formInline">
      <el-form-item label="老师等级：">
        <el-select
          @change="selectLevelChange"
          v-model="formInline.rating"
          placeholder="请选择老师等级"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="基本薪资：">
        <el-select
          v-model="formInline.monthSalary"
          placeholder="请选择基本薪资"
          disabled
        >
          <el-option
            v-for="item in salaryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <p class="red">注意：修改前请和招师专员沟通最终入职信息，非常重要</p>

    <div class="dialog-footer" style="text-aligin: right">
      <el-button @click="cancelHandle">取 消</el-button>
      <el-button type="primary" @click="saveTeacherSalaryAndLevel"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
// 岗位确认弹框内容
import {
  getTeaLevelWithSalaryDic,
  queryTeacherLevelAndSalary,
  saveFixedSalaryInfo
} from '../../api/action/post_match';

export default {
  name: 'post_match_confrim',
  data() {
    return {
      formInline: {
        rating: '',
        monthSalary: ''
      },
      levelOptions: [],
      salaryOptions: [],
      originOptions: [] // 原始的选项
    };
  },
  props: {
    teaId: {
      type: Number,
      default: null
    },
    teacherType: null,
    bu: null
  },
  mounted() {
    this.queryTeaLevelAndSalaryDic();
    this.queryCurrentTeacherLevelAndSalray();
  },
  methods: {
    submitConfirmForm(cb) {
      cb('数据');
    },
    queryTeaLevelAndSalaryDic() {
      let params = {
        TEACHER_ORIGIN: this.teacherType,
        bu: this.bu,
        teaId: this.teaId
      };
      getTeaLevelWithSalaryDic(params).then((res) => {
        let { data } = res;
        if (data && data.children) {
          let d = data.children;
          this.originOptions = d;
          this.levelOptions = d.map((item) => {
            return {
              value: item.value,
              label: item.label
            };
          });
          this.salaryOptions = d.map((item) => {
            return {
              value: item.extendValue,
              label: item.extendLabel,
              labelValue: item.value
            };
          });
        }
      });
    },
    async queryCurrentTeacherLevelAndSalray() {
      let res = await queryTeacherLevelAndSalary(this.teaId);
      let data = res.data;
      if (data) {
        this.formInline.monthSalary = data.monthSalary;
        this.formInline.rating = data.rating;
      }
    },
    cancelHandle() {
      this.$emit('cancel');
    },
    async saveTeacherSalaryAndLevel() {
      // 成功执行回调cb
      let params = {
        rating: this.formInline.rating,
        monthSalary: this.formInline.monthSalary,
        teaIds: [this.teaId],
        tmpUpdate: true // 是否是弹框提交
      };
      let res = await saveFixedSalaryInfo(params);
      if (res.code == 0) {
        this.$Message({
          type: 'success',
          message: '变更薪资成功'
        });
        this.$emit('confirm');
      }
    },
    selectLevelChange(val) {
      let selectOption = this.originOptions.find((item) => item.value == val);
      this.formInline.monthSalary = selectOption.extendValue;
    }
  }
};
</script>

<style lang="less" scoped>
.red {
  color: red;
}

.post-match-wrapper {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
  margin-top: 10px;
}
</style>
>

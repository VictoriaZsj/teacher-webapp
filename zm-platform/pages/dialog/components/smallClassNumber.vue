
<template>
  <div class="small-class-number-box">
    <el-tabs tab-position="left">
      <el-tab-pane
        v-for="(item,key,index) in childClassList"
        :key="index"
        :label="`班级${index+1}`"
      >
        <div>
          <el-select v-model="item.attentionArr" multiple placeholder="最需要关注的学生(可多选）">
            <el-option
              v-for="student in item.list"
              :key="student.studentId"
              :label="student.first_name"
              :value="student.studentId"
            ></el-option>
          </el-select>
          <br />
          <br />
          <span
            class="stu-name"
            :class="item.activeId===student.studentId?'active':''"
            v-for="student in item.list"
            :key="student.studentId"
            @click="studentChange(key,student.studentId)"
          >{{student.first_name}}({{student.courseCount}})</span>
          <br />
          <br />
          <el-input
            type="textarea"
            :rows="4"
            style="width:100%;"
            placeholder="请详细描述学生的学习情况"
            v-show="item.activeId===student.studentId"
            v-for="student in item.list"
            :key="student.studentId"
            v-model="student.studentCondition"
          ></el-input>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return { childClassList: [], value5: "", value4: [] };
  },
  watch: {
    list(_new) {
      this.childClassList = this.translateData(_new || []);
    }
  },
  mounted() {
    this.childClassList = this.translateData(this.list || []);
  },
  methods: {
    translateData(list) {
      const _ = {};
      list.forEach(item => {
        _[item.classId]
          ? _[item.classId].list.push(item)
          : (_[item.classId] = {
              list: [item],
              attentionArr: [],
              activeId: item.studentId
            });
      });
      return _;
    },
    studentChange(key, studentId) {
      this.childClassList[key].activeId = studentId;
    },
    submitFun() {
      let n = 0;
      const _ = [];
      let flag = true;
      out: for (let key in this.childClassList) {
        let child = this.childClassList[key];
        n++;
        for (let item of child.list) {
          if (item.courseCount !== 0) {
            if (!child.attentionArr || !child.attentionArr.length) {
              flag = false;
              this.$Message.warning(`学生班级${n}中未填写最需要关注的学生`);
              break out;
            }else if (item.studentCondition === "") {
              flag = false;
              this.$Message.warning(
                `学生班级${n}-${item.first_name} 的学习情况未填写`
              );
              break out;
            }
          }
          item.attention = child.attentionArr.includes(item.studentId) ? 1 : 0;
          _.push(item);
        }
      }
      return flag ? _ : flag; //有值没有填写完整，直接返回 false
    }
  }
};
</script>
<style lang="less" scoped>
.stu-name {
  color: #333;
  cursor: pointer;
  margin-right: 20px;
}
.active {
  color: #007fff;
}
</style>
<style lang="less">
.small-class-number-box {
  min-width: 600px;
  .el-tab-pane{
    width:580px;
  }
  .el-tabs__header,
  .el-tabs__content {
    display: inline-block;
    vertical-align: top;
  }
  .el-tabs__content {
    padding-left: 20px;
    min-width: 410px;
  }
  .el-tabs__item {
    display: block;
    text-align: right;
    border-right: 2px solid #e4e7ed;
  }
  .el-tabs__item.is-active {
    color: #007fff;
    border-right: 2px solid #007fff;
  }
}
</style>
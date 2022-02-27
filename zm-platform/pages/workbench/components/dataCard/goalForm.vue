<template>
	<el-form label-width="100px" ref="formName" :rules="rules" :model="form" class="goal-form">
		<el-form-item label="目标条件" prop="targetType">
			<el-input v-model="targetType" disabled></el-input>
		</el-form-item>
		<el-form-item label="目标上限" prop="targetCount" required>
			<el-input-number v-model="form.targetCount" :min="1" :controls="false" @change="handleChange" placeholder="请输入数字"></el-input-number>
		</el-form-item>
		<el-form-item label="开始时间" prop="startDate" >
			<el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" disabled>
			</el-date-picker>
		</el-form-item>
		<el-form-item label="结束时间" prop="endTime" required>
			<el-date-picker v-model="form.endTime" type="date" placeholder="请选择" format='yyyy-MM-dd' :editable='false'>
			</el-date-picker>
		</el-form-item>
	</el-form>
</template>
<script>

let nextDate = new Date((new Date().getTime()) + 24 * 3600 * 1000);
nextDate.setHours(0);
nextDate.setMinutes(0);
nextDate.setSeconds(0);
nextDate.setMilliseconds(0)
export default {
  name: 'GoalForm',
  data() {
    return {
      targetType: '到面人数',
      form: {
        targetType: '0',
        targetCount: '',
        startTime: nextDate,
        endTime: '',
      },
      currentData:{},
      rules: {
        targetCount:[
           { type:'number',required: true, message: '目标上限未填写，请填写后再提交', trigger: 'change' }
        ],
        endTime:[
          { type: 'date', required: true, message: '结束时间未填写，请填写后再提交', trigger: 'change' }
        ]
      }
    };
  },
  props: {
    bu:{
      type:String
    },
    users: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    currentValues(){
       this.$Fetch({
        url: `/api/dataView/statistics/interview/getCurRecruitTarget`,
        method: 'get',

      }).then(result => {
          let { data, code, message } = result;
          if (code == '0') {
            // this.currentData = data;
            if(data&&data.length>0){
              if(this.bu=='1'){
              this.form.targetCount=data[0].targetCount
              this.form.endTime=  new Date(data[0].endTime)
              }else if(this.bu=='2'){
                this.form.targetCount=data[1].targetCount
                this.form.endTime= new Date(data[1].endTime)
              }
            }
          }
          })
        .catch(message => {
          // this.$Message.error({
          //   message,
          // });
        });
    },
    handleChange() {
      if(/^\d+$/.test(this.form.targetCount))return;
      this.form.targetCount = '';
      this.$nextTick(()=>{
        this.form.targetCount = parseInt(this.form.targetCount, 10)
      })
    },
    getValues(activeBu) {
      if(this.bu!=activeBu){
        if(!this.form.targetCount){
            this.$Message.error(`${this.bu=='1'?'1对1':'少儿'}tab的目标上限未填写，请填写后再提交`)
            return false
          }else if(!this.form.endTime){
            this.$Message.error(`${this.bu=='1'?'1对1':'少儿'}tab的结束时间未填写，请填写后再提交`)
            return false
         }
      }

      return new Promise((resolve, reject) => {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            if(this.form.startTime > this.form.endTime){
              this.$Message.error(`${this.bu=='1'?'1对1':'少儿'}结束时间必须≥开始时间`)
              return reject();
            };
            resolve(
              {...this.form}
            )
          } else {
           return reject();
          }
        });

      })
    }
  },
  mounted(){
    this.currentValues()
  }
};
</script>
<style lang="less" scoped>
.el-form {
  margin: 20px;
}
.el-form-item {
  margin-bottom: 12px;
}
.el-input,
.el-input-number {
  width: 300px;
  font-size: 14px;
}

</style>
<style lang="less">
.goal-form {
  .el-form-item__label {
    padding-right: 8px;
    font-size: 14px;
    color: #4a4a4a;
  }
  .el-input.is-disabled .el-input__inner {
        background-color: #EFF1F5;
  }
}
</style>

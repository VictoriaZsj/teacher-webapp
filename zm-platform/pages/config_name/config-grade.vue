<template>
  <div class="config-school">
    <div class="school-container">
      <el-button type="primary" @click="handleAddGrade">新增年级</el-button>
      <div class="school-item">
        <div :class="item.choose ? 'selected': ''" v-for="(item, index) in schoolItems" :key="index" @click="handlerSelectGrade(index, item)">
          <span>{{item.lable}}</span>
          <!-- <i class="el-icon-circle-close" @click="handlerClickDele(index)"></i> -->
        </div>
      </div>
    </div>
    <el-dialog title="新增年级" :modal="modal" size="small" top="5%" v-model="addModel" class="parttime-form"
               @close="handlerCancle">
      <el-form ref="form" :model="schoolForm" label-width="80px" :label-position="labelPosition" size="small">
        <el-form-item label="年级">
          
          <div v-for="(item, index) in schoolForm.schoolName" :key="index">
            <el-input v-model="schoolForm.schoolName[index]" placeholder="最多50字" style="width:190px;"></el-input>
            <!-- <el-button class="add-btn" type="primary" size="small" @click="handlerClickBtn(index)">{{index?'删除':'添加'}}</el-button> -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerCancle">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      entryConfigId: {
        type: Number,
        default: null
      },
      bu: {
        type: String,
        default: ''
      }
    },
    data() {
      return{
        modal: false,
        schoolItems: [],
        addModel: false,
        schoolForm: {
          'schoolName': ['']
        },
        labelPosition: 'right'
      }
    },
    methods: {
      /**
       * 获取年级数据源
       */
      async getGradeData () {
        await this.$Fetch({
          url: '/api/1.0.0/recruitEntryConfig/getEntryConfig',
          method: 'post',
          data: {
            entryConfigId: this.entryConfigId,
            entryConfigType: 2,
            bu: this.bu
          }
        })
          .then(res => {
            const { code, message, data } = res
            if (code === '0' && data) {
              this.schoolItems = data.option
            } else {
              this.$Message({message})
            }
          })
          .catch(err => {
            this.$Message({message: err})
          })
      },
      /**
       * 选择年级
       */
      handlerSelectGrade (index, item) {
        item.choose = !item.choose
        this.schoolItems[index] = item
      },
      /**
       * 新增年级
       */
      handleAddGrade() {
        this.addModel = true
      },
      /**
       * 取消新增年级
       */
      handlerCancle() {
        this.schoolForm = {
          'schoolName': ['']
        }
        this.addModel = false
      },
      /**
       * 新增年级调api
       */
      handlerAddGrade(data) {
        this.$Fetch({
          url: '/api/1.0.0/recruitEntryConfig/addSchoolDictionary',
          method: 'post',
          data: data
        })
          .then(res => {
            const { code, message, data } = res
            if (code === '0' && data) {
              this.$Message({
                message,
                duration: 1000,
                onClose: () => {
                  this.addModel = false
                  this.schoolItems = [...this.schoolItems, data]
                  this.schoolForm.schoolName = ['']                  
                }
              })
            }
          })
          .catch(err => {
            this.$Message({message: err})
          })
      },
      /**
       * 确定新增年级
       */
      handleConfirm() {
        let option = {areaCode: '', bu: this.bu ,lable: this.schoolForm.schoolName[0]}
        if (this.schoolForm.schoolName[0]) this.handlerAddGrade(option)
      },
      /**
       * 确认按钮交互
       */
      handlerClickConfirm() {
        this.$Fetch({
          url: '/api/1.0.0/recruitEntryConfig/updateEntryDetailConfig',
          method: 'post',
          data: {
            entryConfigId: this.entryConfigId,
            entryConfigType: 2,
            option: this.schoolItems
          }
        })
          .then(res => {
            const { code, message } = res
            if (code === '0') {
              this.$Message({message})
            }
          })
          .catch(err => {
            this.$Message({message: err})
          })
      }
    }
  }
</script>

<style scoped>
.school-container{
  width: 96%;
  margin: 10px auto;
}
.school-item{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.school-item>div{
  padding: 10px 25px;
  background-color: #D7D7D7;
  margin: 15px 10px 15px 0;
  font-size: 16px;
  position: relative;
}
.school-item>div:hover{
  cursor: pointer;
  /* color: #00B5FF; */
}
.school-item>div.selected{
  background-color: #00B5FF;
  color: #fff;
}
.school-item>div:hover i{
  display: inline-block;
}
.school-item>div>i{
  display: none;
  position: absolute;
  right: -6px;
  top: -8px;
  font-size: 18px;
}
.add-btn{
  margin-left: 20px;
}
</style>
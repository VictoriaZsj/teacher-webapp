<template>
  <div id="teachTag" class="basic-tab-item">
    <div v-if="!statueText">
      <div class="basic-tab-item-content">
        <div class="tab-item" v-for="(data, index) in teachTagData" :key="index">
          <div class="tab-title">{{data.labelName}}</div>
          <el-form class="basic-message-form" label-position="left" label-width="160px">

            <el-form-item
              v-for="tab in data.children"
              :label='tab.labelName'
              :key='tab.id'
              :prop="'radioItem.' + tab.id + '.value'"
            >
              <div v-if='tab.chooseType === 1'>
                <div class="input-radio-group">
                  <label v-for="(item, index) in tab.items" :key="index">
                    <input :name="'groups_' + tab.id" type="radio" v-model='radioItem[tab.id]' :value='`${tab.id}&${item.id}`'/>
                    <span>{{item.itemName}}</span>
                  </label>
                </div>
              </div>
              <div v-if='tab.chooseType === 2'>
                <el-checkbox-group v-model="checkboxItem">
                  <el-checkbox v-for="(item, index) in tab.items" :label='`${tab.id}&${item.id}`' :key="index">{{item.itemName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div class="basic-tab-item-control">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="confirmState" @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
    <div v-else class="basicinfo-no-data">
      {{statueText}}
    </div>
  </div>
</template>

<script>
  import getTeachTagInfo from './API/getTeachTagInfo'
  import updateTeachTagInfo from './API/updateTeachTagInfo'
  export default {
    data() {
      return {
        statueText: "正在加载...",
        teachTagData: [],
        checkboxItem: [
          '2&1', '2&2', '3&3', '', '3&5'
        ],
        radioItem: {
          6: "6&15",
          11: "11&28"
        },
        singleChoseTagId: [],
        constructObj: {
          'tags': [],
          'teaId': ''
        },
        confirmState: false
      }
    },
    props: [
      'tea-id',
      'tea-statue',
      'teach-tag-permission',//获取老师标签(权限)
      'edit-teach-tag-permission',//修改老师标签(权限)
    ],
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        if(!this.teachTagPermission){
          this.statueText = "您暂时没有权限获取老师标签数据"
          return
        }
        this.statueText = ""
        this.$BMloading("teachTag")
        getTeachTagInfo({
          teaId: this.teaId
        }).then(data => {
          this.teachTagData = data
          this.initData(data)
          this.$BMloadingFinish("teachTag")
        }).catch(message => {
          this.statueText = "暂无数据"
          this.$Message({
            message: message
          });
          this.teachTagData = {};
          this.$BMloadingFinish("teachTag")
          console.log("getSalaryInfo异常:", message)
        })
      },
      saveData () {
        if(!this.editTeachTagPermission){
          this.$Message({
            message: "您暂时没有权限修改老师标签数据"
          });
          return;
        }
        updateTeachTagInfo(this.handleConstructData()).then(data => {
          this.confirmState = false
          this.$Message({
            message: "操作成功"
          });
          this.$emit("confirm")
        }).catch(message => {
          this.confirmState = false
          this.$Message({
            message: message
          })
          console.log("updateSalaryAnPay异常:", message)
        })
      },
      initData (data) {
        this.checkboxItem = []
        this.radioItem = {}
        this.singleChoseTagId = []
        this.constructObj.teaId = this.teaId
        data.map(data => {
          data.children.map(tags => {
            this.constructObj.tags.push({
              'tagId': tags.id,
              'items': []
            })
            if (tags.chooseType === 1) {
              let flag = false
              this.singleChoseTagId.push(tags.id)
              tags.items.map(item => {
                if (item.choose) {
                  this.radioItem[tags.id] = `${item.tagId}&${item.id}`
                  flag = true
                }
              })
              if (!flag) this.radioItem[tags.id] = ''
            }
            if (tags.chooseType === 2) {
              tags.items.map(item => {
                if (item.choose) this.checkboxItem.push(`${item.tagId}&${item.id}`)
                if (!item.choose) this.checkboxItem.push('')
              })
            }
          })
        })
      },
      handleConstructData () {
        this.checkboxItem.map(item => {
          let itemArray = []
          let subArray = this.constructObj.tags
          if (item !== '') {
            itemArray = item.split('&')
          }
          subArray.map(tag => {
            if (Number(itemArray[0]) == tag.tagId) {
              tag.items.push({
                'itemId': itemArray[1]
              })
            }
          })
        })

        this.singleChoseTagId.map(item => {
          let itemArray = []
          let subArray = this.constructObj.tags
          if (this.radioItem[item] !== '') {
            itemArray = this.radioItem[item].split('&')
          }
          subArray.map(tag => {
            if (Number(itemArray[0]) == tag.tagId) {
              tag.items.push({
                'itemId': itemArray[1]
              })
            }
          })
        })
        return this.constructObj
      },
      cancel() {
        this.$emit("cancel")
      },
      confirm() {
        this.saveData()
      }
    }
  }
</script>

<style scoped>
.tab-item{
  margin: 20px;
}
.tab-title{
  font-size: 18px;
}
.input-radio-group{
  display: inline-block;
}
.input-radio-group label{
  min-width: 100px;
  font-weight: 500;
}
.input-radio-group input,
.input-radio-group span{
  display: inline-block;
  margin: 0;
}
.input-radio-group span{
  padding-left: 3px;
}
.input-radio-group input:checked{
  background-color: #409EFF;
}
.input-radio-group input:checked+span{
  color: #409EFF;
}
/* .el-button{
  padding: 0 20px;
} */
</style>

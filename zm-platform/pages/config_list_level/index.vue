<template>
  <div class="context">
    <p>注：适用于BU=1对1,少儿，优课，工作性质=全职，校招全职</p>
    <br />
    <table cellspacing="0" width="100%">
      <tr>
        <th>所属BU</th>
        <th>名单等级ID</th>
        <th>名单等级</th>
        <th>名单等级描述</th>
        <th>创建时间</th>
        <th>更新人</th>
        <th>更新时间</th>
        <th>操作</th>
      </tr>
      <template v-for="pItem in tableData" >
        <tr v-for="(item,index) in pItem.list" :key="index">
          <td :rowspan="pItem.list.length" v-if="index===0">{{pItem.type}}</td>
          <td>{{item.id}}</td>
          <td>{{item.tagName}}</td>
          <td>
            <el-tooltip class="item" effect="dark" :content="item.description" placement="top">
              <p class="des-box">{{item.description}}</p>
            </el-tooltip>
          </td>
          <td>{{filterTime(item.createdAt)}}</td>
          <td>{{item.operatorName}}</td>
          <td>{{filterTime(item.updatedAt)}}</td>
          <td>
            <el-button type="text" v-if="checkPermission('tea:config:list-level:edit',item.tagName)" size="small" @click="edit(item.id)">编辑</el-button>
            <el-button type="text" v-if="checkPermission('tea:config:list-level:show',item.tagName)" size="small" @click="show(item.id)">查看详情</el-button>
          </td>
        </tr>
      </template> 
    </table>
    <edit-box ref="editComponent" @success="getData"></edit-box>
  </div>
</template>

<script>
import editBox from './component/editBox.vue'
export default {
  components:{
    editBox
  },
  data() {
    return {
      tableData:[]
    };
  },
  mounted(){
    this.getData();
  },
  methods: {
    checkPermission(permissionName,tagName){
        return ((this.$store.getters.permissionList || []).indexOf(permissionName)>-1)&&tagName!=='C';
    },
    getData(){
      this.$Fetch({
        url: "/api/1.0.0/teacherTag/getAllLayerTagList",
        method: "get"
      })
        .then(result => {
          this.tableData = [
            {list:result.data.filter(item=>item.bu==='ZM_1V1'),type:'1对1'},
            {list:result.data.filter(item=>item.bu==='ZM_CHILD'),type:'少儿'},
            {list:result.data.filter(item=>item.bu==='ZM_UKE'),type:'优课'}
          ]
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    edit(id){
      this.$refs.editComponent.init(id,'edit');
    },
    show(id){
      this.$refs.editComponent.init(id,'show');
    },
    filterTime(val){
     return this.$DateTool.format(val, "yyyy-MM-dd HH:mm:ss")
    }
  }
};
</script>
<style lang="less" scoped>
.context {
  background-color: #fff;
  padding: 20px;
  table {
    border: 1px solid #f1f1f1;
    tr {
      td,
      th {
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #f1f1f1;
        border-right: 1px solid #f1f1f1;
      }
      th {
        background-color: #f4f5f5;
      }
      .des-box{
        margin:0 auto;
        width:200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
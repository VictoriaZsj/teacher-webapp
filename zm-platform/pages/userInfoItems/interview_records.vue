<template>
    <div>
      <div class="content">
        <el-table :data="userDetailDataReviewRecords" style="width:100%">
          <el-table-column align="center"  :formatter="transformDate" prop="createdTime" label="操作时间" width="200">
          </el-table-column>
          <el-table-column align="center" prop="createdUser" label="操作人" width="180">
          </el-table-column>
          <el-table-column align="center" prop="operateTypeStr" label="操作类型" width="200">
          </el-table-column>
          <el-table-column align="center" label="详情">
            <template scope="scope">
              <span v-if="!!scope.row.interviewEvaluateJson" @click="showDetails(scope.row.interviewEvaluateJson,scope.row.remark)" class="detailsBtn">详情</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作结果" >
            <template scope="scope">
              {{scope.row.operateResult}}{{scope.row.operateSecondResult}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="remark" width="200">
            <template scope="scope">
              <el-tooltip placement="top" effect="light">
                <div slot="content">{{scope.row.remark ? scope.row.remark : ''}}</div>
                <el-button type="text" class="markStyle" v-if="scope.row.remark">{{scope.row.remark ? scope.row.remark : ''}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
</template>
<script>



export default {
  props:{
    userDetailDataReviewRecords:Array
  },
  data(){
    return {

    }
  },
  methods:{
    transformDate(row, column) {
        return this.$DateTransform(row[column.property]);
    },
    showDetails(data,mark){
      this.$root.$children[0].showInterviewDetails(data,mark)
    }
  },
  components:{

  }
}
</script>
<style scoped media="screen">
  .content{
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    margin: -20px;
    background-color: white;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    margin-top: 20px;
    background-color: #f4f5f5;
  }
  .detailsBtn{
    cursor: pointer;
    color: #06C;
  }
  .markStyle{
    width: 170px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #666;
  }
</style>

<template>
  <div @click="cancel()" class="back">
    <div @click.stop="contentClick()" class="content">
      <div class="head">
        面试评价
        <span @click="cancel()" class="closeIcon">&times;</span>
      </div>
      <div class="body">
        <div class="ruleTagsItem">
          <h3>评价人:</h3>
          <div  class="ruleTagsSubItem">
            <span>{{data.userName}}</span>
          </div>
        </div>
        <div class="ruleTagsItem">
          <h3>面试结果:</h3>
          <div  class="ruleTagsSubItem">
            <span>{{data.evaResult}}</span>
          </div>
        </div>
        <div class="ruleTagsItem">
          <h3>总体评价:</h3>
          <div  class="ruleTagsSubItem">
            <span>{{!!data.evaJudge ? data.evaJudge : (!!data.resultRuleCommentVO ? data.resultRuleCommentVO.comment : '')}}</span>
          </div>
        </div>
        <div v-for="(item,index) in data.resultRuleTag" class="ruleTagsItem">
          <h3>{{item.tagName}}:{{item.scoreType == "评分项" ? item.totalScore + "分" : ""}}</h3>
          <div v-for="(_item,_index) in item.resultTags" class="ruleTagsSubItem">
            <strong>{{_item.name}}:</strong>
            <span v-for="(__item,__index) in _item.resultTagItemVO">{{__item.name}}</span>
          </div>
        </div>
        <div class="ruleTagsItem">
          <h3>备注:</h3>
          <div  class="ruleTagsSubItem">
            <span>{{data.evaRemark ? data.evaRemark : ''}}</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>
<script>

export default {
    data() {
        return {

        }
    },
    props:{
        viewState:false,//false表示页面关闭，true表示页面展开
        data:{},
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{

        }
      }
    },
    methods:{
        cancel (data) {
            this.$emit("cancel");
        },
        contentClick () {

        },
        default () {

        }
    }
}
</script>
<style scoped>
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
    .back{
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.9);
      z-index: 9999;
    }
    .content{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 400px;
      height: 90%;
      margin: 0 auto;
      background-color: white;
      padding: 40px 20px;
    }
    .content .head{
      position: absolute;
      top:0;
      left:0;
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 100%;
      border-bottom: 1px solid #ddd;
    }
    .content .head .closeIcon{
      position: absolute;
      top:0px;
      right: 10px;
      height: 40px;
      line-height: 40px;
    }
    .ruleTagsItem{
      padding: 5px 0;
    }
    .body{
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .ruleTagsSubItem{
      text-indent: 4px;
    }

</style>

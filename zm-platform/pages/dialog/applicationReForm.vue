<template>
  <div class="box">
    <p class="h-title">{{infoData.ruleName}}</p>
    <div class="info">
      <p class="info-item">总得分： <span>{{infoData.evaScore}}分</span></p>
      <p class="info-item">评价结果：{{infoData.evaJudge}}</p>
      <p class="info-item" v-if="infoData.targetStage==='mianshi'">面试结果：{{infoData.evaResult}}</p>
      <p class="info-item">计算方式：{{infoData.calType | calTypeFilter}}</p>
      <p class="info-item">评价人：{{infoData.commentName}}</p>
      <p class="info-item">评价阶段：{{infoData.targetStageDesc}}</p>
      <p>备注：{{infoData.evaRemark}}</p>
    </div>
    <p class="item-title">基本信息</p>
    <div class="base-info">
      <span>姓名：{{infoQuery.name}}</span>
      <span>年级：{{infoQuery.grade}}</span>
      <span>科目：{{infoQuery.subject}}</span>
      <span>类型：{{infoQuery.type}}</span>
      <span>教师资格证：{{infoData.teacherLicenseState}}</span>
      <span>个人优势：{{infoData.specialAdvantageDesc}}</span>
    </div>
    <template v-for="(item,index) in resultRuleTag">
      <div class="tab-box" :key="index" v-if="item.has"> 
        <p class="item-title" >
          {{item.tagName}}【{{item.scoreType | scoreTypeFilter}}】 
          <span v-if="['pingfenjia','pingfenjian'].includes(item.scoreType)">{{item.scoreType==='pingfenjian'?'扣分':'加分'}}：{{item.itemScore}}</span>  
        </p>
        <table width="100%" border="1" cellspacing="0" align="left"  >
          <tr>
            <th>标签子项名称</th>
            <th>子标签名称</th>
            <th v-if="['pingfenjia','pingfenjian'].includes(item.scoreType)">{{item.scoreType==='pingfenjian'?'扣分项':'加分项'}}</th>
          </tr>
          <template v-for="(tag,tagIndex) in item.resultTags">
            <tr :key="index+'-'+tagIndex" v-if="tag.resultTagItemVO.length>0"> 
              <td>&nbsp;{{tag.name}}</td>
              <td>
                <p v-for="(tagItemVO,tagItemVOIndex) in tag.resultTagItemVO" :key="index+'-'+tagIndex+'-'+tagItemVOIndex">
                  <!-- 星星模式 -->
                  <template v-if="tag.tagType==1&&['biaoji'].includes(item.scoreType)"> 
                    <rate v-model="tagItemVO.score" style="margin-top: 8px;"></rate>
                  </template>
                  <!-- 其他 -->
                  <template v-else>
                    {{tagItemVO.name}}
                  </template>
                </p>
              </td>
              <td v-if="['pingfenjia','pingfenjian'].includes(item.scoreType)">
                <p v-for="(tagItemVO,tagItemVOIndex) in tag.resultTagItemVO" :key="index+'-'+tagIndex+'-'+tagItemVOIndex">{{tagItemVO.score||0}}</p>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </template>
    <p v-if="!hasResultTag" style="text-align:center;line-height:100px;font-size:12px;">未找到任何给到结果的标签项目</p>

    <br><br>
  </div>
</template>

<script>
  import fetch from '../../../src/utils/fetch';
  import rate from './components/rate.vue'

  export default {
    name: "applicationReForm",
    components:{
      rate
    },
    data() {
      return {
        infoData: {},
        resultRuleTag: [],
        infoQuery: {},
        hasResultTag: false
      };
    },
    methods: {
      init(id) {
        fetch({
          url: '/api/newInterviewService/get_evaluation_new',
          method: 'post',
          data: {
            id
          }
        }).then(res => {
          if(res.data.specialAdvantages && res.data.specialAdvantages.length) {
            let val = '';
            res.data.specialAdvantages.forEach(r=>{
              val += `${r.advantageDesc},`
            })
            if(val) val = val.substring(0,val.length-1);
            res.data.specialAdvantageDesc = val;
          }
          this.infoData = res.data;
          this.setResultRuleTag(res.data.resultRuleTag);
        });
        this.getInfoQuery(id);
      },
      getInfoQuery(id) {
        fetch({
          url: '/api/newInterviewService/get_evaluation_teacher_info',
          method: 'post',
          data: {
            id
          }
        }).then(res => {
          this.infoQuery = res.data;
        });
      },
      setResultRuleTag(data) {
        let hasResultTag = false;//是否所有的标签都没有结论
        const _ = data.map(item => {
          let has = false;
          let itemScore = 0;
          item.resultTags.forEach(tag => {
            //所有的标签都没有结论（都无则显示‘未找到任何给到结果的标签项目’） + 每个标签项是否都无子级（无则不显示）
            if (!has && tag.resultTagItemVO.length > 0) {
              has = true;
              if (!hasResultTag) hasResultTag = true;
            }
            //获取每个选项之和
            tag.resultTagItemVO.map(son => {
              itemScore += son.score;
            });
            return tag
          });
          return {
            itemScore,
            has,
            ...item
          };
        });
        this.resultRuleTag = _;
        this.hasResultTag = hasResultTag;
      }
    },
    filters: {
      scoreTypeFilter(val) {
        switch (val) {
          case "pingfenjia":
            return "评分项(加)";
          case "pingfenjian":
            return "评分项(减)";
          case "foujue":
            return "否决项";
          case "biaoji":
            return "标记项";
          default:
            return val || "--";
        }
      },
      calTypeFilter(val) {
        switch (val) {
          case 0:
            return "加分计算";
          case 1:
            return "减分计算";
          default:
            return "--";
        }
      }
    }
  };
</script>

<style lang='less' scoped>
  .box {
    border: 1px solid #ccc;
    width: 960px;
    min-height: 600px;
    padding: 0 20px;

    .h-title {
      line-height: 60px;
      font-size: 20px;
      text-align: center;
    }

    .info {
      border-bottom: 1px solid #ccc;
      padding-bottom: 14px;
      overflow: hidden;
      clear: both;

      p {
        float: left;
        margin-bottom: 4px;
      }

      .info-item {
        width: 33%;

        span {
          font-weight: bold;
        }
      }
    }

    .item-title {
      line-height: 24px;
      border-left: 4px solid #409eff63;
      padding-left: 12px;
      font-weight: bold;
      margin: 20px 0;
    }

    .base-info {
      padding: 0 10px;

      span {
        padding-right: 30px;
      }
    }

    table {
      border-color: #fff;

      th {
        text-align: left;
        color: #909399;
        padding: 4px 2px;
      }

      td {
        text-align: left;
        color: #909399;
        padding: 0;

        p {
          border-bottom: 1px solid #909399;
          line-height: 24px;
          padding: 0 4px;
        }

        p:last-child {
          border-bottom: none;
        }
      }
    }

    .tab-box {
      overflow: hidden;
      clear: both;
    }
  }
</style>

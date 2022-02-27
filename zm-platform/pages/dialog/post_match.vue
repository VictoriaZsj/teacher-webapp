<template>
  <div class="post-match-wrapper">
    <div class="section">
      <div class="title" style="font-size: 18px">
        <p>提示：老师当前岗位和基本信息不匹配，无法发起合同</p>
        <p>有以下处理方案：</p>
      </div>
    </div>

    <div class="section">
      <p style="color: #999999">
        <i class="el-icon-information icon" style="color: #999999"></i
        >老师当前岗位和基础信息不匹配，请检查BU/工作性质/老师类型/学段等信息
      </p>
    </div>
    <div class="section" v-if="matchedPosts.length > 0">
      <div class="title">
        <i class="el-icon-information icon"></i>使用系统推荐岗位
      </div>
      <div class="s-con">
        <el-radio
          v-for="(item, index) in matchedPosts"
          :key="index"
          v-model="selectPost"
          :label="item.postCode"
          ><span>{{ item.postName }}</span></el-radio
        >
        <br />
      </div>
      <!-- <div v-else class="s-con">暂无匹配岗位</div> -->
    </div>
    <p class="tips red">注意：老师岗位关联薪资体系，请仔细确认</p>
  </div>
</template>

<script>
// 岗位匹配弹框内容
import { queryPostMatch, confirmPostMatch } from '../../api/action/post_match';
export default {
  name: 'post_match',
  data() {
    return {
      selectPost: '',
      matchedPosts: []
    };
  },
  props: {
    teaId: {
      type: Number,
      default: null
    },
    signReason: {
      type: String,
      default:
        '老师当前岗位和基础信息不匹配，请检查BU/工作性质/老师类型/学段等信息'
    }
  },
  mounted() {
    this.queryPostMatchInfo();
  },
  methods: {
    queryPostMatchInfo() {
      let teaId = this.teaId;
      queryPostMatch(teaId).then((res) => {
        if (res.code == 0) {
          this.matchedPosts = res.data.matchedPosts || [];
        }
      });
    },
    selctPostMatchHandle(cb) {
      if (!this.selectPost && this.matchedPosts.length !== 0) {
        this.$Message('请选择推荐岗位');
        return;
      } else {
        let selectPost = this.matchedPosts.find(
          (item) => item.postCode === this.selectPost
        );
        if (this.matchedPosts.length === 0) {
          cb(null);
        } else {
          let params = {
            teaId: this.teaId,
            postVersion: selectPost.postVersion,
            postCode: selectPost.postCode
          };

          confirmPostMatch(params).then((res) => {
            if (res.code == 0) {
              cb(res);
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.red {
  color: red;
}

.post-match-wrapper {
  color: #333;
  font-size: 14px;
  .icon {
    color: #1d90e6;
    margin-right: 10px;
  }
  .section {
    margin-bottom: 10px;

    .title {
      margin-bottom: 10px;
    }

    .s-con {
      padding-left: 23px;
    }
  }
}
</style>
>

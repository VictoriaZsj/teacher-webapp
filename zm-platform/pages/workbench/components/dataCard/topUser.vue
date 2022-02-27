<template>
	<div class="top-user">
    <el-tooltip :disabled="users.length < 3" placement="top" class="top-user-tooltip">
      <div slot="content">
        <p class="tip-user" v-for="(item, index) in tipUsers" :key="index">{{item}}</p>
      </div>
      <div>
        <div v-for="(user, index) in showUsers" :key="index" class="user"><span class="iconfont icon-huangguan"></span><span class="name">{{user}}</span></div>
      </div>
    </el-tooltip>
	</div>
</template>
<script>
export default {
  name: 'TopUser',
  data() {
    return {

    };
  },
  computed: {
    showUsers() {
      return this.users.slice(0, 2);
    },
    tipUsers() {
      let user = [];
      let lastIndex = this.users.length - 1;
      this.users.forEach((item, index)=>{
        let item1 = index === lastIndex ? item : item + '、';
        if(index % 2){
          user[Math.floor(index/2)].push(item1)
        }else{
          user.push([item1])
        }
      });
      return user.map(item=>item.join(''));
    }
  },
  props: {
    users: {
      type: Array,
      default() {
        return []
      },
    },
  },
};
</script>
<style lang="less" scoped>
.top-user {
  margin-left: 12px;
  display: inline-block;
}
.top-user-tooltip {
  display: flex;
}
.user {
  margin-right: 8px;
  padding: 0 6px;
  height: 24px;
  border: 1px solid #FFD743;
  font-size: 12px;
  color: #666;
  border-radius:12px;
  .iconfont {
    margin-right: 4px;
    font-size: 8px;
    color: #FFD200;
  }
}
.tip-user {
  font-size: 14px;
  line-height: 22px;
}
</style>